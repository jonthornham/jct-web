// npm run check:placeholders (also the last step of npm run check)
//
// Lists every placeholder left in src/ (see scripts/placeholders.js). Exits 1 when this would be
// a production build (PUBLIC_SHOW_PLACEHOLDERS isn't "true", or VERCEL_ENV=production) and any
// placeholder is left, so the same rule as `npm run build` fails here first.
//
//   --warn   report only, never fail: CI on pull requests (Session 3a, item 2). Each placeholder
//            becomes a GitHub warning annotation. On main, CI runs it without --warn, and any
//            production build (vite build) still fails on its own.
import { findPlaceholders, isProductionBuild } from './placeholders.js';

const warnOnly = process.argv.includes('--warn');
const show = process.env.PUBLIC_SHOW_PLACEHOLDERS === 'true';
const production = isProductionBuild({ show, vercelEnv: process.env.VERCEL_ENV });
const hits = findPlaceholders();
const github = process.env.GITHUB_ACTIONS === 'true';

for (const h of hits) {
	console.log(`${h.file}:${h.line}  ${h.text}`);
	if (warnOnly && github)
		console.log(
			`::warning file=${h.file},line=${h.line}::Placeholder left: ${h.text.replace(/[\r\n]/g, ' ')}`
		);
}
console.log(`${hits.length} placeholder(s) left in src/.`);
if (production && hits.length) {
	if (warnOnly) {
		console.log('Warning only (pull request): a production build fails until these are replaced.');
	} else {
		console.error(
			'Production check: placeholders must all be gone. (Preview: PUBLIC_SHOW_PLACEHOLDERS=true.)'
		);
		process.exit(1);
	}
}
