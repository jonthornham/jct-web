<!-- The page shell: skip link, header, main, footer. Every page and the 404 use it. -->
<script>
	import SkipLink from './SkipLink.svelte';
	import Header from './Header.svelte';
	import Footer from './Footer.svelte';

	let { children } = $props();
</script>

<SkipLink />
<div class="flex min-h-dvh flex-col bg-canvas text-fg">
	<Header />
	<main id="main" tabindex="-1" class="flex-1 scroll-mt-header outline-none">
		{@render children()}
	</main>
	<Footer />
</div>
