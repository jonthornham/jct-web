<!--
	Every page's head tags from the SEO registry ($lib/seo/registry.js). Rendered once, by the root
	layout. The 404 page sets its own title in +error.svelte and gets no canonical or OG tags.
-->
<script>
	import { page } from '$app/state';
	import { seoFor, headFor } from '$lib/seo/registry';

	const entry = $derived(page.error ? undefined : seoFor(page.url.pathname));
	const seo = $derived(entry ? headFor(entry) : undefined);
</script>

<svelte:head>
	{#if seo}
		<title>{seo.title}</title>
		<meta name="description" content={seo.description} />
		<link rel="canonical" href={seo.canonical} />
		<meta property="og:type" content={seo.og.type} />
		<meta property="og:site_name" content={seo.og.siteName} />
		<meta property="og:locale" content={seo.og.locale} />
		<meta property="og:title" content={seo.og.title} />
		<meta property="og:description" content={seo.og.description} />
		<meta property="og:url" content={seo.og.url} />
		<meta property="og:image" content={seo.og.image} />
		<meta property="og:image:width" content={String(seo.og.width)} />
		<meta property="og:image:height" content={String(seo.og.height)} />
		<meta property="og:image:alt" content={seo.og.imageAlt} />
		<meta name="twitter:card" content="summary_large_image" />
		<meta name="twitter:image" content={seo.og.image} />
		<!-- jsonLd is built in $lib/seo/registry.js from config, with `<` escaped. -->
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html `<script type="application/ld+json">${seo.jsonLd}</` + 'script>'}
	{/if}
</svelte:head>
