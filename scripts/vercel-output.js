// Adds JCT's own routing rules to the config the Vercel adapter writes
// (.vercel/output/config.json, Vercel's Build Output API). Order matters; Vercel reads top down:
//
//   1. X-Robots-Tag: noindex on every response whose host isn't exactly www.consultjct.com
//      (Session 3a, item 1). Production also deploys to *.vercel.app before launch, so the build
//      environment can't decide this; the request's host does. Previews, *.vercel.app (production
//      included) and the apex all get it. No page carries a noindex tag.
//   2. The old-URL redirects (src/lib/seo/redirects.js), 301, one hop. "/contact" and "/contact/"
//      both go straight to the target.
//   3. Any other path with a trailing slash → the same path without it (308, Vercel's own code).
//   4. The adapter's routes: pages, static files, then the 404 for anything else.
//
// http → https and consultjct.com → www.consultjct.com are not here: they live in Vercel's
// domain settings (see STATUS.md).
import fs from 'node:fs';
import { redirects, REDIRECT_STATUS } from '../src/lib/seo/redirects.js';

/** The only host search engines may index. */
export const INDEXABLE_HOST = 'www.consultjct.com';

export const NOINDEX_ROUTE = {
	src: '/(.*)',
	missing: [{ type: 'host', value: INDEXABLE_HOST }],
	headers: { 'X-Robots-Tag': 'noindex' },
	continue: true
};

export const TRAILING_SLASH_ROUTE = {
	src: '^/(.+)/$',
	status: 308,
	headers: { Location: '/$1' }
};

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** One Vercel route per redirect. "/a/*" matches /a, /a/ and everything below /a. */
export const redirectRoutes = (list = redirects) =>
	list.map(({ from, to }) => ({
		src: from.endsWith('/*') ? `^${escape(from.slice(0, -2))}(?:/.*)?$` : `^${escape(from)}/?$`,
		status: REDIRECT_STATUS,
		headers: { Location: to }
	}));

/** The Vercel output config with the host-based noindex rule first. Same in every build. */
export const withRobots = (config) => ({
	...config,
	routes: [NOINDEX_ROUTE, ...(config.routes ?? [])]
});

/** The Vercel output config with the redirects and the trailing-slash rule in front. */
export const withRedirects = (config) => ({
	...config,
	routes: [...redirectRoutes(), TRAILING_SLASH_ROUTE, ...(config.routes ?? [])]
});

/** Both, in the order above. */
export const finalize = (config) => withRobots(withRedirects(config));

/** Wraps a SvelteKit adapter so its Vercel output gets the rules above. */
export function vercelOutput(adapter, { dir = '.vercel/output' } = {}) {
	return {
		...adapter,
		async adapt(builder) {
			await adapter.adapt(builder);
			const file = `${dir}/config.json`;
			const config = JSON.parse(fs.readFileSync(file, 'utf8'));
			fs.writeFileSync(file, JSON.stringify(finalize(config), null, '\t'));
			builder.log.minor(
				`Added ${redirects.length} redirects, the trailing-slash rule, and X-Robots-Tag: ` +
					`noindex for every host except ${INDEXABLE_HOST}.`
			);
		}
	};
}
