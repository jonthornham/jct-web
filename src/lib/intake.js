// The Free Consult intake form's rules (components/intake-form.md), kept apart from the page so
// they can be tested without a browser. firestore.rules repeats the same limits for `consults`:
// change both together (tests/rules/consults.test.js checks the rules against these numbers).
import { labels } from './config/labels.js';

/** The five stage choices, in the order the form shows them. */
export const STAGES = labels.form.stageOptions;

/** Longest accepted value per field (characters). */
export const LIMITS = { name: 100, email: 254, company: 120, blocker: 2000, link: 500 };

/** A submission sooner than this after the form appeared is treated as a bot. */
export const MIN_MS = 3000;

/** The honeypot field's name. People never see it; bots that fill every input do. */
export const HONEYPOT = 'website';

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const trim = (v) => (typeof v === 'string' ? v.trim() : '');

/**
 * The link as it will be saved: empty, or an https:// address. "example.com" gets "https://"
 * and "http://" becomes "https://". Returns null when it can't be made into one.
 */
export function normalizeLink(value) {
	let v = trim(value);
	if (!v) return '';
	if (/^http:\/\//i.test(v)) v = 'https://' + v.slice(7);
	else if (!/^https:\/\//i.test(v)) {
		if (/^[a-z][a-z0-9+.-]*:/i.test(v)) return null; // another scheme (mailto:, ftp:, …)
		v = 'https://' + v;
	}
	v = 'https://' + v.slice(8);
	try {
		const u = new URL(v);
		if (u.protocol !== 'https:' || !u.hostname.includes('.') || /\s/.test(v)) return null;
	} catch {
		return null;
	}
	return v.length <= LIMITS.link ? v : null;
}

/** The error message for one field, or '' when it's fine. */
export function fieldError(field, values) {
	const v = trim(values[field]);
	const e = labels.form.errors;
	switch (field) {
		case 'name':
			return v && v.length <= LIMITS.name ? '' : e.name;
		case 'email':
			return EMAIL_RE.test(v) && v.length <= LIMITS.email ? '' : e.email;
		case 'company':
			return v && v.length <= LIMITS.company ? '' : e.company;
		case 'stage':
			return STAGES.includes(values.stage) ? '' : e.stage;
		case 'blocker':
			return v && v.length <= LIMITS.blocker ? '' : e.blocker;
		case 'link':
			return normalizeLink(values.link) === null ? e.link : '';
		default:
			return '';
	}
}

/** Fields in the order the form shows them. */
export const FIELDS = ['name', 'email', 'company', 'stage', 'blocker', 'link'];

/** Every invalid field and its message, in form order. */
export function validate(values) {
	const errors = {};
	for (const f of FIELDS) {
		const msg = fieldError(f, values);
		if (msg) errors[f] = msg;
	}
	return errors;
}

/** "Check the {n} fields marked below." with the count filled in. */
export const summary = (n) => {
	const e = labels.form.errors;
	return e.summary.replace('{n}', String(n));
};

/** True for a bot: the honeypot has a value, or the form was sent too fast. */
export function isBot({ honeypot, startedAt, now = Date.now() }) {
	return trim(honeypot) !== '' || !(now - startedAt >= MIN_MS);
}

/**
 * The `consults` document (without createdAt, which the server sets). Only the allowed fields;
 * the link only when there is one.
 */
export function toConsult(values) {
	const doc = {
		name: trim(values.name),
		email: trim(values.email),
		company: trim(values.company),
		stage: values.stage,
		blocker: trim(values.blocker)
	};
	const link = normalizeLink(values.link);
	if (link) doc.link = link;
	return doc;
}

/**
 * Submit flow, minus the browser: a bot gets a quiet success and nothing is written; otherwise
 * the document is saved with `save`. Returns 'sent' or 'error' (or 'invalid' if the form isn't
 * valid, which the form prevents).
 */
export async function submitConsult(values, { honeypot, startedAt, now, save }) {
	if (isBot({ honeypot, startedAt, now })) return 'sent';
	if (Object.keys(validate(values)).length) return 'invalid';
	try {
		await save(toConsult(values));
		return 'sent';
	} catch {
		return 'error';
	}
}
