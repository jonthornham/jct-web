<!--
	Home (screens/home-*; copy-map › Home). Sections: hero · Sounds familiar? · What I do · Seltza
	proof · logo strip · How it works · closing CTA.
-->
<script>
	import { home } from '$lib/content/home';
	import { alt } from '$lib/content/shared';
	import { labels } from '$lib/config/labels';
	import { CONSULT_HREF } from '$lib/config/site';
	import Section from '$components/layout/Section.svelte';
	import SectionHead from '$components/layout/SectionHead.svelte';
	import Button from '$components/ui/Button.svelte';
	import ArrowLink from '$components/ui/ArrowLink.svelte';
	import ResponsiveImage from '$components/ui/ResponsiveImage.svelte';
	import SeltzaLogo from '$components/brand/SeltzaLogo.svelte';
	import OfferCardCompact from '$components/cards/OfferCardCompact.svelte';
	import ProofPanel from '$components/sections/ProofPanel.svelte';
	import LogoStrip from '$components/sections/LogoStrip.svelte';
	import ClosingCta from '$components/sections/ClosingCta.svelte';

	const grid = 'grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-5';
</script>

<!-- Hero (section-layouts.md › Home hero): 6fr / 5fr, one column under 1000px, text first. -->
<Section
	rule={false}
	top="pt-[clamp(40px,6vw,88px)]"
	class="grid items-center gap-[clamp(32px,5vw,72px)] lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)]"
>
	<div class="flex flex-col gap-6">
		<p class="m-0 text-mk-eyebrow uppercase text-fg-muted">{home.eyebrow}</p>
		<h1 class="m-0 text-balance text-mk-hero text-fg">{home.h1}</h1>
		<p class="m-0 max-w-[36rem] text-pretty text-mk-lead text-fg-muted">{home.lead}</p>
		<div class="mt-2 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
			<Button href={CONSULT_HREF} class="w-full sm:w-auto">{labels.cta.primary}</Button>
			<Button href="/how-i-work" variant="ghost" class="w-full sm:w-auto"
				>{labels.cta.howIWork}</Button
			>
		</div>
	</div>
	<!-- Image: 1:1 under 760px, 4:3 at 760–999px, 4:5 from 1000px; cover at 50% 40%. -->
	<figure
		class="relative m-0 aspect-square overflow-hidden rounded-media ring-1 ring-inset ring-border sm:aspect-[4/3] lg:aspect-[4/5]"
	>
		<ResponsiveImage
			name="seltza-tap"
			alt={alt.seltzaTap}
			priority
			sizes="(min-width: 1280px) 476px, (min-width: 1000px) 40vw, calc(100vw - 40px)"
			class="absolute inset-0 h-full w-full object-cover object-[50%_40%]"
		/>
		<figcaption
			class="absolute bottom-5 left-5 right-5 flex items-center gap-3.5 rounded-card bg-surface px-[18px] py-4 shadow-raised ring-1 ring-inset ring-border"
		>
			<SeltzaLogo class="h-[18px]" alt="Seltza" />
			<span class="h-5 w-px shrink-0 bg-border-strong" aria-hidden="true"></span>
			<span class="text-[14px] leading-snug text-fg">{home.caption}</span>
		</figcaption>
	</figure>
</Section>

<Section labelledby="problems-title">
	<SectionHead id="problems-title" h2={home.problems.h2} />
	<div class={grid}>
		{#each home.problems.cards as card (card.title)}
			<div class="flex flex-col gap-3 rounded-card bg-surface p-7 ring-1 ring-inset ring-border">
				<h3 class="m-0 text-balance text-mk-title text-fg">{card.title}</h3>
				<p class="m-0 text-mk-body text-fg-muted">{card.body}</p>
			</div>
		{/each}
	</div>
</Section>

<Section labelledby="offers-title">
	<SectionHead id="offers-title" h2={home.offers.h2} />
	<div class={grid}>
		{#each home.offers.cards as offer (offer.name)}
			<OfferCardCompact {offer} />
		{/each}
	</div>
</Section>

<Section labelledby="proof-title">
	<ProofPanel h2={home.proof.h2} body={home.proof.body} />
</Section>

<LogoStrip line={home.proofLine} />

<Section labelledby="steps-title">
	<SectionHead id="steps-title" h2={home.steps.h2} />
	<ol class="m-0 list-none p-0 {grid}">
		{#each home.steps.items as step, i (step.title)}
			<li class="flex flex-col gap-4 rounded-card bg-surface p-7 ring-1 ring-inset ring-border">
				<span
					class="grid h-7 w-7 place-items-center rounded-step bg-primary-soft font-mono text-[14px] font-semibold text-accent-text"
					aria-hidden="true">{i + 1}</span
				>
				<h3 class="m-0 text-mk-title text-fg">{step.title}</h3>
				<p class="m-0 text-mk-body text-fg-muted">{step.body}</p>
			</li>
		{/each}
	</ol>
	<ArrowLink href="/how-i-work" class="mt-8">{labels.cta.howIWork}</ArrowLink>
</Section>

<ClosingCta h2={home.cta.h2} line={home.cta.line} />
