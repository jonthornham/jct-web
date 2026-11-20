<!--
	Work (screens/work-*; copy-map › Work). Sections: header + jump chips · Seltza (+ quote) ·
	FLO Cycling (media left) · Global Seafood Exchange · page end.
-->
<script>
	import { work as w } from '$lib/content/work';
	import { alt } from '$lib/content/shared';
	import Section from '$components/layout/Section.svelte';
	import PageHeader from '$components/layout/PageHeader.svelte';
	import JumpChip from '$components/ui/JumpChip.svelte';
	import ResponsiveImage from '$components/ui/ResponsiveImage.svelte';
	import CaseStudy from '$components/sections/CaseStudy.svelte';
	import QuotePanel from '$components/sections/QuotePanel.svelte';
	import PageEnd from '$components/sections/PageEnd.svelte';
	import ImageSlot from '$components/placeholder/ImageSlot.svelte';

	const [seltza, flo, gse] = w.cases;
	const frame = 'm-0 overflow-hidden rounded-media ring-1 ring-inset ring-border';
	const mediaSizes = '(min-width: 1280px) 476px, (min-width: 1000px) 40vw, calc(100vw - 40px)';
</script>

<!-- The design closes the header section 48px under the chips (not the full section padding). -->
<Section rule={false} top="pt-[clamp(40px,6vw,88px)]" bottom="pb-[clamp(36px,4vw,48px)]">
	<PageHeader eyebrow={w.eyebrow} h1={w.h1} lead={w.lead}>
		<ul class="m-0 flex list-none flex-wrap gap-2 p-0">
			{#each w.cases as c (c.id)}
				<li><JumpChip href="#{c.id}" tone="link">{c.name}</JumpChip></li>
			{/each}
		</ul>
	</PageHeader>
</Section>

<Section id={seltza.id} labelledby="{seltza.id}-title" class="flex flex-col gap-12">
	<CaseStudy study={seltza}>
		{#snippet media()}
			<figure class="relative aspect-[4/5] {frame}">
				<ResponsiveImage
					name="seltza-tap"
					alt={alt.seltzaTap}
					sizes={mediaSizes}
					class="absolute inset-0 h-full w-full object-cover object-[50%_40%]"
				/>
			</figure>
			<!-- Two 4:3 slots side by side (preview only; removed at launch if no photo). -->
			<div class="grid grid-cols-2 gap-4 empty:hidden">
				{#each seltza.slots as label (label)}<ImageSlot {label} class="aspect-[4/3]" />{/each}
			</div>
		{/snippet}
	</CaseStudy>
	<QuotePanel />
</Section>

<Section id={flo.id} labelledby="{flo.id}-title">
	<CaseStudy study={flo} flip>
		{#snippet media()}
			<!-- Studio shot on white: a white plate in both themes, contain with 6% padding. -->
			<figure class="relative aspect-[4/5] bg-white p-[6%] {frame}">
				<ResponsiveImage
					name="flo-64-as-disc"
					alt={alt.flo}
					sizes={mediaSizes}
					class="h-full w-full object-contain"
				/>
			</figure>
		{/snippet}
	</CaseStudy>
</Section>

<Section id={gse.id} labelledby="{gse.id}-title">
	<CaseStudy study={gse}>
		{#snippet media()}
			<!-- GSE as text until an outlined SVG logo arrives (assets/ASSETS.md › Logos). -->
			<div
				class="grid aspect-[16/9] place-items-center rounded-media bg-fg text-canvas ring-1 ring-inset ring-border dark:bg-surface dark:text-fg"
			>
				<span class="text-[clamp(56px,8vw,96px)] font-semibold leading-none tracking-[-0.02em]"
					>{gse.logo}</span
				>
			</div>
			{#each gse.slots as label (label)}<ImageSlot {label} class="aspect-[16/9]" />{/each}
		{/snippet}
	</CaseStudy>
</Section>

<PageEnd />
