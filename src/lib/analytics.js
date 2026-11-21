// Google Analytics 4 through gtag.js (not Tag Manager). Session 3b part 2.
//
// - Loads only on www.consultjct.com, and only when VITE_GA_MEASUREMENT_ID is set: never on
//   localhost, Vercel previews (*.vercel.app), the bare consultjct.com or any other host.
// - The gtag.js script is added once the page has loaded and the browser is idle.
// - Consent Mode v2, no banner: granted by default, but analytics and ad storage (cookies) are
//   denied for the EEA, the UK and Switzerland. GA then counts those visits without cookies.
//   Ad user data and ad personalisation are denied everywhere: nothing here is for advertising.
// - Google signals and ad personalisation signals are off.
// Privacy policy: src/lib/content/legal/privacy.md ("When you visit"). Tests: tests/unit/analytics.test.js.

/** The only host that loads analytics. */
export const GA_HOST = 'www.consultjct.com';

/** EEA (EU 27 + Iceland, Liechtenstein, Norway), the UK and Switzerland: no analytics cookies. */
export const CONSENT_REGIONS = [
	'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT',
	'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE',
	'IS', 'LI', 'NO',
	'GB', 'CH'
]; // prettier-ignore

const ID_RE = /^G-[A-Z0-9]{4,}$/;

/** True only on www.consultjct.com with a G-… measurement ID. */
export const shouldLoad = ({ host, id }) => host === GA_HOST && ID_RE.test(id ?? '');

/** The gtag calls made before gtag.js loads, in order. */
export function setupCalls(id) {
	return [
		// The regional default first; Google applies the most specific region that matches.
		[
			'consent',
			'default',
			{
				analytics_storage: 'denied',
				ad_storage: 'denied',
				ad_user_data: 'denied',
				ad_personalization: 'denied',
				region: CONSENT_REGIONS
			}
		],
		[
			'consent',
			'default',
			{
				analytics_storage: 'granted',
				ad_storage: 'granted',
				ad_user_data: 'denied',
				ad_personalization: 'denied'
			}
		],
		['js', new Date()],
		['config', id, { allow_google_signals: false, allow_ad_personalization_signals: false }]
	];
}

export const scriptSrc = (id) =>
	`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;

let started = false;

/**
 * Starts analytics if this is www.consultjct.com and an ID is set; otherwise does nothing.
 * The dataLayer is set up at once (so events are queued); gtag.js is added when idle.
 * Returns true when it started.
 */
export function initAnalytics({
	id = import.meta.env?.VITE_GA_MEASUREMENT_ID,
	win = globalThis.window,
	doc = globalThis.document
} = {}) {
	if (started || !win || !doc || !shouldLoad({ host: win.location?.hostname, id })) return false;
	started = true;
	win.dataLayer = win.dataLayer || [];
	// gtag.js reads `arguments` objects from the dataLayer, so this must stay a plain function.
	win.gtag = function gtag() {
		win.dataLayer.push(arguments); // eslint-disable-line prefer-rest-params
	};
	for (const call of setupCalls(id)) win.gtag(...call);

	const add = () => {
		const s = doc.createElement('script');
		s.async = true;
		s.src = scriptSrc(id);
		doc.head.appendChild(s);
	};
	const idle = () =>
		win.requestIdleCallback
			? win.requestIdleCallback(add, { timeout: 5000 })
			: win.setTimeout(add, 1);
	if (doc.readyState === 'complete') idle();
	else win.addEventListener('load', idle, { once: true });
	return true;
}

/** Counts an event (e.g. 'consult_submitted'). Does nothing where analytics didn't start. */
export function track(event, params = {}, win = globalThis.window) {
	if (typeof win?.gtag === 'function') win.gtag('event', event, params);
}

/** For tests only. */
export const _reset = () => {
	started = false;
};
