// The intake form's rules (src/lib/intake.js). `npm run test:unit`.
import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { labels } from '../../src/lib/config/labels.js';
import {
	LIMITS,
	MIN_MS,
	STAGES,
	isBot,
	normalizeLink,
	submitConsult,
	summary,
	toConsult,
	validate
} from '../../src/lib/intake.js';

const e = labels.form.errors;
const good = {
	name: 'Dana Reyes',
	email: 'dana@example.com',
	company: 'Example Co.',
	stage: 'Prototype',
	blocker: 'Our quotes from two factories are three times apart.',
	link: ''
};

describe('validate', () => {
	test('a complete form has no errors', () => assert.deepEqual(validate(good), {}));
	test('an empty form: every required field, in form order, with the copy-map messages', () => {
		const errors = validate({});
		assert.deepEqual(Object.keys(errors), ['name', 'email', 'company', 'stage', 'blocker']);
		assert.equal(errors.name, 'Enter your name.');
		assert.equal(errors.email, 'Enter an email like name@company.com.');
		assert.equal(errors.company, 'Enter your company.');
		assert.equal(errors.stage, 'Pick the one closest to where you are.');
		assert.equal(errors.blocker, "Tell me what's in the way.");
	});
	test('blank or too long', () => {
		assert.equal(validate({ ...good, name: '   ' }).name, e.name);
		assert.equal(validate({ ...good, blocker: 'x'.repeat(LIMITS.blocker + 1) }).blocker, e.blocker);
	});
	test('the screens\' "dana@" is an email error', () =>
		assert.deepEqual(Object.keys(validate({ ...good, email: 'dana@' })), ['email']));
	test('only the five stages', () => {
		assert.deepEqual(STAGES, ['Idea', 'Prototype', 'Sampling', 'In production', 'Launched']);
		assert.equal(validate({ ...good, stage: 'Scaling' }).stage, e.stage);
	});
	test('the summary counts the fields', () => {
		assert.equal(summary(2), 'Check the 2 fields marked below.');
		assert.equal(
			summary(Object.keys(validate({ ...good, email: 'x', stage: '' })).length),
			summary(2)
		);
	});
});

describe('the link', () => {
	test('optional', () => assert.equal(normalizeLink(''), ''));
	test('made https://', () => {
		assert.equal(normalizeLink('example.com/deck'), 'https://example.com/deck');
		assert.equal(normalizeLink('http://example.com'), 'https://example.com');
		assert.equal(normalizeLink('HTTPS://Example.com'), 'https://Example.com');
		assert.equal(normalizeLink(' https://example.com '), 'https://example.com');
	});
	test('refused when it cannot be a web address', () => {
		for (const bad of [
			'javascript:alert(1)',
			'mailto:a@b.co',
			'not a link',
			'localhost',
			'https://exa mple.com'
		])
			assert.equal(normalizeLink(bad), null, bad);
		assert.equal(normalizeLink('https://e.co/' + 'x'.repeat(LIMITS.link)), null);
		assert.ok(validate({ ...good, link: 'not a link' }).link);
	});
});

describe('the document', () => {
	test('only the allowed fields, trimmed; the link only when given', () => {
		assert.deepEqual(toConsult({ ...good, name: ' Dana Reyes ', extra: 'x' }), {
			name: 'Dana Reyes',
			email: 'dana@example.com',
			company: 'Example Co.',
			stage: 'Prototype',
			blocker: good.blocker
		});
		assert.equal(toConsult({ ...good, link: 'example.com' }).link, 'https://example.com');
	});
});

describe('bots', () => {
	const t0 = 1_000_000;
	test('honeypot filled', () =>
		assert.equal(isBot({ honeypot: 'x', startedAt: t0, now: t0 + 60000 }), true));
	test('too fast', () =>
		assert.equal(isBot({ honeypot: '', startedAt: t0, now: t0 + MIN_MS - 1 }), true));
	test('no start time', () =>
		assert.equal(isBot({ honeypot: '', startedAt: undefined, now: t0 }), true));
	test('a person', () =>
		assert.equal(isBot({ honeypot: '', startedAt: t0, now: t0 + MIN_MS }), false));
});

describe('submitConsult', () => {
	const t0 = 1_000_000;
	const person = { honeypot: '', startedAt: t0, now: t0 + 10000 };
	test('a person: saved once, "sent"', async () => {
		const saved = [];
		assert.equal(
			await submitConsult(good, { ...person, save: async (d) => saved.push(d) }),
			'sent'
		);
		assert.equal(saved.length, 1);
	});
	test('a bot: quiet "sent", nothing saved', async () => {
		let n = 0;
		const save = async () => n++;
		assert.equal(await submitConsult(good, { ...person, honeypot: 'x', save }), 'sent');
		assert.equal(await submitConsult(good, { ...person, now: t0 + 10, save }), 'sent');
		assert.equal(n, 0);
	});
	test('a failed save: "error"', async () => {
		const save = async () => {
			throw new Error('offline');
		};
		assert.equal(await submitConsult(good, { ...person, save }), 'error');
	});
	test('an invalid form never saves', async () => {
		let n = 0;
		assert.equal(
			await submitConsult({ ...good, email: '' }, { ...person, save: async () => n++ }),
			'invalid'
		);
		assert.equal(n, 0);
	});
});
