/** @type {import('eslint').Linter.Config} */
module.exports = {
	root: true,
	extends: ['eslint:recommended', 'plugin:svelte/recommended', 'prettier'],
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2022,
		extraFileExtensions: ['.svelte']
	},
	env: {
		browser: true,
		es2022: true,
		node: true
	},
	// Set by vite.config.js (define).
	globals: { __SHOW_PLACEHOLDERS__: 'readonly' },
	overrides: [
		{
			files: ['*.svelte'],
			parser: 'svelte-eslint-parser'
		}
	],
	ignorePatterns: ['build/', '.svelte-kit/', 'dist/', '.vercel/', 'design/']
};
