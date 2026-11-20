// svelte.config.js (from lamp-web)
import vercel from '@sveltejs/adapter-vercel';
import { vercelOutput } from './scripts/vercel-output.js';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
	extensions: ['.md', '.svx'],
	smartypants: {
		dashes: 'oldschool'
	},
	remarkPlugins: [remarkGfm],
	rehypePlugins: [rehypeSlug]
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md', '.svx'],
	preprocess: [vitePreprocess(), mdsvex(mdsvexOptions)],
	kit: {
		// vercelOutput adds the old-URL redirects, the trailing-slash rule and, outside
		// production, X-Robots-Tag: noindex (scripts/vercel-output.js).
		adapter: vercelOutput(
			vercel({
				// Node 24, matching "engines.node" in package.json and .nvmrc. Set explicitly because
				// this adapter version refuses to infer a runtime from a local Node newer than 22.
				runtime: 'nodejs24.x'
			})
		),
		alias: {
			$components: path.resolve(__dirname, 'src/components')
			// $lib is provided by SvelteKit.
		},
		prerender: {
			// Every route is prerendered; a broken internal link fails the build.
			handleHttpError: 'fail',
			handleMissingId: 'fail'
		}
	}
};

export default config;
