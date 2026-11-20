// The whole Free Consult path on the emulators (Firestore 38180 + Functions, project demo-jct):
// the form's submit flow writes through the real rules, and the Cloud Function picks the
// document up, "sends" the email (logged in the emulator, never Mailjet) and sets emailedAt.
// Run with `npm run test:emulators`.
import assert from 'node:assert/strict';
import { after, before, beforeEach, describe, test } from 'node:test';
import { readFileSync } from 'node:fs';
import { initializeTestEnvironment } from '@firebase/rules-unit-testing';
import { addDoc, collection, getDocs, serverTimestamp } from 'firebase/firestore';
import { HONEYPOT, MIN_MS, submitConsult } from '../../src/lib/intake.js';

let env;

before(async () => {
	env = await initializeTestEnvironment({
		projectId: 'demo-jct',
		firestore: { rules: readFileSync('firestore.rules', 'utf8'), host: '127.0.0.1', port: 38180 }
	});
});
beforeEach(() => env.clearFirestore());
after(() => env?.cleanup());

const visitor = {
	name: 'Dana Reyes',
	email: 'dana@example.com',
	company: 'Example Co.',
	stage: 'Prototype',
	blocker: 'Our quotes from two factories are three times apart.',
	link: 'example.com/deck'
};

// The browser's save, against the emulator, as an anonymous visitor (the rules apply).
const browserSave = (doc) =>
	addDoc(collection(env.unauthenticatedContext().firestore(), 'consults'), {
		...doc,
		createdAt: serverTimestamp()
	});

const allConsults = async () => {
	let docs = [];
	await env.withSecurityRulesDisabled(async (ctx) => {
		docs = (await getDocs(collection(ctx.firestore(), 'consults'))).docs.map((d) => d.data());
	});
	return docs;
};

async function waitFor(check, ms = 20000) {
	const end = Date.now() + ms;
	for (;;) {
		const v = await check();
		if (v) return v;
		if (Date.now() > end) return null;
		await new Promise((r) => setTimeout(r, 250));
	}
}

describe('Free Consult on the emulators', () => {
	test('a good request is saved, then the function emails it and sets emailedAt', async () => {
		const result = await submitConsult(visitor, {
			honeypot: '',
			startedAt: Date.now() - MIN_MS - 1000,
			save: browserSave
		});
		assert.equal(result, 'sent');
		const doc = await waitFor(async () => (await allConsults()).find((d) => d.emailedAt));
		assert.ok(doc, 'emailedAt was set by the function');
		assert.equal(doc.emailError, undefined);
		assert.equal(doc.link, 'https://example.com/deck');
		assert.equal(doc.email, 'dana@example.com');
	});

	test('a bot (honeypot filled) gets "sent", and nothing is written', async () => {
		let saves = 0;
		const result = await submitConsult(visitor, {
			honeypot: 'https://spam.example',
			startedAt: Date.now() - 60000,
			save: async (d) => {
				saves++;
				return browserSave(d);
			}
		});
		assert.equal(result, 'sent');
		assert.equal(saves, 0);
		await new Promise((r) => setTimeout(r, 1500));
		assert.equal((await allConsults()).length, 0, 'no document, so the function never runs');
	});

	test('a bot (sent in under 3 seconds) gets "sent", and nothing is written', async () => {
		let saves = 0;
		const result = await submitConsult(visitor, {
			honeypot: '',
			startedAt: Date.now(),
			save: async () => saves++
		});
		assert.equal(result, 'sent');
		assert.equal(saves, 0);
		assert.equal((await allConsults()).length, 0);
	});

	test('a bot posting straight to Firestore with the honeypot field is refused', async () => {
		await assert.rejects(browserSave({ ...visitor, link: 'https://x.co', [HONEYPOT]: 'spam' }));
		assert.equal((await allConsults()).length, 0);
	});
});
