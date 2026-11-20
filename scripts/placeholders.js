// The placeholder rule (design bundle, components/placeholders.md):
//   - [PLACEHOLDER] chips and striped image slots render only when PUBLIC_SHOW_PLACEHOLDERS=true.
//   - A production build with any placeholder left in src/ fails.
//
// A placeholder in src/ is any of:
//   - the text "[PLACEHOLDER" (copy, config, the legal markdown),
//   - a <Placeholder> chip or an <ImageSlot> (src/components/placeholder/).
// The placeholder component files themselves (SELF below) are not counted.
//
// "Production build" means `vite build` without PUBLIC_SHOW_PLACEHOLDERS=true, or any build on
// Vercel's production environment (VERCEL_ENV=production), even with the flag set.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const PATTERNS = [/\[PLACEHOLDER/g, /<Placeholder[\s>/]/g, /<ImageSlot[\s>/]/g];
const EXTENSIONS = /\.(svelte|js|md|svx|html|json)$/;
const SELF = [
	'src/components/placeholder/Placeholder.svelte',
	'src/components/placeholder/ImageSlot.svelte',
	// Render placeholders only when given one; the placeholder itself lives in config or content.
	'src/components/placeholder/MissingLink.svelte',
	'src/components/placeholder/MissingText.svelte'
];

/** Every placeholder in the files under `dir`: [{ file, line, text }]. */
export function findPlaceholders(dir = 'src', root = process.cwd()) {
	const hits = [];
	const walk = (d) => {
		for (const name of readdirSync(d)) {
			const p = join(d, name);
			if (statSync(p).isDirectory()) walk(p);
			else if (EXTENSIONS.test(name)) {
				const rel = relative(root, p).split(sep).join('/');
				if (SELF.includes(rel)) continue;
				readFileSync(p, 'utf8')
					.split('\n')
					.forEach((text, i) => {
						if (PATTERNS.some((re) => text.match(re)))
							hits.push({ file: rel, line: i + 1, text: text.trim().slice(0, 120) });
					});
			}
		}
	};
	walk(join(root, dir));
	return hits;
}

/** True when this build must ship with no placeholders. */
export const isProductionBuild = ({ show, vercelEnv }) => !show || vercelEnv === 'production';

/** Vite plugin: fails `vite build` when it is a production build and a placeholder is left. */
export function placeholderGuard({ show, vercelEnv }) {
	return {
		name: 'jct-placeholder-guard',
		apply: 'build',
		buildStart() {
			if (!isProductionBuild({ show, vercelEnv })) return;
			const hits = findPlaceholders();
			if (!hits.length) return;
			const list = hits.map((h) => `  ${h.file}:${h.line}  ${h.text}`).join('\n');
			this.error(
				`Production build with ${hits.length} placeholder(s) left. Replace them, or build a ` +
					`preview with PUBLIC_SHOW_PLACEHOLDERS=true (npm run build:preview).\n${list}`
			);
		}
	};
}
