<!--
	Page header (section-layouts.md › Page header, non-Home pages): eyebrow (the page name), H1 at
	mk-h1, optional lead; gap 20px.
-->
<script>
	import Container from './Container.svelte';

	let { eyebrow, h1, lead = undefined, children = undefined } = $props();
</script>

<Container class="flex flex-col gap-5 pt-[clamp(40px,6vw,88px)]">
	<p class="m-0 text-mk-eyebrow uppercase text-fg-muted">{eyebrow}</p>
	<h1 class="m-0 max-w-[52rem] text-balance text-mk-h1 text-fg">{h1}</h1>
	{#if lead}<p class="m-0 max-w-[46rem] text-pretty text-mk-lead text-fg-muted">{lead}</p>{/if}
	{@render children?.()}
</Container>
