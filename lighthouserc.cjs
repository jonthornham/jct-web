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
			numberOfRuns: 1
		},
		assert: {
			assertions: {
				'categories:seo': ['error', { minScore: 1 }]
			}
		},
		upload: {
			target: 'filesystem',
			outputDir: '.lighthouseci/reports'
		}
	}
};
