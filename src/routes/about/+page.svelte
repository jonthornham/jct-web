<!--
	About (screens/about-*; copy-map › About). Sections: photo + eyebrow, H1, body, buttons
	(5fr / 7fr) · Background (4fr / 8fr) · page end.
-->
<script>
	import { about as a } from '$lib/content/about';
	import { alt } from '$lib/content/shared';
	import { labels } from '$lib/config/labels';
	import { site, CONSULT_HREF } from '$lib/config/site';
	import Section from '$components/layout/Section.svelte';
	import Button from '$components/ui/Button.svelte';
	import ResponsiveImage from '$components/ui/ResponsiveImage.svelte';
	import PageEnd from '$components/sections/PageEnd.svelte';
	import MissingLink from '$components/placeholder/MissingLink.svelte';
</script>

<Section
	rule={false}
	top="pt-[clamp(40px,6vw,88px)]"
	class="grid items-start gap-[clamp(32px,5vw,72px)] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"
>
	<figure
		class="relative m-0 aspect-[4/5] overflow-hidden rounded-media ring-1 ring-inset ring-border"
	>
		<ResponsiveImage
			name="jon-thornham"
			alt={alt.jon}
			priority
			sizes="(min-width: 1280px) 437px, (min-width: 1000px) 36vw, calc(100vw - 40px)"
			class="absolute inset-0 h-full w-full object-cover object-[40%_30%]"
		/>
	</figure>
	<div class="flex flex-col gap-5">
		<p class="m-0 text-mk-eyebrow uppercase text-fg-muted">{a.eyebrow}</p>
		<h1 class="m-0 max-w-[52rem] text-balance text-mk-h1 text-fg">{a.h1}</h1>
		{#each a.body as para (para)}
			<p class="m-0 text-pretty text-mk-body text-fg">{para}</p>
		{/each}
		<div class="mt-2 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
			<Button href={CONSULT_HREF} class="w-full sm:w-auto">{labels.cta.primary}</Button>
			<MissingLink
				href={site.linkedin}
				external
				button={{ variant: 'secondary' }}
				class="w-full sm:w-auto">{labels.cta.linkedin}</MissingLink
			>
		</div>
	</div>
</Section>

<Section
	labelledby="background-title"
	class="grid gap-x-[clamp(32px,5vw,72px)] gap-y-7 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]"
>
	<h2 id="background-title" class="m-0 text-mk-h2 text-fg">{a.background.h2}</h2>
	<ul class="m-0 list-none border-b p-0">
		{#each a.background.items as item (item.role)}
			<li class="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t py-3.5">
				<span class="text-mk-body text-fg">{item.role}</span>
				{#if item.years}
					<span class="font-mono text-[14px] tabular-nums text-fg-subtle">{item.years}</span>
				{/if}
			</li>
		{/each}
	</ul>
</Section>

<PageEnd />
