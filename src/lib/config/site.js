// Site facts and navigation, in one place. Labels come from ./labels.js.
import { labels } from './labels.js';

export const site = {
	name: 'JCT',
	legalName: 'JCT Consulting',
	// copy-map › Shared: header (≥1280), footer, Home eyebrow
	tagline: 'Fractional product & operations for product startups',
	phone: '702-518-2998',
	// Not supplied yet (HANDOFF "Still open" 3): href="#" until Jon sends them.
	linkedin: null,
	stripe: { advisory: null, sprintDeposit: null }
};

/** The free consult page, where every CTA goes. */
export const CONSULT_HREF = '/free-consult';

/** Header nav (header-nav.md): How I Work · Services · Work · About. */
export const headerNav = [
	{ href: '/how-i-work', label: labels.nav.howIWork },
	{ href: '/services', label: labels.nav.services },
	{ href: '/work', label: labels.nav.work },
	{ href: '/about', label: labels.nav.about }
];

/** Footer links (footer.md): the header four, then Free Consult and LinkedIn. */
export const footerNav = [
	...headerNav,
	{ href: CONSULT_HREF, label: labels.nav.freeConsult },
	{ href: site.linkedin ?? '#', label: labels.nav.linkedin, external: true }
];

export const legalNav = [
	{ href: '/privacy', label: labels.nav.privacy },
	{ href: '/terms', label: labels.nav.terms }
];

/** 404 jump chips (copy-map › 404): Home · How I Work · Services · Work · About. */
export const notFoundNav = [{ href: '/', label: labels.nav.home }, ...headerNav];
