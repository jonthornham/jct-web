// Google Analytics (src/lib/analytics.js): only on www.consultjct.com, consent defaults first,
// gtag.js added when idle, events counted. `npm run test:unit`.
import assert from 'node:assert/strict';
import { beforeEach, describe, test } from 'node:test';
import {
	CONSENT_REGIONS,
	GA_HOST,
	_reset,
	initAnalytics,
	scriptSrc,
	setupCalls,
	shouldLoad,
	track
} from '../../src/lib/analytics.js';

const ID = 'G-TEST1234';

/** A pretend browser: records added scripts and runs idle callbacks on demand. */
function fakeBrowser(hostname, readyState = 'complete') {
	const scripts = [];
	const idle = [];
	const onLoad = [];
	const win = {
		location: { hostname },
		requestIdleCallback: (fn) => idle.push(fn),
		addEventListener: (type, fn) => type === 'load' && onLoad.push(fn)
	};
	const doc = {
		readyState,
		createElement: () => ({}),
		head: { appendChild: (s) => scripts.push(s) }
	};
	return { win, doc, scripts, idle, onLoad };
}
const calls = (win) => win.dataLayer.map((a) => Array.from(a));

beforeEach(_reset);

describe('where it loads', () => {
	test('only www.consultjct.com, only with a G- ID', () => {
		assert.equal(GA_HOST, 'www.consultjct.com');
		assert.equal(shouldLoad({ host: GA_HOST, id: ID }), true);
		for (const host of [
			'localhost',
			'127.0.0.1',
			'consultjct.com',
			'jct-web.vercel.app',
			'jct-web-git-feat-intake-jonthornham.vercel.app',
			'www.consultjct.com.evil.example',
			'staging.consultjct.com'
		])
			assert.equal(shouldLoad({ host, id: ID }), false, host);
		for (const id of [undefined, '', 'UA-123-1', 'GTM-ABCD', 'G-'])
			assert.equal(shouldLoad({ host: GA_HOST, id }), false, String(id));
	});

	test('a preview or vercel.app host: no dataLayer, no gtag, no script', () => {
		for (const host of ['jct-web-abc123.vercel.app', 'localhost']) {
			const b = fakeBrowser(host);
			assert.equal(initAnalytics({ id: ID, win: b.win, doc: b.doc }), false);
			assert.equal(b.win.dataLayer, undefined);
			assert.equal(b.win.gtag, undefined);
			b.idle.forEach((f) => f());
			assert.equal(b.scripts.length, 0);
		}
	});

	test('www without an ID (not set on Vercel yet): nothing', () => {
		const b = fakeBrowser(GA_HOST);
		assert.equal(initAnalytics({ id: '', win: b.win, doc: b.doc }), false);
		assert.equal(b.scripts.length + b.idle.length, 0);
	});
});

describe('on www.consultjct.com', () => {
	test('consent defaults come first, then config with signals off', () => {
		const b = fakeBrowser(GA_HOST);
		assert.equal(initAnalytics({ id: ID, win: b.win, doc: b.doc }), true);
		const [regional, general, js, config] = calls(b.win);
		assert.deepEqual(regional.slice(0, 2), ['consent', 'default']);
		assert.equal(regional[2].analytics_storage, 'denied');
		assert.equal(regional[2].ad_storage, 'denied');
		assert.deepEqual(regional[2].region, CONSENT_REGIONS);
		assert.deepEqual(general.slice(0, 2), ['consent', 'default']);
		assert.equal(general[2].analytics_storage, 'granted');
		assert.equal(general[2].region, undefined);
		assert.equal(general[2].ad_personalization, 'denied');
		assert.equal(js[0], 'js');
		assert.deepEqual(config, [
			'config',
			ID,
			{ allow_google_signals: false, allow_ad_personalization_signals: false }
		]);
	});

	test('the region list: EEA (30), UK and Switzerland', () => {
		assert.equal(CONSENT_REGIONS.length, 32);
		assert.equal(new Set(CONSENT_REGIONS).size, 32);
		for (const c of ['DE', 'FR', 'IE', 'NO', 'IS', 'LI', 'GB', 'CH'])
			assert.ok(CONSENT_REGIONS.includes(c), c);
		for (const c of ['US', 'CA', 'UK']) assert.ok(!CONSENT_REGIONS.includes(c), c);
	});

	test('gtag.js is added only once the browser is idle, after load', () => {
		const b = fakeBrowser(GA_HOST, 'loading');
		initAnalytics({ id: ID, win: b.win, doc: b.doc });
		assert.equal(b.scripts.length, 0, 'not before load');
		assert.equal(b.idle.length, 0);
		b.onLoad.forEach((f) => f());
		assert.equal(b.scripts.length, 0, 'not before idle');
		b.idle.forEach((f) => f());
		assert.equal(b.scripts.length, 1);
		assert.equal(b.scripts[0].src, scriptSrc(ID));
		assert.equal(b.scripts[0].async, true);
		assert.match(
			b.scripts[0].src,
			/^https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=G-TEST1234$/
		);
	});

	test('started once only', () => {
		const b = fakeBrowser(GA_HOST);
		initAnalytics({ id: ID, win: b.win, doc: b.doc });
		assert.equal(initAnalytics({ id: ID, win: b.win, doc: b.doc }), false);
		assert.equal(b.idle.length, 1);
	});

	test('consult_submitted is counted', () => {
		const b = fakeBrowser(GA_HOST);
		initAnalytics({ id: ID, win: b.win, doc: b.doc });
		track('consult_submitted', {}, b.win);
		assert.deepEqual(calls(b.win).at(-1), ['event', 'consult_submitted', {}]);
	});
});

test('track does nothing where analytics never started', () => {
	assert.doesNotThrow(() => track('consult_submitted', {}, {}));
	assert.doesNotThrow(() => track('consult_submitted', {}, undefined));
});

test('setupCalls never grants ad personalisation', () => {
	for (const [kind, , v] of setupCalls(ID))
		if (kind === 'consent') assert.equal(v.ad_personalization, 'denied');
});
