// The placeholder rule (components/placeholders.md): scripts/placeholders.js. `npm run test:unit`.
import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join, resolve } from 'node:path';
import { after } from 'node:test';
import {
	findPlaceholders,
	isProductionBuild,
	placeholderGuard
} from '../../scripts/placeholders.js';

// Fixtures live in the repo's gitignored build folder and are removed after the tests.
const made = [];
after(() => made.forEach((d) => rmSync(d, { recursive: true, force: true })));

const fixture = (files) => {
	mkdirSync('.svelte-kit', { recursive: true });
	const root = resolve(mkdtempSync(join('.svelte-kit', 'test-ph-')));
	made.push(root);
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

	test('check:placeholders fails a production check, but only warns with --warn (PRs)', () => {
		const root = fixture({ 'src/x.svelte': '<Placeholder>Needs photo</Placeholder>' });
		const script = resolve('scripts/check-placeholders.mjs');
		const env = {
			...process.env,
			PUBLIC_SHOW_PLACEHOLDERS: '',
			VERCEL_ENV: '',
			GITHUB_ACTIONS: 'true'
		};
		const hard = spawnSync(process.execPath, [script], { cwd: root, env, encoding: 'utf8' });
		assert.equal(hard.status, 1, 'production check fails');
		const warn = spawnSync(process.execPath, [script, '--warn'], {
			cwd: root,
			env,
			encoding: 'utf8'
		});
		assert.equal(warn.status, 0, '--warn passes');
		assert.match(warn.stdout, /::warning file=src\/x\.svelte,line=1::/);
		const clean = fixture({ 'src/y.svelte': '<p>done</p>' });
		assert.equal(spawnSync(process.execPath, [script], { cwd: clean, env }).status, 0);
	});
});
