// No old URL may ever 404 (docs/REDIRECT_MAP.md). Every old_url in docs/SEO_INVENTORY.csv,
// run through the build's Vercel routing (scripts/vercel-routing.js), returns 200, or exactly one
// 301/308 to a page that returns 200, and lands on the row's new_url. Any 404 or chain fails.
import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { loadRouter } from '../../scripts/vercel-routing.js';
import { redirects } from '../../src/lib/seo/redirects.js';
import { inventory } from './helpers.js';

// The one allowed exception, set by Vercel's platform, not this code: Vercel upgrades
// http → https on the same host before the apex → www domain redirect, so http://consultjct.com
// takes two hops (as it does today). Both are permanent and end on the canonical page.
const PLATFORM_TWO_HOPS = new Set(['http://consultjct.com/']);

const PERMANENT = [301, 308];
const router = loadRouter();

/** Tests one URL; returns the final URL. */
function oneHop(url) {
	const res = router.follow(url);
	assert.equal(res.status, 200, `${url} ends in ${res.status} (${res.hops.join(' → ')})`);
	const allowed = PLATFORM_TWO_HOPS.has(url) ? 2 : 1;
	assert.ok(res.hops.length <= allowed, `${url} is a chain: ${res.hops.join(' → ')}`);
	let current = url;
	for (let i = 0; i < res.hops.length; i++) {
		const r = router.request(current);
		assert.ok(PERMANENT.includes(r.status), `${current}: ${r.status} is not permanent`);
		current = r.location;
	}
	return res.final;
}

describe('old URLs', () => {
	const rows = inventory();
	let count = 0;

	test('the inventory has every row filled', () => {
		assert.ok(rows.length >= 38);
		for (const r of rows) {
			assert.ok(r.new_url && !/pending|decide/.test(r.new_url + r.action), `${r.old_url}`);
		}
	});

	for (const r of rows) {
		const url = r.old_url.replace('{slug}', 'any-company-slug');
		test(`${url} → ${r.new_url}`, () => {
			assert.equal(oneHop(url), r.new_url);
			count++;
		});
		// The same URL with a trailing slash goes straight there too.
		const u = new URL(url);
		if (u.pathname !== '/' && !u.pathname.endsWith('/') && !/\.\w+$/.test(u.pathname)) {
			test(`${url}/ → ${r.new_url}`, () => {
				assert.equal(oneHop(url + '/'), r.new_url);
				count++;
			});
		}
	}

	// Wildcards cover more than the sampled rows.
	for (const path of [
		'/charts',
		'/charts/anything-else',
		'/charts/a/b',
		'/company',
		'/company/x/y'
	]) {
		test(`${path} → /`, () => {
			assert.equal(oneHop(`https://www.consultjct.com${path}`), 'https://www.consultjct.com/');
			count++;
		});
	}

	test('every redirect target is a real page (no chains)', () => {
		for (const { from, to } of redirects) {
			assert.equal(router.routePath(to).status, 200, `${from} → ${to}`);
			count++;
		}
	});

	test('an unknown URL is a 404, not a redirect to home', () => {
		assert.equal(router.follow('https://www.consultjct.com/no-such-page').status, 404);
	});

	test('count', () => {
		console.log(`# redirect checks: ${count} URLs`);
		assert.ok(count > 60);
	});
});
