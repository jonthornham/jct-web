// Calendly inline embed (components/calendly-block.md).
// The URL comes from site.calendly with the spec's query: no GDPR banner, no event details, and
// the colour set for the current theme (colours take effect on paid Calendly plans only).
const COLOURS = {
	light: { background_color: 'ffffff', text_color: '0b1220', primary_color: '006994' },
	dark: { background_color: '0e1319', text_color: 'eef2f6', primary_color: '5bc0de' }
};

export const CALENDLY_SCRIPT = 'https://assets.calendly.com/assets/external/widget.js';

/** The embed URL for a theme ('light' | 'dark'). */
export function calendlyUrl(base, theme) {
	const u = new URL(base);
	u.searchParams.set('hide_gdpr_banner', '1');
	u.searchParams.set('hide_event_type_details', '1');
	for (const [k, v] of Object.entries(COLOURS[theme] ?? COLOURS.light)) u.searchParams.set(k, v);
	return u.href;
}

/** True for Calendly's postMessage events (they all start "calendly."). */
export const isCalendlyEvent = (e) =>
	e.origin === 'https://calendly.com' &&
	typeof e.data?.event === 'string' &&
	e.data.event.startsWith('calendly.');

let loading;
/** Loads Calendly's widget script once; resolves with window.Calendly. */
export function loadCalendly() {
	loading ??= new Promise((resolve, reject) => {
		const s = document.createElement('script');
		s.src = CALENDLY_SCRIPT;
		s.async = true;
		s.onload = () =>
			window.Calendly ? resolve(window.Calendly) : reject(new Error('no Calendly'));
		s.onerror = () => {
			loading = undefined;
			reject(new Error('Calendly script failed'));
		};
		document.head.appendChild(s);
	});
	return loading;
}
