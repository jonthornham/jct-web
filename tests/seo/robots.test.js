// X-Robots-Tag by host, through the build's Vercel routing (scripts/vercel-routing.js).
// Only www.consultjct.com is indexable; every other host gets noindex on every path.
import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { loadRouter } from '../../scripts/vercel-routing.js';
import { seoPages } from '../../src/lib/seo/registry.js';

const router = loadRouter();
const PATHS = [...seoPages.map((p) => p.path), '/robots.txt', '/sitemap.xml', '/og/og-home.png'];

const HOSTS = {
	www: { host: 'www.consultjct.com', noindex: false },
	// Normally the apex redirects at the domain level; if it ever served pages, they'd be noindex.
	apex: { host: 'consultjct.com', noindex: true },
	// Production's own *.vercel.app address (production deploys there before launch).
	'production on vercel.app': { host: 'jct-web.vercel.app', noindex: true },
	// A preview deploy's address.
	preview: { host: 'jct-web-git-feat-pages-jonthornham.vercel.app', noindex: true }
};

describe('X-Robots-Tag by host', () => {
	for (const [name, { host, noindex }] of Object.entries(HOSTS)) {
		test(`${name} (${host}): ${noindex ? 'noindex on every path' : 'indexable'}`, () => {
			for (const path of PATHS) {
				const tag = router.headersFor(`https://${host}${path}`)['X-Robots-Tag'];
				if (noindex) assert.equal(tag, 'noindex', `${host}${path}`);
				else assert.equal(tag, undefined, `${host}${path}`);
			}
		});
	}

	test('pages on www return 200 with no noindex header', () => {
		for (const p of seoPages) {
			const res = router.request(`https://www.consultjct.com${p.path}`);
			assert.equal(res.status, 200, p.path);
			assert.equal(res.headers['X-Robots-Tag'], undefined, p.path);
		}
	});

	test('the same pages on a preview host return 200 with noindex', () => {
		for (const p of seoPages) {
			const res = router.request(`https://${HOSTS.preview.host}${p.path}`);
			assert.equal(res.status, 200, p.path);
			assert.equal(res.headers['X-Robots-Tag'], 'noindex', p.path);
		}
	});
});
