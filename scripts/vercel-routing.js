// A small stand-in for Vercel's router, so the redirect and link tests can run on a local build
// with no deploy. It reads the build's .vercel/output/config.json and static files and answers
// "what does this URL return?" the way Vercel would.
//
// It covers only the route kinds this site's build writes: src + headers (+ continue),
// src + status + Location, src + dest, `has` / `missing` host conditions,
// { handle: 'filesystem' }, and the adapter's catch-all
// (a 404 for a site with only prerendered pages). Any other kind of route makes it throw, so a
// change in the adapter's output can't slip past the tests unnoticed.
//
// Host rules (Vercel's platform and domain settings, not in config.json):
//   http://<host>/...          → 308 https://<host>/...  (Vercel always upgrades to HTTPS first)
//   https://consultjct.com/... → 308 https://www.consultjct.com/...  (domain redirect, STATUS.md)
import fs from 'node:fs';
import path from 'node:path';

export const WWW = 'www.consultjct.com';
export const APEX = 'consultjct.com';

const KNOWN = new Set(['src', 'dest', 'headers', 'status', 'continue', 'handle', 'has', 'missing']);

/** A Vercel `has`/`missing` host condition: an exact host, or a regex when it looks like one. */
const hostMatches = (cond, host) => {
	if (cond.type !== 'host') throw new Error(`Unsupported condition type ${cond.type}`);
	return /[\^$()[\]*+?|\\]/.test(cond.value)
		? new RegExp(`^(?:${cond.value})$`).test(host)
		: cond.value === host;
};

export function loadRouter(dir = '.vercel/output') {
	const config = JSON.parse(fs.readFileSync(path.join(dir, 'config.json'), 'utf8'));
	const staticDir = path.join(dir, 'static');
	const overridePaths = new Set(
		Object.values(config.overrides ?? {}).map((o) => '/' + o.path.replace(/\/$/, ''))
	);

	for (const r of config.routes) {
		const extra = Object.keys(r).filter((k) => !KNOWN.has(k));
		if (extra.length) throw new Error(`Unknown route keys ${extra} in ${JSON.stringify(r)}`);
		if (r.handle && r.handle !== 'filesystem') throw new Error(`Unknown handle ${r.handle}`);
	}
	const fsIndex = config.routes.findIndex((r) => r.handle === 'filesystem');
	const before = config.routes.slice(0, fsIndex);
	const after = config.routes.slice(fsIndex + 1);
	for (const r of after) {
		if (!(r.src === '/.*' && /catchall$/.test(r.dest)))
			throw new Error(`Unexpected route after filesystem: ${JSON.stringify(r)}`);
	}

	const anchored = (src) => new RegExp(`^(?:${src.replace(/^\^/, '').replace(/\$$/, '')})$`);
	const fill = (s, m) => s.replace(/\$(\d+)/g, (_, i) => m[Number(i)] ?? '');

	/** Is there a file (or prerendered page) at this path? */
	const served = (p) => {
		const clean = p === '/' ? '/' : p.replace(/\/$/, '');
		if (overridePaths.has(clean === '/' ? '/' : clean)) return true;
		const file = path.join(staticDir, decodeURIComponent(clean));
		return file.startsWith(staticDir) && fs.existsSync(file) && fs.statSync(file).isFile();
	};

	/** Routing for a path on a host (default www): { status, location?, headers }. */
	function routePath(pathname, host = WWW) {
		const headers = {};
		let p = pathname;
		for (const r of before) {
			const m = p.match(anchored(r.src));
			if (!m) continue;
			if (r.has && !r.has.every((c) => hostMatches(c, host))) continue;
			if (r.missing && r.missing.some((c) => hostMatches(c, host))) continue;
			for (const [k, v] of Object.entries(r.headers ?? {})) headers[k] = fill(v, m);
			if (r.status) return { status: r.status, location: headers.Location, headers };
			if (r.continue) continue;
			if (r.dest) p = fill(r.dest, m);
			break;
		}
		return served(p) ? { status: 200, headers } : { status: 404, headers };
	}

	/** One request: { status, location?, headers } for an absolute URL or a path on www. */
	function request(url) {
		const u = new URL(url, `https://${WWW}`);
		if (u.protocol === 'http:')
			return { status: 308, location: `https://${u.host}${u.pathname}`, headers: {} };
		if (u.host === APEX)
			return { status: 308, location: `https://${WWW}${u.pathname}`, headers: {} };
		const res = routePath(u.pathname, u.host);
		if (res.location) res.location = new URL(res.location, `https://${u.host}`).href;
		return res;
	}

	/**
	 * The headers this build's routing adds for a URL on any host, ignoring the domain-level
	 * redirects. Used to test the noindex rule per host (www, apex, *.vercel.app, previews).
	 */
	const headersFor = (url) => {
		const u = new URL(url);
		return routePath(u.pathname, u.host).headers;
	};

	/** Follows redirects (up to 5): { status, hops: [url...], final }. */
	function follow(url) {
		const hops = [];
		let current = new URL(url, `https://${WWW}`).href;
		for (let i = 0; i < 5; i++) {
			const res = request(current);
			if (!res.location) return { status: res.status, hops, final: current };
			hops.push(res.location);
			current = res.location;
		}
		return { status: 'loop', hops, final: current };
	}

	return { config, request, follow, routePath, headersFor };
}
