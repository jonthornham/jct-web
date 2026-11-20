<!--
	Page end (section-layouts.md › Page end): a surface-2 panel, radius 24, inset ring, padding
	clamp(28px, 4.5vw, 56px), wrapping space-between, gap 24px × 48px: H2 at mk-h3, line mk-body
	fg-muted (max 640px), the primary CTA.
-->
<script>
	import { pageEnd } from '$lib/content/shared';
	import { labels } from '$lib/config/labels';
	import { CONSULT_HREF } from '$lib/config/site';
	import Section from '$components/layout/Section.svelte';
	import Button from '$components/ui/Button.svelte';
</script>

<Section labelledby="page-end-title">
	<div
		class="flex flex-wrap items-center justify-between gap-x-12 gap-y-6 rounded-media bg-surface-2 p-[clamp(28px,4.5vw,56px)] ring-1 ring-inset ring-border"
	>
		<div class="flex max-w-[40rem] flex-col gap-2">
			<h2 id="page-end-title" class="m-0 text-balance text-mk-h3 text-fg">{pageEnd.title}</h2>
			<p class="m-0 text-pretty text-mk-body text-fg-muted">{pageEnd.line}</p>
		</div>
		<Button href={CONSULT_HREF} class="w-full sm:w-auto">{labels.cta.primary}</Button>
	</div>
</Section>
