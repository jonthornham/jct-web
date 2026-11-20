// Search-engine rule (Session 2b preface, item 5):
//   - Non-production deploys (Vercel Preview, Development, and any local build) send
//     X-Robots-Tag: noindex on every response, static files included.
//   - Production (VERCEL_ENV=production) sends no noindex header, and no page carries a
//     <meta name="robots" content="noindex"> tag.
// The header is added to the routing config the Vercel adapter writes (.vercel/output/config.json).
import fs from 'node:fs';

export const NOINDEX_ROUTE = {
	src: '/(.*)',
	headers: { 'X-Robots-Tag': 'noindex' },
	continue: true
};

/** True when this build is for Vercel's production environment. */
export const isProductionDeploy = (vercelEnv) => vercelEnv === 'production';

/** The Vercel output config with the noindex rule first, unless this is production. */
export function withRobots(config, vercelEnv) {
	if (isProductionDeploy(vercelEnv)) return config;
	return { ...config, routes: [NOINDEX_ROUTE, ...(config.routes ?? [])] };
}

/** Wraps a SvelteKit adapter so its Vercel output follows the rule above. */
export function robotsAdapter(
	adapter,
	{ vercelEnv = process.env.VERCEL_ENV, dir = '.vercel/output' } = {}
) {
	return {
		...adapter,
		async adapt(builder) {
			await adapter.adapt(builder);
			const file = `${dir}/config.json`;
			const config = JSON.parse(fs.readFileSync(file, 'utf8'));
			fs.writeFileSync(file, JSON.stringify(withRobots(config, vercelEnv), null, '\t'));
			builder.log.minor(
				isProductionDeploy(vercelEnv)
					? 'Production deploy: no X-Robots-Tag header.'
					: 'Non-production deploy: every response sends X-Robots-Tag: noindex.'
			);
		}
	};
}
