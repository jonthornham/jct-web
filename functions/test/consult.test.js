// The email function's logic, with a fake Mailjet (no network). `npm test` in functions/.
import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { JCT_EMAIL, MAILJET_URL, buildMessage, handleConsult, sendMailjet } from '../consult.js';

const consult = {
	name: 'Dana Reyes',
	email: 'dana@example.com',
	company: 'Example Co.',
	stage: 'Prototype',
	blocker: 'Our quotes from two factories are three times apart.',
	link: 'https://example.com/deck'
};

const quietLog = () => {
	const lines = [];
	return {
		lines,
		info: (...a) => lines.push(['info', ...a]),
		error: (...a) => lines.push(['error', ...a])
	};
};

const fakeFetch = (status, body) => {
	const calls = [];
	const fn = async (url, init) => {
		calls.push({ url, init, body: JSON.parse(init.body) });
		return { ok: status >= 200 && status < 300, status, json: async () => body };
	};
	fn.calls = calls;
	return fn;
};

const OK = { Messages: [{ Status: 'success', To: [{ Email: JCT_EMAIL }] }] };

describe('the email', () => {
	test('goes to Jon only, with the visitor as Reply-To', () => {
		const m = buildMessage(consult, 'abc');
		assert.deepEqual(
			m.To.map((t) => t.Email),
			[JCT_EMAIL]
		);
		assert.equal(m.From.Email, JCT_EMAIL);
		assert.equal(m.ReplyTo.Email, 'dana@example.com');
		assert.equal(m.Cc, undefined);
		assert.equal(m.Bcc, undefined);
		assert.ok(!JSON.stringify(m.To).includes('dana@example.com'));
	});
	test('holds every field, as plain text', () => {
		const m = buildMessage(consult, 'abc');
		for (const v of Object.values(consult)) assert.ok(m.TextPart.includes(v), v);
		assert.ok(m.TextPart.includes('consults/abc'));
		assert.equal(m.HTMLPart, undefined);
	});
	test('no line breaks in the subject or names', () => {
		const m = buildMessage({ ...consult, name: 'Dana\r\nBcc: x@y.z', company: 'A\nB' }, 'abc');
		assert.ok(!/[\r\n]/.test(m.Subject));
		assert.ok(!/[\r\n]/.test(m.ReplyTo.Name));
	});
});

describe('handleConsult', () => {
	test('a good document: one Mailjet call, then emailed', async () => {
		const fetch = fakeFetch(200, OK);
		const log = quietLog();
		const result = await handleConsult(consult, {
			id: 'abc',
			emulator: false,
			log,
			send: (m) => sendMailjet(m, { apiKey: 'k', secretKey: 's', fetch })
		});
		assert.deepEqual(result, { emailed: true });
		assert.equal(fetch.calls.length, 1);
		const call = fetch.calls[0];
		assert.equal(call.url, MAILJET_URL);
		assert.equal(call.init.headers.Authorization, 'Basic ' + Buffer.from('k:s').toString('base64'));
		assert.equal(call.body.Messages.length, 1);
		assert.deepEqual(
			call.body.Messages[0].To.map((t) => t.Email),
			[JCT_EMAIL]
		);
	});

	test('a send failure: logged, emailError returned, no retry', async () => {
		const fetch = fakeFetch(401, { ErrorMessage: 'API key authentication/authorization failure' });
		const log = quietLog();
		const result = await handleConsult(consult, {
			id: 'abc',
			emulator: false,
			log,
			send: (m) => sendMailjet(m, { apiKey: 'k', secretKey: 'bad', fetch })
		});
		assert.match(result.emailError, /Mailjet 401/);
		assert.equal(result.emailed, undefined);
		assert.equal(fetch.calls.length, 1, 'no retry');
		assert.equal(log.lines.filter((l) => l[0] === 'error').length, 1);
		assert.ok(!JSON.stringify(log.lines).includes('bad'), 'the secret is never logged');
	});

	test('Mailjet answers 200 but the message failed: still an error', async () => {
		const fetch = fakeFetch(200, { Messages: [{ Status: 'error', Errors: [{ ErrorCode: 'x' }] }] });
		const result = await handleConsult(consult, {
			id: 'abc',
			emulator: false,
			log: quietLog(),
			send: (m) => sendMailjet(m, { apiKey: 'k', secretKey: 's', fetch })
		});
		assert.match(result.emailError, /Mailjet 200 error/);
	});

	test('a network error or missing keys: emailError', async () => {
		const down = async () => {
			throw new Error('getaddrinfo ENOTFOUND api.mailjet.com');
		};
		const r1 = await handleConsult(consult, {
			id: 'a',
			emulator: false,
			log: quietLog(),
			send: (m) => sendMailjet(m, { apiKey: 'k', secretKey: 's', fetch: down })
		});
		assert.match(r1.emailError, /ENOTFOUND/);
		const r2 = await handleConsult(consult, {
			id: 'b',
			emulator: false,
			log: quietLog(),
			send: (m) => sendMailjet(m, { apiKey: '', secretKey: '' })
		});
		assert.match(r2.emailError, /keys are not set/);
	});

	test('in the emulator: Mailjet is never called; the email is logged', async () => {
		let sent = 0;
		const log = quietLog();
		const result = await handleConsult(consult, {
			id: 'abc',
			emulator: true,
			log,
			send: async () => sent++
		});
		assert.deepEqual(result, { emailed: true });
		assert.equal(sent, 0);
		assert.equal(log.lines[0][2].email.To[0].Email, JCT_EMAIL);
	});
});
