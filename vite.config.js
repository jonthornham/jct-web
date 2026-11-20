import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';
import { placeholderGuard } from './scripts/placeholders.js';

export default defineConfig(({ mode }) => {
	// PUBLIC_SHOW_PLACEHOLDERS=true (preview builds) shows the [PLACEHOLDER] chips and image slots.
	// Anything else hides them. See components/placeholders.md in the design bundle.
	const env = { ...loadEnv(mode, process.cwd(), 'PUBLIC_'), ...process.env };
	const show = env.PUBLIC_SHOW_PLACEHOLDERS === 'true';

	return {
		define: { __SHOW_PLACEHOLDERS__: JSON.stringify(show) },
		plugins: [placeholderGuard({ show, vercelEnv: env.VERCEL_ENV }), sveltekit()],
		server: { port: 35173, strictPort: true },
		preview: { port: 34173, strictPort: true }
	};
});
