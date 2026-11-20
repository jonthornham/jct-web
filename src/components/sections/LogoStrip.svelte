<!--
	Logo strip (cards.md): the proof line (mk-ui fg-muted), then logos in a wrapping row, gap
	20px × 48px (20px × 32px under 760), 30px tall (24px under 760), single colour fg-muted.
	GSE is text (22px/600, 18px under 760) until an outlined SVG arrives. The FLO logo and other
	client logos are placeholders (assets/ASSETS.md › Still needed).
	Section padding clamp(40px, 5vw, 56px).
-->
<script>
	import Section from '$components/layout/Section.svelte';
	import SeltzaLogo from '$components/brand/SeltzaLogo.svelte';
	import Placeholder from '$components/placeholder/Placeholder.svelte';

	let { line } = $props();
</script>

<Section top="pt-[clamp(40px,5vw,56px)]" bottom="pb-[clamp(40px,5vw,56px)]">
	<p class="m-0 text-mk-ui text-fg-muted">{line}</p>
	<ul class="m-0 mt-6 flex list-none flex-wrap items-center gap-x-8 gap-y-5 p-0 sm:gap-x-12">
		<li><SeltzaLogo class="h-6 sm:h-[30px]" /></li>
		<li><Placeholder>Needs FLO Cycling logo, single-colour SVG</Placeholder></li>
		<li>
			<span class="text-[18px] font-semibold leading-none text-fg-muted sm:text-[22px]">GSE</span>
		</li>
		<li><Placeholder>Needs other client logos, with permission</Placeholder></li>
	</ul>
</Section>
