// npm run check:placeholders (also the last step of npm run check)
//
// Lists every placeholder left in src/ (see scripts/placeholders.js). Exits 1 when this would be
// a production build (PUBLIC_SHOW_PLACEHOLDERS isn't "true", or VERCEL_ENV=production) and any
// placeholder is left, so the same rule as `npm run build` fails here first.
import { findPlaceholders, isProductionBuild } from './placeholders.js';

const show = process.env.PUBLIC_SHOW_PLACEHOLDERS === 'true';
const production = isProductionBuild({ show, vercelEnv: process.env.VERCEL_ENV });
const hits = findPlaceholders();

for (const h of hits) console.log(`${h.file}:${h.line}  ${h.text}`);
console.log(`${hits.length} placeholder(s) left in src/.`);
if (production && hits.length) {
	console.error(
		'Production check: placeholders must all be gone. (Preview: PUBLIC_SHOW_PLACEHOLDERS=true.)'
	);
	process.exit(1);
}
