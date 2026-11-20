// The SEO registry: the single source for every page's title, description, canonical URL,
// OG image and JSON-LD (Session 2b). The root layout renders it through SeoHead.svelte; the
// sitemap and the SEO tests read it too.
//
// Titles and descriptions for the 6 main pages are word for word from Jon's copy doc (SEO
// table). Privacy and Terms use the first sentence of their text as the description.
import { labels } from '../config/labels.js';
import { site } from '../config/site.js';

/** The canonical origin. Apex and http forward here (Vercel domain settings). */
export const ORIGIN = 'https://www.consultjct.com';

/** Absolute URL on the canonical origin. '/' stays '/'; no trailing slash otherwise. */
export const absolute = (path) => ORIGIN + (path === '/' ? '/' : path.replace(/\/$/, ''));

const ORG_ID = `${ORIGIN}/#organization`;
const PERSON_ID = `${ORIGIN}/about#jon-thornham`;
const SERVICE_ID = `${ORIGIN}/#professional-service`;

const address = {
	'@type': 'PostalAddress',
	addressLocality: 'Las Vegas',
	addressRegion: 'NV',
	addressCountry: 'US'
};
const telephone = '+1-' + site.phone;

const organization = () => ({
	'@type': 'Organization',
	'@id': ORG_ID,
	name: site.legalName,
	url: absolute('/'),
	logo: absolute('/icon-512.png'),
	email: labels.contact.email,
	telephone,
	address,
	founder: { '@id': PERSON_ID }
});

const person = () => ({
	'@type': 'Person',
	'@id': PERSON_ID,
	name: 'Jon Thornham',
	url: absolute('/about'),
	jobTitle: 'Fractional Product & Operations Lead',
	worksFor: { '@id': ORG_ID },
	...(site.linkedin ? { sameAs: [site.linkedin] } : {})
});

const professionalService = (page) => ({
	'@type': 'ProfessionalService',
	'@id': SERVICE_ID,
	name: site.legalName,
	url: absolute('/'),
	description: page.description,
	image: absolute(page.og),
	email: labels.contact.email,
	telephone,
	address,
	areaServed: 'US',
	founder: { '@type': 'Person', name: 'Jon Thornham', url: absolute('/about') }
});

/** Every page gets a WebPage node; / and /about add the nodes the brief asks for. */
const webPage = (page, type = 'WebPage') => ({
	'@type': type,
	'@id': absolute(page.path) + '#webpage',
	url: absolute(page.path),
	name: page.title,
	description: page.description,
	inLanguage: 'en-US',
	primaryImageOfPage: { '@type': 'ImageObject', url: absolute(page.og) }
});

/** @type {Array<{ path: string, key: string, title: string, description: string, og: string, ogAlt: string, graph: (page: any) => object[] }>} */
export const seoPages = [
	{
		path: '/',
		key: 'home',
		title: 'Fractional Product & Operations Lead for Product Startups · JCT',
		description:
			'Jon Thornham helps founders take physical products from prototype to production: sourcing, launch and growth. Free 15-minute consult.',
		og: '/og/og-home.png',
		graph: (p) => [webPage(p), professionalService(p)]
	},
	{
		path: '/how-i-work',
		key: 'howIWork',
		title: 'How I Work: Idea to Factory to Growth · JCT',
		description:
			'Six stages from validation to growth, and what a fractional product and operations lead owns at each.',
		og: '/og/og-how-i-work.png',
		graph: (p) => [webPage(p)]
	},
	{
		path: '/services',
		key: 'services',
		title: 'Services & Pricing · Fractional Product Lead · JCT',
		description:
			'Advisory at $250/hr, a 5-week Factory-Ready Sprint, and month-to-month retainers from $6,000/month.',
		og: '/og/og-services.png',
		graph: (p) => [webPage(p)]
	},
	{
		path: '/work',
		key: 'work',
		title: 'Case Studies: Seltza, FLO Cycling, Global Seafood Exchange · JCT',
		description: 'How physical products went from idea to production and profit.',
		og: '/og/og-work.png',
		graph: (p) => [webPage(p, 'CollectionPage')]
	},
	{
		path: '/about',
		key: 'about',
		title: 'About Jon Thornham · JCT',
		description:
			'Mechanical engineer and FLO Cycling co-founder with 30+ consumer products shipped.',
		og: '/og/og-about.png',
		graph: (p) => [webPage(p, 'AboutPage'), organization(), person()]
	},
	{
		path: '/free-consult',
		key: 'freeConsult',
		title: 'Free 15-Minute Product Consult · JCT',
		description: 'Fifteen minutes, free: get a concrete next step for getting your product made.',
		og: '/og/og-free-consult.png',
		graph: (p) => [webPage(p, 'ContactPage')]
	},
	{
		path: '/privacy',
		key: 'privacy',
		title: 'Privacy · JCT',
		// First sentence of src/lib/content/legal/privacy.md.
		description:
			"consultjct.com is run by JCT Consulting, Jon Thornham's product and operations practice in Las Vegas, Nevada.",
		// No legal-page OG image in the design bundle: the Home image (see STATUS questions).
		og: '/og/og-home.png',
		graph: (p) => [webPage(p)]
	},
	{
		path: '/terms',
		key: 'terms',
		title: 'Terms · JCT',
		// First sentence of src/lib/content/legal/terms.md.
		description:
			'These terms cover your use of consultjct.com and the services JCT Consulting (Jon Thornham, Las Vegas, Nevada) offers through it.',
		og: '/og/og-home.png',
		graph: (p) => [webPage(p)]
	}
].map((p) => ({ ...p, ogAlt: p.title }));

/** The registry entry for a path ('/about', '/about/'), or undefined. */
export const seoFor = (path) =>
	seoPages.find((p) => p.path === (path === '/' ? '/' : path.replace(/\/$/, '')));

/** The JSON-LD document for a page; `<` escaped so it can't close the script tag. */
export const jsonLd = (page) =>
	JSON.stringify({ '@context': 'https://schema.org', '@graph': page.graph(page) }).replace(
		/</g,
		'\\u003c'
	);

/** Everything SeoHead renders for one page. */
export const headFor = (page) => ({
	title: page.title,
	description: page.description,
	canonical: absolute(page.path),
	og: {
		type: 'website',
		siteName: site.legalName,
		locale: 'en_US',
		title: page.title,
		description: page.description,
		url: absolute(page.path),
		image: absolute(page.og),
		imageAlt: page.ogAlt,
		width: 1200,
		height: 630
	},
	jsonLd: jsonLd(page)
});

/** sitemap.xml: the registry's pages on the www origin. */
export const sitemapXml = () =>
	'<?xml version="1.0" encoding="UTF-8"?>\n' +
	'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
	seoPages.map((p) => `\t<url><loc>${absolute(p.path)}</loc></url>\n`).join('') +
	'</urlset>\n';

/** robots.txt: allow everything, point at the sitemap. Previews are kept out by X-Robots-Tag. */
export const robotsTxt = () => `User-agent: *\nAllow: /\n\nSitemap: ${absolute('/sitemap.xml')}\n`;
