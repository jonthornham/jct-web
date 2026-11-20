<!--
	Legal page (section-layouts.md › Legal pages): page header, then one 704px prose column with
	"Last updated" and the mdsvex text. The page end panel comes with the other page ends (Session 3).
-->
<script>
	import { labels } from '$lib/config/labels';
	import PageHeader from './PageHeader.svelte';
	import Container from './Container.svelte';

	let { page, children } = $props();
</script>

<svelte:head>
	<title>{page.title}</title>
</svelte:head>

<PageHeader eyebrow={page.eyebrow} h1={page.h1} />
<Container class="pb-mk-section pt-10">
	<div class="prose-legal">
		<p class="text-mk-ui">{labels.legal.updated}</p>
		{@render children()}
	</div>
</Container>
