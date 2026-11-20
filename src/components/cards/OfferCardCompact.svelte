<!--
	Offer card, compact (Home "What I do"; cards.md): the whole card links to /services. Padding 26,
	gap 18; name mk-title; price Geist Mono 600 28px, tabular; "from" and the unit in Geist 15/500
	fg-muted; line mk-body fg-muted; "Services & Pricing →" pinned to the bottom. Hover: ring
	border-strong; focus: the global 2px ring on the card.
-->
<script>
	import { labels } from '$lib/config/labels';

	let { offer } = $props();
</script>

<a
	href="/services"
	class="group flex h-full flex-col gap-[18px] rounded-card bg-surface p-[26px] no-underline ring-1 ring-inset ring-border transition-shadow duration-150 hover:no-underline hover:ring-border-strong"
>
	<h3 class="m-0 text-mk-title text-fg">{offer.name}</h3>
	<p class="m-0 flex items-baseline text-fg">
		{#if offer.from}<span class="mr-1 text-[15px] font-medium text-fg-muted">{offer.from}</span
			>{/if}
		<span class="font-mono text-[28px] font-semibold tabular-nums tracking-[-0.02em]"
			>{offer.price}</span
		>{#if offer.unit}<span class="text-[15px] font-medium text-fg-muted">{offer.unit}</span>{/if}
	</p>
	<p class="m-0 text-mk-body text-fg-muted">{offer.line}</p>
	<span class="mt-auto text-mk-ui font-semibold text-link underline-offset-4 group-hover:underline"
		>{labels.cta.services}</span
	>
</a>
