// Search-engine rule (Session 3a, item 1): only https://www.consultjct.com is indexable. Every
// other host (previews, *.vercel.app including production, the apex) gets X-Robots-Tag: noindex
// from Vercel's routing, by host, in every build. No page carries a noindex tag.
// The per-host behaviour on the real build is tested in tests/seo/robots.test.js.
import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import {
	mkdtempSync,
	mkdirSync,
	readFileSync,
	readdirSync,
	rmSync,
	statSync,
	writeFileSync
} from 'node:fs';
import { join } from 'node:path';
import { INDEXABLE_HOST, NOINDEX_ROUTE, vercelOutput } from '../../scripts/vercel-output.js';

const sample = {
	version: 3,
	routes: [{ src: '/about', dest: '/about/' }, { handle: 'filesystem' }]
};

/** Runs the wrapped adapter against a fake Vercel adapter; returns the config it leaves behind. */
async function adapt(env) {
	// Inside the repo's gitignored build folder, removed afterwards.
	mkdirSync('.svelte-kit', { recursive: true });
	const dir = mkdtempSync(join('.svelte-kit', 'test-robots-'));
	const fake = {
		name: 'fake-vercel',
		async adapt() {
			mkdirSync(dir, { recursive: true });
			writeFileSync(join(dir, 'config.json'), JSON.stringify(sample));
		}
	};
	const saved = process.env.VERCEL_ENV;
	try {
		if (env === undefined) delete process.env.VERCEL_ENV;
		else process.env.VERCEL_ENV = env;
		await vercelOutput(fake, { dir }).adapt({ log: { minor() {} } });
		return JSON.parse(readFileSync(join(dir, 'config.json'), 'utf8'));
	} finally {
		if (saved === undefined) delete process.env.VERCEL_ENV;
		else process.env.VERCEL_ENV = saved;
		rmSync(dir, { recursive: true, force: true });
	}
}

describe('robots', () => {
	test('the rule: noindex on every path unless the host is www.consultjct.com', () => {
		assert.equal(INDEXABLE_HOST, 'www.consultjct.com');
		assert.deepEqual(NOINDEX_ROUTE, {
			src: '/(.*)',
			missing: [{ type: 'host', value: 'www.consultjct.com' }],
			headers: { 'X-Robots-Tag': 'noindex' },
			continue: true
		});
	});

	// The build environment no longer matters: production deploys to *.vercel.app too.
	for (const env of ['production', 'preview', 'development', undefined]) {
		test(`VERCEL_ENV=${env ?? '(unset)'}: the same host rule, first, exactly once`, async () => {
			const config = await adapt(env);
			assert.deepEqual(config.routes[0], NOINDEX_ROUTE, 'noindex rule must come first');
			assert.deepEqual(config.routes.slice(-sample.routes.length), sample.routes);
			assert.equal(config.routes.filter((r) => r.headers?.['X-Robots-Tag']).length, 1);
		});
	}

	test('no page carries a noindex tag', () => {
		const hits = [];
		const walk = (d) => {
			for (const name of readdirSync(d)) {
				const p = join(d, name);
				if (statSync(p).isDirectory()) walk(p);
				else if (/\.(svelte|js|md|html)$/.test(name) && /noindex/i.test(readFileSync(p, 'utf8')))
					hits.push(p);
			}
		};
		walk('src');
		assert.deepEqual(hits, [], `noindex found in: ${hits.join(', ')}`);
	});
});
