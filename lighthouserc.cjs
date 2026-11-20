// Lighthouse CI (`npm run lighthouse`, and the CI workflow): serves the built site with
// `vite preview` on the JCT preview port and audits every page. SEO must score 100 on each.
// Run a build first (`npm run test:seo` builds; CI builds before this step).
const pages = [
	'/',
	'/how-i-work',
	'/services',
	'/work',
	'/about',
	'/free-consult',
	'/privacy',
	'/terms'
];

module.exports = {
	ci: {
		collect: {
			startServerCommand: 'npm run preview',
			startServerReadyPattern: 'localhost:34173',
			url: pages.map((p) => `http://localhost:34173${p}`),
			// Three loads per page; the assertions use the median, so one slow load on GitHub's
			// machine doesn't fail the run (Session 3b).
			numberOfRuns: 3
		},
		assert: {
			assertions: {
				// Session 3a: SEO and Accessibility 100 on every page, Performance at least 90.
				'categories:seo': ['error', { minScore: 1, aggregationMethod: 'median' }],
				'categories:accessibility': ['error', { minScore: 1, aggregationMethod: 'median' }],
				'categories:performance': ['error', { minScore: 0.9, aggregationMethod: 'median' }]
			}
		},
		upload: {
			target: 'filesystem',
			outputDir: '.lighthouseci/reports'
		}
	}
};
