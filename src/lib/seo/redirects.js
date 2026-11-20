// Old consultjct.com URLs → new pages (docs/REDIRECT_MAP.md; Jon approved Nov 20, 2026).
// All permanent (301) and one hop: each target is a real page, never another redirect.
// The build writes these into Vercel's routing (scripts/vercel-output.js). A trailing slash
// on any of them goes straight to the target too, not through the slash rule first.
//
// `from` is an exact path, or a path ending in /* for the path itself and everything below it.
export const redirects = [
	{ from: '/contact', to: '/free-consult' },
	{ from: '/contact/contact-complete', to: '/free-consult' },
	{ from: '/free-consult/free-consult-complete', to: '/free-consult' },
	{ from: '/business-consulting', to: '/services' },
	{ from: '/engineering-consulting', to: '/services' },
	{ from: '/pricing', to: '/services' },
	{ from: '/partners', to: '/work' },
	{ from: '/blog', to: '/about' },
	{ from: '/blog/the-beginning', to: '/about' },
	{ from: '/charts/*', to: '/' },
	{ from: '/products', to: '/' },
	{ from: '/company/*', to: '/' },
	{ from: '/login', to: '/' },
	{ from: '/register', to: '/' },
	{ from: '/register-business', to: '/' },
	{ from: '/reset-password', to: '/' },
	{ from: '/account', to: '/' },
	{ from: '/documents', to: '/' },
	{ from: '/invoices', to: '/' },
	{ from: '/payment-success', to: '/' },
	{ from: '/payment-cancelled', to: '/' },
	{ from: '/auth/register', to: '/' }
];

export const REDIRECT_STATUS = 301;
