// How I Work (copy-map › How I Work `/how-i-work`), word for word.
export const howIWork = {
	eyebrow: 'How I Work',
	h1: "Six stages from idea to growth. I've run all of them.",
	lead: "Most physical products stall at the hand-offs: design to factory, samples to production, launch to repeat orders. I work across all six stages, so nothing falls between them. Join at whichever stage you're in.",
	// icon: section-layouts.md › Stage rail (Lucide equivalents)
	stages: [
		{
			name: 'Validate',
			icon: 'target',
			body: 'Is there a market, and can it be made at a price people will pay? Target cost, margin model, competitive teardown.'
		},
		{
			name: 'Design',
			icon: 'pencil',
			body: 'Design for manufacturing from day one: materials, tolerances, part count, packaging. I review your CAD or bring in the right designer.'
		},
		{
			name: 'Prototype',
			icon: 'box',
			body: 'Proof of concept to looks-like/works-like units. 3D printing, electronics and firmware, user testing.'
		},
		{
			name: 'Source',
			icon: 'factory',
			body: "Factory shortlist, RFQs, quote comparison, negotiation, tooling and payment terms. I've negotiated with factories for 16 years."
		},
		{
			name: 'Produce',
			icon: 'boxes',
			body: 'Sampling rounds, golden sample, QC plan, production timeline, landed cost, importing and freight.'
		},
		{
			name: 'Grow',
			icon: 'trending-up',
			body: 'Forecasting and reorders, fulfillment, customer service playbooks, DTC and B2B channels, and the second product.'
		}
	],
	together: {
		h2: 'What working together looks like',
		items: [
			'A weekly 60-minute call, plus text and email in between.',
			'A shared roadmap with milestones and owners.',
			'I join factory and vendor calls and own the follow-up.',
			"A monthly written summary: what shipped, what's next, what's at risk."
		],
		slot: 'Needs: prototyping or 3D-print photo, 4:3, 1600px+ wide'
	},
	notCallout: {
		title: "What I'm not:",
		body: "a design agency or a contract manufacturer. I lead the work and manage the people doing it, and I'll roll up my sleeves on hardware, website or app work when that's the fastest way through."
	}
};
