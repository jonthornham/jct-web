<!--
	Offer card, full (Services; cards.md): padding 26, gap 18, equal heights. Name mk-title; price
	Geist Mono 600 36px/1.1 with the unit in Geist 15/500 fg-muted; time line Geist Mono 14px
	fg-muted; "For …" mk-ui fg-muted; check list; a full-width button pinned to the bottom
	(secondary, except "Start a Sprint", primary).
-->
<script>
	import { labels } from '$lib/config/labels';
	import CheckList from '$components/ui/CheckList.svelte';
	import MissingLink from '$components/placeholder/MissingLink.svelte';

	let { offer, href } = $props();
</script>

<div
	class="flex h-full flex-col gap-[18px] rounded-card bg-surface p-[26px] ring-1 ring-inset ring-border"
>
	<div class="flex flex-col gap-2">
		<h3 class="m-0 text-balance text-mk-title text-fg">{offer.name}</h3>
		<p class="m-0 flex flex-wrap items-baseline text-fg">
			<span
				class="font-mono text-[36px] font-semibold tabular-nums leading-[1.1] tracking-[-0.02em]"
				>{offer.price}</span
			><span class="ml-0.5 text-[15px] font-medium text-fg-muted">{offer.unit}</span>
		</p>
		{#if offer.time}<p class="m-0 font-mono text-[14px] text-fg-muted">{offer.time}</p>{/if}
	</div>
	<p class="m-0 text-mk-ui text-fg-muted">{offer.for}</p>
	<CheckList items={offer.items} />
	<div class="mt-auto pt-2">
		<MissingLink
			{href}
			button={{ variant: offer.cta === 'sprint' ? 'primary' : 'secondary', full: true }}
			>{labels.cta[offer.cta]}</MissingLink
		>
	</div>
</div>
