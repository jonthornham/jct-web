<!--
	Home proof panel (cards.md): surface-2, radius 24, inset ring, padding clamp(28px, 4.5vw, 56px);
	two equal columns (stacking under 1000px): Seltza logo (24px), H2, body, arrow link | the quote.
-->
<script>
	import { labels } from '$lib/config/labels';
	import SeltzaLogo from '$components/brand/SeltzaLogo.svelte';
	import ArrowLink from '$components/ui/ArrowLink.svelte';
	import QuotePanel from './QuotePanel.svelte';

	let { h2, body } = $props();
</script>

<div
	class="grid gap-[clamp(32px,5vw,72px)] rounded-media bg-surface-2 p-[clamp(28px,4.5vw,56px)] ring-1 ring-inset ring-border lg:grid-cols-2"
>
	<div class="flex flex-col items-start gap-5">
		<SeltzaLogo class="h-6" />
		<h2 id="proof-title" class="m-0 text-balance text-mk-h2 text-fg">{h2}</h2>
		<p class="m-0 text-pretty text-mk-body text-fg-muted">{body}</p>
		<ArrowLink href="/work#seltza">{labels.cta.seltza}</ArrowLink>
	</div>
	<QuotePanel panel={false} />
</div>
