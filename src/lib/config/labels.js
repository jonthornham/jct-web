// Every UI label on the site, in one place: design/jct-download-01/copy-map.md › "UI labels (for
// config)", word for word. Components read these; they never type a label themselves.
// tests/unit/labels.test.js fails when a key in copy-map.md is missing here, or when a component
// uses a key that doesn't exist.
//
// `null` means "not supplied yet" (copy-map marks it as a placeholder); only the keys in
// NOT_SUPPLIED may be null.
export const labels = {
	cta: {
		primary: 'Book a free 15-minute consult',
		primaryShort: 'Free Consult',
		home: 'Book your free consult',
		howIWork: 'See how I work →',
		seltza: 'Read the Seltza story →',
		services: 'Services & Pricing →',
		advisory: 'Book advisory hours',
		sprint: 'Start a Sprint',
		retainer: 'Talk about a retainer',
		linkedin: 'LinkedIn'
	},
	nav: {
		howIWork: 'How I Work',
		services: 'Services',
		work: 'Work',
		about: 'About',
		freeConsult: 'Free Consult',
		linkedin: 'LinkedIn',
		privacy: 'Privacy',
		terms: 'Terms',
		homeAria: 'JCT home',
		menuOpen: 'Open menu',
		menuClose: 'Close menu',
		theme: 'Theme',
		// Not in copy-map (screen-reader only): lamp-web's wording.
		menu: 'Menu',
		main: 'Main',
		footer: 'Footer',
		// 404 chips (copy-map › 404 › Chips: "page names").
		home: 'Home'
	},
	theme: {
		// aria labels on the header's segmented control
		system: 'System theme',
		light: 'Light theme',
		dark: 'Dark theme',
		// the mobile menu's Light | Dark buttons
		lightShort: 'Light',
		darkShort: 'Dark'
	},
	a11y: {
		// Not in copy-map (screen-reader and keyboard only): lamp-web's wording.
		skip: 'Skip to content'
	},
	work: {
		chips: ['Seltza', 'FLO Cycling', 'Global Seafood Exchange'],
		caseEyebrow: 'Case study · {name}',
		labels: ['Starting point', 'What I did', 'Result', "Why it's here"]
	},
	faq: {
		title: 'FAQ'
	},
	form: {
		name: 'Name',
		email: 'Email',
		company: 'Company',
		stage: "Where's your product today?",
		stageOptions: ['Idea', 'Prototype', 'Sampling', 'In production', 'Launched'],
		blocker: "What's the biggest thing in the way?",
		link: 'Link',
		optional: 'Optional',
		submit: 'Book your free consult',
		sending: 'Sending…',
		errors: {
			summary: 'Check the {n} fields marked below.',
			name: 'Enter your name.',
			email: 'Enter an email like name@company.com.',
			company: 'Enter your company.',
			stage: 'Pick the one closest to where you are.',
			blocker: "Tell me what's in the way."
		},
		sendError: "That didn't send. Your answers are still here. Try again, or call 702-518-2998.",
		success: {
			title: "Thanks, it's in.",
			line: "I'll email you to set a time for the call."
		}
	},
	notFound: {
		eyebrow: '404',
		title: "That page isn't here.",
		line: 'The site was rebuilt and some pages moved. Start from one of these.'
	},
	booking: {
		title: 'Free Consult',
		length: '15 min',
		aria: 'Book a time'
	},
	legal: {
		updated: 'Last updated November 20, 2026'
	},
	contact: {
		// copy-map: a placeholder, "Needs contact email". HANDOFF "Still open" 2.
		email: null
	},
	footer: {
		copyright: '© 2026 JCT Consulting'
	}
};

/** Keys copy-map marks as not supplied yet. They may be null until Jon sends them. */
export const NOT_SUPPLIED = ['contact.email'];

/** The value at a dotted path ('nav.work'), or undefined. */
export const label = (path) => path.split('.').reduce((o, k) => o?.[k], labels);

/** Fills {name}-style slots: fill(labels.form.errors.summary, { n: 2 }). */
export const fill = (text, values) => text.replace(/\{(\w+)\}/g, (m, k) => values[k] ?? m);
