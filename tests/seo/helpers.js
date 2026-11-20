// Shared by the SEO tests: the inventory CSV, the built pages, and their head tags.
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

export const OUTPUT = '.vercel/output';

/** RFC 4180 CSV → array of objects (quoted fields may hold commas and doubled quotes). */
export function parseCsv(text) {
	const rows = [];
	let row = [];
	let field = '';
	let quoted = false;
	for (let i = 0; i < text.length; i++) {
		const c = text[i];
		if (quoted) {
			if (c === '"' && text[i + 1] === '"') ((field += '"'), i++);
			else if (c === '"') quoted = false;
			else field += c;
		} else if (c === '"') quoted = true;
		else if (c === ',') (row.push(field), (field = ''));
		else if (c === '\n') (row.push(field), rows.push(row), (row = []), (field = ''));
		else if (c !== '\r') field += c;
	}
	if (field || row.length) (row.push(field), rows.push(row));
	const [header, ...body] = rows;
	return body.map((r) => Object.fromEntries(header.map((h, i) => [h, r[i] ?? ''])));
}

export const inventory = () => parseCsv(readFileSync('docs/SEO_INVENTORY.csv', 'utf8'));

/** The built HTML for a page path, from the Vercel output. */
export function builtHtml(path) {
	const file = join(OUTPUT, 'static', path === '/' ? 'index.html' : `${path}.html`);
	if (!existsSync(file)) throw new Error(`No build output for ${path}. Run the build first.`);
	return readFileSync(file, 'utf8');
}

/** The <head> of an HTML document. */
export const headOf = (html) => html.slice(0, html.indexOf('</head>'));

const attr = (tag, name) => tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];

/** Every tag matching a regexp in the head, as { attr(name) }. */
export const tags = (head, re) =>
	[...head.matchAll(re)].map((m) => ({ raw: m[0], attr: (n) => decode(attr(m[0], n)) }));

export const decode = (s) =>
	s
		?.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&amp;/g, '&');
