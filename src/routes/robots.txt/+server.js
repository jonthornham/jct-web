import { robotsTxt } from '$lib/seo/registry';

export const prerender = true;

export const GET = () =>
	new Response(robotsTxt(), { headers: { 'content-type': 'text/plain; charset=utf-8' } });
