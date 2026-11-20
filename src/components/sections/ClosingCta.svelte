<!--
	Closing CTA (Home only; section-layouts.md › Closing CTA): a `primary` block, white text,
	radius 24, padding clamp(32px, 5vw, 64px); grid 1fr auto, gap 28px × 48px, items at the end.
	H2 mk-h2 white; lead mk-lead at 90% white; the onPrimary button. One column under 1000px.
	Section padding: 0 top, mk-section bottom. White is fixed: the block is primary in both themes.
-->
<script>
	import { labels } from '$lib/config/labels';
	import { CONSULT_HREF } from '$lib/config/site';
	import Section from '$components/layout/Section.svelte';
	import Button from '$components/ui/Button.svelte';

	let { h2, line } = $props();
</script>

<Section rule={false} top="pt-0" labelledby="closing-cta-title">
	<div
		class="grid items-end gap-x-12 gap-y-7 rounded-media bg-primary p-[clamp(32px,5vw,64px)] text-white lg:grid-cols-[1fr_auto]"
	>
		<div class="flex max-w-[40rem] flex-col gap-4">
			<h2 id="closing-cta-title" class="m-0 text-balance text-mk-h2 text-white">{h2}</h2>
			<p class="m-0 text-pretty text-mk-lead text-white/90">{line}</p>
		</div>
		<Button href={CONSULT_HREF} variant="onPrimary" class="w-full sm:w-auto sm:justify-self-start"
			>{labels.cta.home}</Button
		>
	</div>
</Section>
