// Services & Pricing (copy-map › Services & Pricing `/services`), word for word. Text the copy
// map only names (the Sprint weeks, the first FAQ answer) was transcribed from the design's screens
// and checked word for word against Jon's copy doc (Session 3a fixes). FAQ answers 2–5 are from
// Jon's copy doc (Services & Pricing › FAQ).
export const services = {
	eyebrow: 'Services & Pricing',
	h1: 'Senior product and operations help, sized to where you are.',
	// The last sentence is an inline link to /free-consult (links.md › Inline link).
	lead: {
		text: "Start with an hour, a five-week sprint, or a month-to-month retainer. Prices are posted because you shouldn't need a sales call to find out what this costs. Not sure which fits?",
		link: 'Book a free 15-minute consult.'
	},
	band: {
		name: 'Free Consult',
		meta: 'Free · 15 minutes',
		line: 'Anyone with a product question; the front door for everything below.'
	},
	// cta: which button (labels.cta.*); href: where it goes (config).
	cards: [
		{
			name: 'Advisory',
			price: '$250',
			unit: '/hour',
			for: 'For founders who need a sharp second opinion.',
			items: [
				'Product, packaging or design-for-manufacturing review',
				'Factory quote and contract review',
				'Launch, pricing or margin review',
				'A written recap with next steps after every session'
			],
			cta: 'advisory'
		},
		{
			name: 'Factory-Ready Sprint',
			price: '$7,500',
			unit: 'fixed',
			time: '5 weeks',
			for: 'For a working prototype that needs a real path to production.',
			items: [
				'Week 1: Design and DFM review, target cost and margin model',
				'Weeks 2–3: Factory shortlist (3–5), RFQ package, quote comparison',
				'Week 4: Sampling plan, tooling plan, production timeline',
				'Week 5: Landed-cost model and a go/no-go readout'
			],
			cta: 'sprint'
		},
		{
			name: 'Fractional Lead',
			price: '$6,000',
			unit: '/month',
			time: 'about 4 days a month',
			for: 'For a company moving through sampling, production or launch.',
			items: [
				'Own the product roadmap and production timeline',
				'Manage factory, vendor and designer relationships',
				'Weekly 60-minute call, plus text and email',
				'Monthly written summary',
				'Month to month, no minimum commitment'
			],
			cta: 'retainer'
		},
		{
			name: 'Fractional Partner',
			price: '$11,000',
			unit: '/month',
			time: 'about 8 days a month',
			for: 'For a company in production or scaling.',
			items: [
				'Everything in Fractional Lead',
				'Forecasting, reorders, fulfillment and customer-service operations',
				'Second-product development',
				'One on-site visit a quarter (travel at cost)',
				'Month to month, no minimum commitment'
			],
			cta: 'retainer'
		}
	],
	sprint: {
		eyebrow: 'Factory-Ready Sprint · $7,500 fixed · 5 weeks',
		h2: 'For a working prototype that needs a real path to production.',
		heads: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
		// span: how many week columns the block covers
		blocks: [
			{ label: 'Week 1', span: 1, body: 'Design and DFM review, target cost and margin model' },
			{
				label: 'Weeks 2–3',
				span: 2,
				body: 'Factory shortlist (3–5), RFQ package, quote comparison'
			},
			{ label: 'Week 4', span: 1, body: 'Sampling plan, tooling plan, production timeline' },
			{ label: 'Week 5', span: 1, body: 'Landed-cost model and a go/no-go readout' }
		],
		outro:
			'You leave with a production plan you can execute yourself or with me. The full fee is credited toward a retainer started within 30 days.'
	},
	notIncluded: {
		lead: 'Not included:',
		body: "hands-on hardware design, website or app builds and firmware are quoted separately at $250/hr, or I'll bring in a specialist. Tooling, samples and third-party costs are paid by the client."
	},
	// Answer 1 is drawn in the design; answers 2–5 are from Jon's copy doc (Services & Pricing › FAQ).
	faq: [
		{
			q: 'Are you remote?',
			a: 'Yes, based in Las Vegas. I travel to clients and factories when it matters.'
		},
		{
			q: 'Do you handle websites, apps and firmware?',
			a: 'Yes. My focus is companies that sell physical products, but I build websites and apps, handle some firmware, and bring in specialists for the rest.'
		},
		{
			q: 'Is there a minimum commitment?',
			a: 'No. Retainers are month to month.'
		},
		{
			q: 'Can we start small?',
			a: 'Yes. Most clients start with a free 15-minute consult, then advisory hours or the Sprint.'
		},
		{
			q: 'What if we need a full-time hire later?',
			a: "Good. I'll help you write the role and interview for it."
		}
	]
};
