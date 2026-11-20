<!--
	Legal page (section-layouts.md › Legal pages): page header, then one 704px prose column with
	"Last updated" and the mdsvex text, then the page end.
-->
<script>
	import { labels } from '$lib/config/labels';
	import PageHeader from './PageHeader.svelte';
	import Section from './Section.svelte';
	import PageEnd from '$components/sections/PageEnd.svelte';

	let { page, children } = $props();
</script>

<Section rule={false} top="pt-[clamp(40px,6vw,88px)]">
	<PageHeader eyebrow={page.eyebrow} h1={page.h1} />
	<div class="prose-legal mt-5">
		<p class="text-mk-ui text-fg-muted">{labels.legal.updated}</p>
		{@render children()}
	</div>
</Section>

<PageEnd />
