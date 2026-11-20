// Work (copy-map › Work `/work`). Headings, chips and results are word for word from the copy
// map; the Starting point / What I did / Why it's here text is transcribed from the design's
// screens (the copy map names it, from Jon's doc, without quoting it).
export const work = {
	eyebrow: 'Work',
	h1: 'Case studies',
	lead: 'How physical products went from idea to production and profit.',
	cases: [
		{
			id: 'seltza',
			name: 'Seltza',
			h2: 'Seltza: from a simple idea to a profitable business',
			start:
				'Donovan wanted to bring sparkling water to your tap. There was no product, factory or supply chain.',
			did: {
				intro: 'Over 3 years:',
				items: [
					'Validated the concept and set a target cost and price.',
					'Designed and prototyped the tap and hub.',
					'Helped source and negotiate with factories in Taiwan and China, and ran sampling through the first production run.',
					'Helped with importing, fulfillment, customer service and marketing.'
				]
			},
			result: [
				'Launched in 2021 through DTC channels',
				'profitable by 2021',
				'now shipping across Canada and the United States'
			],
			slots: [
				'Needs: Seltza CAD render, 4:3, 1600px+ wide',
				'Needs: Seltza sample or factory photo, 4:3, 1600px+ wide'
			]
		},
		{
			id: 'flo-cycling',
			name: 'FLO Cycling',
			h2: 'FLO Cycling: 16 years of products, factories and customers',
			start: 'Co-founded in 2009 to make aerodynamic wheels at a price riders could afford.',
			did: {
				text: 'Designed the wheel line and the companion iOS app; ran factory negotiations, new product development, production and forecasting; managed offshore developers; built B2B brand partnerships through the FLO factory team; and trained staff on sales and customer service.'
			},
			result: ['Shipped to 75+ countries', '7-figure annual revenue', 'Ran 2009–2025']
		},
		{
			id: 'global-seafood-exchange',
			name: 'Global Seafood Exchange',
			h2: 'Global Seafood Exchange: a B2B marketplace built from scratch',
			start: 'Seafood processors and buyers had no simple online place to trade.',
			did: {
				text: 'Co-founded it and designed and built the web and iOS marketplace: company and product pages, search, payments and the database structure.'
			},
			why: 'It shows the software side, for product clients whose business needs a website, app or platform.',
			logo: 'GSE',
			slots: ['Needs: GSE web or iOS marketplace screenshot, 16:9, 1920px+ wide']
		}
	]
};
