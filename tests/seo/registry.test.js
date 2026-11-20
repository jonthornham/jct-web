// The SEO registry (src/lib/seo/registry.js): every page has a unique title, description,
// canonical and OG image, and valid JSON-LD. Plus robots.txt and sitemap.xml.
import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { existsSync, readFileSync } from 'node:fs';
import {
	seoPages,
	headFor,
	jsonLd,
	ORIGIN,
	sitemapXml,
	robotsTxt
} from '../../src/lib/seo/registry.js';

const PAGES = [
	'/',
	'/how-i-work',
	'/services',
	'/work',
	'/about',
	'/free-consult',
	'/privacy',
	'/terms'
];

// The design bundle has OG images for the 6 main pages only. Privacy and Terms use Home's
// image until Jon decides otherwise (STATUS.md questions). Every other OG image is unique.
const SHARED_OG = { '/privacy': '/og/og-home.png', '/terms': '/og/og-home.png' };

const unique = (values) => values.filter((v, i) => values.indexOf(v) !== i);

describe('SEO registry', () => {
	const heads = seoPages.map(headFor);

	test('lists the 8 pages', () => {
		assert.deepEqual(seoPages.map((p) => p.path).sort(), [...PAGES].sort());
	});

	test('titles and descriptions are present, sensible lengths and unique', () => {
		for (const h of heads) {
			assert.ok(h.title.length >= 10 && h.title.length <= 70, `title length: ${h.title}`);
			assert.ok(h.title.endsWith(' · JCT'), `title ends with " · JCT": ${h.title}`);
			assert.ok(
				h.description.length >= 50 && h.description.length <= 160,
				`description length ${h.description.length}: ${h.description}`
			);
		}
		assert.deepEqual(unique(heads.map((h) => h.title)), [], 'duplicate titles');
		assert.deepEqual(unique(heads.map((h) => h.description)), [], 'duplicate descriptions');
	});

	test('canonicals are absolute on https://www.consultjct.com, no trailing slash, unique', () => {
		for (const [i, h] of heads.entries()) {
			const p = seoPages[i].path;
			assert.equal(h.canonical, p === '/' ? `${ORIGIN}/` : ORIGIN + p);
			assert.equal(h.og.url, h.canonical);
		}
		assert.deepEqual(unique(heads.map((h) => h.canonical)), []);
	});

	test('OG images exist in static/og, are absolute, and are unique except Privacy/Terms', () => {
		for (const p of seoPages) {
			assert.match(p.og, /^\/og\/og-[a-z-]+\.png$/);
			assert.ok(existsSync('static' + p.og), `missing static${p.og}`);
			assert.equal(headFor(p).og.image, ORIGIN + p.og);
			if (SHARED_OG[p.path]) assert.equal(p.og, SHARED_OG[p.path]);
		}
		const own = seoPages.filter((p) => !SHARED_OG[p.path]).map((p) => p.og);
		assert.deepEqual(unique(own), [], 'duplicate OG images');
		const expected = { '/': 'home', '/free-consult': 'free-consult', '/how-i-work': 'how-i-work' };
		for (const p of seoPages.filter((p) => !SHARED_OG[p.path]))
			assert.equal(p.og, `/og/og-${expected[p.path] ?? p.path.slice(1)}.png`);
	});

	test('JSON-LD is valid on every page', () => {
		const ids = new Set();
		for (const p of seoPages) {
			const doc = JSON.parse(jsonLd(p));
			assert.equal(doc['@context'], 'https://schema.org');
			assert.ok(Array.isArray(doc['@graph']) && doc['@graph'].length > 0);
			for (const node of doc['@graph']) {
				assert.ok(typeof node['@type'] === 'string', `${p.path}: node without @type`);
				assert.ok(node['@id']?.startsWith(ORIGIN + '/'), `${p.path}: @id on the origin`);
				assert.ok(node.name, `${p.path}: ${node['@type']} without a name`);
				for (const k of ['url', 'image', 'logo'])
					if (node[k]) assert.ok(node[k].startsWith(ORIGIN + '/'), `${p.path}: ${k}`);
				assert.ok(!JSON.stringify(node).includes('null'), `${p.path}: null value`);
				if (node['@type'].endsWith('Page')) {
					assert.ok(!ids.has(node['@id']), `duplicate @id ${node['@id']}`);
					ids.add(node['@id']);
				}
			}
			assert.ok(!jsonLd(p).includes('<'), 'JSON-LD has an unescaped <');
		}
	});

	test('ProfessionalService on /; Organization and Person on /about', () => {
		const types = (path) =>
			JSON.parse(jsonLd(seoPages.find((p) => p.path === path)))['@graph'].map((n) => n['@type']);
		assert.ok(types('/').includes('ProfessionalService'));
		assert.ok(types('/about').includes('Organization'));
		assert.ok(types('/about').includes('Person'));
	});

	test('sitemap.xml lists the 8 pages on www', () => {
		const xml = sitemapXml();
		const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
		assert.deepEqual(locs.sort(), PAGES.map((p) => (p === '/' ? `${ORIGIN}/` : ORIGIN + p)).sort());
		assert.ok(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>'));
	});

	test('robots.txt allows crawling and names the sitemap', () => {
		assert.match(robotsTxt(), /^User-agent: \*$/m);
		assert.doesNotMatch(robotsTxt(), /Disallow: \//);
		assert.match(robotsTxt(), /^Sitemap: https:\/\/www\.consultjct\.com\/sitemap\.xml$/m);
	});

	test('no page sets its own <title> outside the registry (404 excepted)', () => {
		const files = [
			'src/routes/+page.svelte',
			'src/components/layout/PageStub.svelte',
			'src/components/layout/LegalPage.svelte'
		];
		for (const f of files) assert.doesNotMatch(readFileSync(f, 'utf8'), /<title>/, f);
	});
});
