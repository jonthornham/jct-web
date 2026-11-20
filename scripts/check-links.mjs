// Internal link check on the build (.vercel/output). Every internal href and src in every built
// page must return 200 directly through the site's Vercel routing (scripts/vercel-routing.js):
// no 404 and no redirect. External links are listed, not fetched.
//
//   npm run check:links   (after a build; `npm run test:seo` builds and runs it)
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { loadRouter, WWW } from './vercel-routing.js';

const STATIC = '.vercel/output/static';
const router = loadRouter();

const pages = [];
const walk = (d) => {
	for (const n of readdirSync(d)) {
		const p = join(d, n);
		if (statSync(p).isDirectory()) walk(p);
		else if (n.endsWith('.html')) pages.push(p);
	}
};
walk(STATIC);

const failures = [];
const external = new Set();
let checked = 0;
for (const file of pages) {
	const page = '/' + relative(STATIC, file).replace(/(index)?\.html$/, '');
	const html = readFileSync(file, 'utf8');
	const urls = [
		...[...html.matchAll(/\s(?:href|src)="([^"]+)"/g)].map((m) => m[1]),
		...[...html.matchAll(/\ssrcset="([^"]+)"/g)].flatMap((m) =>
			m[1].split(',').map((s) => s.trim().split(/\s+/)[0])
		)
	];
	for (const raw of urls) {
		const url = raw.replace(/&amp;/g, '&');
		if (/^(mailto|tel|data|javascript):/.test(url) || url.startsWith('#')) continue;
		const u = new URL(url, `https://${WWW}${page}`);
		if (u.host !== WWW && !(u.host === 'fonts.googleapis.com' || u.host === 'fonts.gstatic.com')) {
			external.add(u.href);
			continue;
		}
		if (u.host !== WWW) continue;
		checked++;
		const res = router.request(u.href);
		if (res.status !== 200)
			failures.push(`${page}: ${url} → ${res.status}${res.location ? ' ' + res.location : ''}`);
	}
}

console.log(`Link check: ${pages.length} pages, ${checked} internal links checked.`);
if (external.size) console.log(`External (not fetched): ${[...external].join(', ')}`);
if (failures.length) {
	console.error(
		`${failures.length} broken or redirecting internal link(s):\n  ${failures.join('\n  ')}`
	);
	process.exit(1);
}
