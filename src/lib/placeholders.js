// True only in preview builds (PUBLIC_SHOW_PLACEHOLDERS=true, set by vite.config.js). A
// production build with any placeholder left fails before this matters: scripts/placeholders.js.
// eslint-disable-next-line no-undef
export const SHOW_PLACEHOLDERS =
	typeof __SHOW_PLACEHOLDERS__ !== 'undefined' && __SHOW_PLACEHOLDERS__;
