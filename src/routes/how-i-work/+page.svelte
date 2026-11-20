<!--
	How I Work (screens/how-i-work-*; copy-map › How I Work). Sections: header + stage rail ·
	What working together looks like (+ image slot) · What I'm not · page end.
-->
<script>
	import { howIWork as h } from '$lib/content/how-i-work';
	import Section from '$components/layout/Section.svelte';
	import PageHeader from '$components/layout/PageHeader.svelte';
	import CheckList from '$components/ui/CheckList.svelte';
	import StageRail from '$components/sections/StageRail.svelte';
	import PageEnd from '$components/sections/PageEnd.svelte';
	import ImageSlot from '$components/placeholder/ImageSlot.svelte';
</script>

<Section rule={false} top="pt-[clamp(40px,6vw,88px)]">
	<PageHeader eyebrow={h.eyebrow} h1={h.h1} lead={h.lead} />
	<div class="mt-[clamp(40px,5vw,72px)]">
		<StageRail stages={h.stages} />
	</div>
</Section>

<!-- Feature 2-up (6fr / 5fr). The image slot is preview-only; without it the text stands alone. -->
<Section
	labelledby="together-title"
	class="grid items-center gap-[clamp(32px,5vw,72px)] lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)]"
>
	<div class="flex flex-col gap-[clamp(28px,4vw,48px)]">
		<h2 id="together-title" class="m-0 max-w-[46rem] text-balance text-mk-h2 text-fg">
			{h.together.h2}
		</h2>
		<CheckList items={h.together.items} size="body" />
	</div>
	<ImageSlot label={h.together.slot} class="aspect-[4/3]" />
</Section>

<!-- What I'm not (section-layouts.md › Callout): a surface-2 card, max 896px. -->
<Section>
	<div
		class="flex max-w-[56rem] flex-col gap-3 rounded-card bg-surface-2 p-[clamp(24px,3.5vw,40px)] ring-1 ring-inset ring-border"
	>
		<h2 class="m-0 text-mk-title text-fg">{h.notCallout.title}</h2>
		<p class="m-0 text-mk-body text-fg-muted">{h.notCallout.body}</p>
	</div>
</Section>

<PageEnd />
