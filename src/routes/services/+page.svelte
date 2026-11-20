<!--
	Services & Pricing (screens/services-*; copy-map › Services). Sections: header + Free Consult
	band + the four offer cards · the Sprint (week track) · Not included · FAQ · page end.
-->
<script>
	import { services as s } from '$lib/content/services';
	import { labels } from '$lib/config/labels';
	import { site, CONSULT_HREF } from '$lib/config/site';
	import Section from '$components/layout/Section.svelte';
	import SectionHead from '$components/layout/SectionHead.svelte';
	import PageHeader from '$components/layout/PageHeader.svelte';
	import Button from '$components/ui/Button.svelte';
	import Icon from '$components/ui/Icon.svelte';
	import OfferCardFull from '$components/cards/OfferCardFull.svelte';
	import WeekTrack from '$components/sections/WeekTrack.svelte';
	import Faq from '$components/sections/Faq.svelte';
	import PageEnd from '$components/sections/PageEnd.svelte';
	import MissingLink from '$components/placeholder/MissingLink.svelte';

	// Where each card's button goes (HANDOFF "Still open" 3: Stripe links; retainers → consult).
	const hrefs = {
		advisory: site.stripe.advisory,
		sprint: site.stripe.sprintDeposit,
		retainer: CONSULT_HREF
	};
</script>

<Section rule={false} top="pt-[clamp(40px,6vw,88px)]">
	<PageHeader eyebrow={s.eyebrow} h1={s.h1}>
		<p class="m-0 max-w-[46rem] text-pretty text-mk-lead text-fg-muted">
			{s.lead.text}
			<a href={CONSULT_HREF} class="inline-link">{s.lead.link}</a>
		</p>
	</PageHeader>

	<!-- Free Consult band (cards.md): auto / 1fr / auto, primary-soft with a 1.5px primary ring. -->
	<div
		class="mt-[clamp(40px,4vw,56px)] grid items-center gap-x-7 gap-y-4 rounded-card bg-primary-soft p-[26px] ring-[1.5px] ring-inset ring-primary sm:grid-cols-[auto_1fr_auto]"
	>
		<div class="flex min-w-[180px] flex-col gap-1">
			<h2 class="m-0 text-mk-title text-fg">{s.band.name}</h2>
			<p class="m-0 font-mono text-[14px] text-fg-muted">{s.band.meta}</p>
		</div>
		<p class="m-0 text-mk-body text-fg-muted">{s.band.line}</p>
		<Button href={CONSULT_HREF} class="justify-self-start">{labels.cta.primary}</Button>
	</div>

	<ul class="m-0 mt-5 grid list-none gap-4 p-0 sm:grid-cols-2 xl:grid-cols-4">
		{#each s.cards as offer (offer.name)}
			<li><OfferCardFull {offer} href={hrefs[offer.cta]} /></li>
		{/each}
	</ul>
</Section>

<Section labelledby="sprint-title">
	<SectionHead id="sprint-title" eyebrow={s.sprint.eyebrow} h2={s.sprint.h2} />
	<WeekTrack heads={s.sprint.heads} blocks={s.sprint.blocks} />
	<div class="mt-9 flex flex-wrap items-center justify-between gap-6">
		<p class="m-0 max-w-[44rem] text-mk-body text-fg-muted">{s.sprint.outro}</p>
		<MissingLink href={site.stripe.sprintDeposit} button={{ variant: 'primary' }}
			>{labels.cta.sprint}</MissingLink
		>
	</div>
</Section>

<!-- Not included (section-layouts.md › Callout): surface-2, 1px border-strong ring, radius 14. -->
<Section>
	<div
		class="flex max-w-[60rem] gap-3 rounded-md bg-surface-2 px-6 py-[22px] ring-1 ring-inset ring-border-strong"
	>
		<Icon name="info" size={20} class="mt-1 text-fg-muted" />
		<p class="m-0 text-mk-body text-fg-muted">
			<strong class="font-semibold text-fg">{s.notIncluded.lead}</strong>
			{s.notIncluded.body}
		</p>
	</div>
</Section>

<Faq items={s.faq} />

<PageEnd />
