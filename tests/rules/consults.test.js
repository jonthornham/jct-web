// firestore.rules on the Firestore emulator (project demo-jct, port 38180).
// Run with `npm run test:rules` (starts the emulator, runs this, stops it).
import assert from 'node:assert/strict';
import { after, before, beforeEach, describe, test } from 'node:test';
import { readFileSync } from 'node:fs';
import {
	assertFails,
	assertSucceeds,
	initializeTestEnvironment
} from '@firebase/rules-unit-testing';
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	serverTimestamp,
	setDoc,
	updateDoc,
	Timestamp
} from 'firebase/firestore';
import { HONEYPOT, LIMITS, STAGES, toConsult } from '../../src/lib/intake.js';

let env;
let db;

before(async () => {
	env = await initializeTestEnvironment({
		projectId: 'demo-jct',
		firestore: {
			rules: readFileSync('firestore.rules', 'utf8'),
			host: '127.0.0.1',
			port: 38180
		}
	});
});
beforeEach(async () => {
	await env.clearFirestore();
	db = env.unauthenticatedContext().firestore();
});
after(() => env?.cleanup());

const good = () => ({
	name: 'Dana Reyes',
	email: 'dana@example.com',
	company: 'Example Co.',
	stage: 'Prototype',
	blocker: 'Our quotes from two factories are three times apart.',
	createdAt: serverTimestamp()
});
const add = (data) => addDoc(collection(db, 'consults'), data);
const without = (key) => {
	const d = good();
	delete d[key];
	return d;
};

describe('consults: allowed', () => {
	test('a complete request, without a link', () => assertSucceeds(add(good())));
	test('with an https:// link', () =>
		assertSucceeds(add({ ...good(), link: 'https://example.com/deck' })));
	test('every one of the five stages', async () => {
		for (const stage of STAGES) await assertSucceeds(add({ ...good(), stage }));
	});
	test('fields at their length limits', () =>
		assertSucceeds(
			add({
				...good(),
				name: 'n'.repeat(LIMITS.name),
				email: 'a'.repeat(LIMITS.email - 12) + '@example.com',
				company: 'c'.repeat(LIMITS.company),
				blocker: 'b'.repeat(LIMITS.blocker),
				link: 'https://e.co/' + 'x'.repeat(LIMITS.link - 13)
			})
		));
	test("the form's own document (toConsult) passes", () =>
		assertSucceeds(
			add({
				...toConsult({ ...good(), link: 'example.com' }),
				createdAt: serverTimestamp()
			})
		));
});

describe('consults: refused', () => {
	for (const key of ['name', 'email', 'company', 'stage', 'blocker', 'createdAt'])
		test(`missing ${key}`, () => assertFails(add(without(key))));

	test('an extra field', () => assertFails(add({ ...good(), phone: '555' })));
	test(`the honeypot field ("${HONEYPOT}")`, () =>
		assertFails(add({ ...good(), [HONEYPOT]: 'spam' })));
	test('emailedAt or emailError set by the browser', async () => {
		await assertFails(add({ ...good(), emailedAt: serverTimestamp() }));
		await assertFails(add({ ...good(), emailError: 'x' }));
	});

	test('fields over their limits', async () => {
		await assertFails(add({ ...good(), name: 'n'.repeat(LIMITS.name + 1) }));
		await assertFails(add({ ...good(), company: 'c'.repeat(LIMITS.company + 1) }));
		await assertFails(add({ ...good(), blocker: 'b'.repeat(LIMITS.blocker + 1) }));
		await assertFails(add({ ...good(), email: 'a'.repeat(LIMITS.email) + '@example.com' }));
		await assertFails(add({ ...good(), link: 'https://e.co/' + 'x'.repeat(LIMITS.link) }));
	});
	test('empty or blank required fields', async () => {
		await assertFails(add({ ...good(), name: '' }));
		await assertFails(add({ ...good(), company: '   ' }));
		await assertFails(add({ ...good(), blocker: '' }));
	});
	test('not strings', async () => {
		await assertFails(add({ ...good(), name: 42 }));
		await assertFails(add({ ...good(), blocker: ['a'] }));
	});
	test('a bad email', async () => {
		await assertFails(add({ ...good(), email: 'dana@' }));
		await assertFails(add({ ...good(), email: 'dana example.com' }));
	});
	test('a stage outside the five', async () => {
		await assertFails(add({ ...good(), stage: 'Scaling' }));
		await assertFails(add({ ...good(), stage: 'idea' }));
	});
	test('a link that is not https://', async () => {
		await assertFails(add({ ...good(), link: 'http://example.com' }));
		await assertFails(add({ ...good(), link: 'javascript:alert(1)' }));
		await assertFails(add({ ...good(), link: 'example.com' }));
		await assertFails(add({ ...good(), link: 'https://exa mple.com' }));
		await assertFails(add({ ...good(), link: '' }));
	});
	test("a timestamp that isn't the server's", async () => {
		await assertFails(add({ ...good(), createdAt: Timestamp.fromDate(new Date('2026-01-01')) }));
		await assertFails(add({ ...good(), createdAt: 'now' }));
	});
});

describe('consults: no read, update or delete', () => {
	let ref;
	beforeEach(async () => {
		await env.withSecurityRulesDisabled(async (ctx) => {
			ref = doc(ctx.firestore(), 'consults/existing');
			await setDoc(ref, { ...good(), createdAt: Timestamp.now() });
		});
		ref = doc(db, 'consults/existing');
	});
	test('read one', () => assertFails(getDoc(ref)));
	test('list', () => assertFails(getDocs(collection(db, 'consults'))));
	test('update', () => assertFails(updateDoc(ref, { name: 'Someone else' })));
	test('overwrite with set', () => assertFails(setDoc(ref, { ...good(), name: 'Someone else' })));
	test('delete', () => assertFails(deleteDoc(ref)));
	test('signed-in users get nothing extra', async () => {
		const authed = env.authenticatedContext('someone').firestore();
		await assertFails(getDoc(doc(authed, 'consults/existing')));
		await assertFails(deleteDoc(doc(authed, 'consults/existing')));
	});
});

describe('everything else is denied', () => {
	test('other collections', async () => {
		await assertFails(setDoc(doc(db, 'users/a'), { a: 1 }));
		await assertFails(getDoc(doc(db, 'users/a')));
		await assertFails(addDoc(collection(db, 'bookings'), good()));
	});
	test('subcollections under consults', () =>
		assertFails(setDoc(doc(db, 'consults/x/notes/y'), { a: 1 })));
});

test('the rules file names the same five stages as the form', () => {
	const rules = readFileSync('firestore.rules', 'utf8');
	const list = rules.match(/d\.stage in \[([^\]]+)\]/)[1];
	assert.deepEqual(
		[...list.matchAll(/'([^']+)'/g)].map((m) => m[1]),
		STAGES
	);
	for (const [field, max] of Object.entries(LIMITS))
		assert.match(rules, new RegExp(`text\\(d\\.${field}, ${max}\\)`), `${field} limit ${max}`);
});
