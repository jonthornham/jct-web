// The built site (.vercel/output, from `npm run test:seo`'s build): each page's head carries
// exactly the registry's tags, robots.txt and sitemap.xml are built, no page says noindex.
import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { readFileSync } from 'node:fs';
import { seoPages, headFor, robotsTxt, sitemapXml } from '../../src/lib/seo/registry.js';
import { builtHtml, headOf, tags, decode, OUTPUT } from './helpers.js';

describe('built head tags', () => {
	for (const p of seoPages) {
		test(p.path, () => {
			const head = headOf(builtHtml(p.path));
			const want = headFor(p);
			const titles = [...head.matchAll(/<title>([^<]*)<\/title>/g)].map((m) => decode(m[1]));
			assert.deepEqual(titles, [want.title]);
			const one = (re, name) => {
				const found = tags(head, re);
				assert.equal(found.length, 1, `${p.path}: ${found.length} × ${re}`);
				return found[0].attr(name);
			};
			assert.equal(one(/<meta name="description"[^>]*>/g, 'content'), want.description);
			assert.equal(one(/<link rel="canonical"[^>]*>/g, 'href'), want.canonical);
			assert.equal(one(/<meta property="og:image"[^>]*>/g, 'content'), want.og.image);
			assert.equal(one(/<meta property="og:url"[^>]*>/g, 'content'), want.canonical);
			const ld = [...head.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
			assert.equal(ld.length, 1, `${p.path}: JSON-LD blocks`);
			assert.deepEqual(JSON.parse(ld[0][1]), JSON.parse(want.jsonLd));
			assert.doesNotMatch(head, /noindex/i, `${p.path}: noindex in the page`);
		});
	}

	test('robots.txt and sitemap.xml are in the build', () => {
		assert.equal(readFileSync(`${OUTPUT}/static/robots.txt`, 'utf8'), robotsTxt());
		assert.equal(readFileSync(`${OUTPUT}/static/sitemap.xml`, 'utf8'), sitemapXml());
	});
});
