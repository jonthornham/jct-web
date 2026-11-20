// Search-engine rule: non-production deploys send X-Robots-Tag: noindex; production pages carry
// no noindex tag and get no noindex header. `npm run test:unit`.
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
import { NOINDEX_ROUTE, robotsAdapter, withRobots } from '../../scripts/robots.js';

const sample = {
	version: 3,
	routes: [{ src: '/about', dest: '/about/' }, { handle: 'filesystem' }]
};

/** Runs the wrapped adapter against a fake Vercel adapter; returns the config it leaves behind. */
async function adapt(vercelEnv) {
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
	try {
		await robotsAdapter(fake, { vercelEnv, dir }).adapt({ log: { minor() {} } });
		return JSON.parse(readFileSync(join(dir, 'config.json'), 'utf8'));
	} finally {
		rmSync(dir, { recursive: true, force: true });
	}
}

const hasNoindexHeader = (config) =>
	config.routes.some((r) => /noindex/i.test(r.headers?.['X-Robots-Tag'] ?? ''));

describe('robots', () => {
	for (const env of ['preview', 'development', undefined]) {
		test(`non-production (${env ?? 'local build'}): every response sends X-Robots-Tag: noindex`, async () => {
			const config = await adapt(env);
			assert.deepEqual(config.routes[0], NOINDEX_ROUTE, 'noindex rule must come first');
			assert.equal(config.routes[0].src, '/(.*)');
			assert.equal(config.routes[0].continue, true);
			assert.deepEqual(config.routes.slice(1), sample.routes);
		});
	}

	test('production: no noindex header', async () => {
		const config = await adapt('production');
		assert.deepEqual(config, sample);
		assert.equal(hasNoindexHeader(config), false);
		assert.deepEqual(withRobots(sample, 'production'), sample);
	});

	test('production: no page carries a noindex tag', () => {
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
