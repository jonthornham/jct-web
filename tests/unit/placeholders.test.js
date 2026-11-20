// The placeholder rule (components/placeholders.md): scripts/placeholders.js. `npm run test:unit`.
import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
	findPlaceholders,
	isProductionBuild,
	placeholderGuard
} from '../../scripts/placeholders.js';

const fixture = (files) => {
	const root = mkdtempSync(join(tmpdir(), 'jct-ph-'));
	for (const [path, text] of Object.entries(files)) {
		mkdirSync(join(root, path, '..'), { recursive: true });
		writeFileSync(join(root, path), text);
	}
	return root;
};

describe('placeholders', () => {
	test('finds the chip text, <Placeholder> and <ImageSlot>', () => {
		const root = fixture({
			'src/a.md': 'Email [PLACEHOLDER: Needs contact email].',
			'src/b.svelte': '<Placeholder>Needs logo</Placeholder>\n<p>fine</p>\n<ImageSlot label="x" />',
			'src/c.js': "export const ok = 'nothing here';",
			'src/components/placeholder/Placeholder.svelte': '[PLACEHOLDER: {children}]'
		});
		const hits = findPlaceholders('src', root);
		assert.deepEqual(
			hits.map((h) => `${h.file}:${h.line}`),
			['src/a.md:1', 'src/b.svelte:1', 'src/b.svelte:3']
		);
	});

	test('production = no flag, or Vercel production even with the flag', () => {
		assert.equal(isProductionBuild({ show: false }), true);
		assert.equal(isProductionBuild({ show: true }), false);
		assert.equal(isProductionBuild({ show: true, vercelEnv: 'preview' }), false);
		assert.equal(isProductionBuild({ show: true, vercelEnv: 'production' }), true);
	});

	test('the build guard fails a production build while placeholders are left', () => {
		const errors = [];
		const ctx = { error: (m) => errors.push(m) };
		const cwd = process.cwd();
		const root = fixture({ 'src/x.svelte': '<Placeholder>Needs photo</Placeholder>' });
		process.chdir(root);
		try {
			placeholderGuard({ show: true }).buildStart.call(ctx);
			assert.equal(errors.length, 0, 'a preview build passes');
			placeholderGuard({ show: false }).buildStart.call(ctx);
			assert.equal(errors.length, 1, 'a production build fails');
			assert.match(errors[0], /src\/x\.svelte:1/);
		} finally {
			process.chdir(cwd);
		}
	});
});
