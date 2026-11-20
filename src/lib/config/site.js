// Site facts and navigation, in one place. Labels come from ./labels.js.
import { labels } from './labels.js';

export const site = {
	name: 'JCT',
	legalName: 'JCT Consulting',
	// copy-map › Shared: header (≥1280), footer, Home eyebrow
	tagline: 'Fractional product & operations for product startups',
	phone: '702-518-2998',
	// Calendly (Session 3a): Jon's account page for now. Jon sends the 15-minute event link later.
	calendly: 'https://calendly.com/jon-consultjct',
	// Links not supplied yet (HANDOFF "Still open" 3). Each value below is a placeholder that the
	// scanner finds, so a production build fails until Jon sends the real URL. Preview builds
	// show the label without a link, plus an amber chip (MissingLink.svelte). Never href="#".
	linkedin: '[PLACEHOLDER: Needs LinkedIn URL]',
	stripe: {
		advisory: '[PLACEHOLDER: Needs Stripe payment link for advisory hours]',
		sprintDeposit: '[PLACEHOLDER: Needs Stripe payment link for the Sprint deposit]'
	}
};

// Built from parts so this helper isn't itself counted as a placeholder by the scanner.
const MARK = '[' + 'PLACEHOLDER:';

/** True for a link Jon hasn't sent yet (one of the placeholders above). */
export const isMissing = (href) => typeof href !== 'string' || href.startsWith(MARK);

/** The text of a missing link's chip, without the marker: "Needs LinkedIn URL". */
export const missingText = (href) => href.slice(MARK.length).replace(/\]$/, '').trim();

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
	{ href: site.linkedin, label: labels.nav.linkedin, external: true }
];

export const legalNav = [
	{ href: '/privacy', label: labels.nav.privacy },
	{ href: '/terms', label: labels.nav.terms }
];

/** 404 jump chips (copy-map › 404): Home · How I Work · Services · Work · About. */
export const notFoundNav = [{ href: '/', label: labels.nav.home }, ...headerNav];
