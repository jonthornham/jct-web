// Every UI label lives in src/lib/config/labels.js. `npm run test:unit`.
// Fails when:
//   - a key listed in design/jct-download-01/copy-map.md › "UI labels (for config)" is missing,
//     empty, or null (null is allowed only for NOT_SUPPLIED keys);
//   - a component or module uses labels.<key> for a key that doesn't exist.
import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { labels, label, NOT_SUPPLIED } from '../../src/lib/config/labels.js';

const ok = (v) =>
	(typeof v === 'string' && v.trim() !== '') ||
	(Array.isArray(v) && v.length > 0 && v.every((x) => typeof x === 'string' && x.trim()));

/** The keys in copy-map's UI labels table. "`a.b.c` / `.d`" is a.b.c and a.b.d. */
export function copyMapKeys(markdown) {
	const section = markdown.split(/^## UI labels.*$/m)[1];
	assert.ok(section, 'copy-map.md has no "UI labels" section');
	const keys = [];
	for (const row of section.split('\n').filter((l) => l.startsWith('| `'))) {
		const cell = row.split('|')[1];
		const tokens = [...cell.matchAll(/`([^`]+)`/g)].map((m) => m[1]);
		const first = tokens[0];
		for (const t of tokens) {
			if (t.startsWith('.')) keys.push(first.split('.').slice(0, -1).join('.') + t);
			else keys.push(t);
		}
	}
	return keys;
}

/** labels.x.y paths used in src/ (.svelte, .js, .md), ignoring labels.js itself. */
function usedKeys(dir = 'src') {
	const found = new Map();
	const walk = (d) => {
		for (const name of readdirSync(d)) {
			const p = join(d, name);
			if (statSync(p).isDirectory()) walk(p);
			else if (/\.(svelte|js|md)$/.test(name) && !p.endsWith('config/labels.js')) {
				for (const m of readFileSync(p, 'utf8').matchAll(
					/(?<![\w/.$])labels((?:\.[A-Za-z_]\w*)+)/g
				))
					found.set(m[1].slice(1), p);
			}
		}
	};
	walk(dir);
	return found;
}

describe('UI labels', () => {
	const copyMap = readFileSync('design/jct-download-01/copy-map.md', 'utf8');
	const keys = copyMapKeys(copyMap);

	test('the copy map lists the labels (sanity)', () => {
		assert.ok(keys.length >= 40, `only ${keys.length} keys read from copy-map.md`);
		assert.ok(keys.includes('form.errors.blocker'));
		assert.ok(keys.includes('form.success.line'));
	});

	test('every copy-map label is in config', () => {
		const missing = keys.filter((k) => {
			const v = label(k);
			return NOT_SUPPLIED.includes(k) ? !(v === null || ok(v)) : !ok(v);
		});
		assert.deepEqual(missing, [], `missing or empty in labels.js: ${missing.join(', ')}`);
	});

	test('every label the code uses exists', () => {
		const used = usedKeys();
		assert.ok(used.size > 10, 'no labels.* uses found in src/ (sanity)');
		const missing = [...used].filter(([k]) => {
			const v = label(k);
			// A use of a group (labels.nav) is fine; a leaf must be a real label.
			return v === undefined || (typeof v !== 'object' && !ok(v)) || v === null;
		});
		assert.deepEqual(
			missing.map(([k, f]) => `${k} (${f})`),
			[],
			'used in src/ but not in labels.js'
		);
	});

	test('a missing label is caught (the check works)', () => {
		assert.equal(label('nav.noSuchLabel'), undefined);
		assert.ok(!ok(label('nav.noSuchLabel')));
		assert.deepEqual(copyMapKeys('## UI labels\n| `a.b` / `.c` | x |'), ['a.b', 'a.c']);
	});

	test('only NOT_SUPPLIED keys are null', () => {
		const nulls = [];
		const walk = (o, path) => {
			for (const [k, v] of Object.entries(o)) {
				const p = path ? `${path}.${k}` : k;
				if (v === null) nulls.push(p);
				else if (v && typeof v === 'object' && !Array.isArray(v)) walk(v, p);
			}
		};
		walk(labels, '');
		assert.deepEqual(nulls.sort(), [...NOT_SUPPLIED].sort());
	});
});
