<!--
	The 404 page (section-layouts.md › 404; copy-map › 404). The root layout's shell wraps it.
	Any other error shows the same page with its status.
-->
<script>
	import { page } from '$app/state';
	import { labels } from '$lib/config/labels';
	import { notFoundNav, CONSULT_HREF } from '$lib/config/site';
	import Container from '$components/layout/Container.svelte';
	import Button from '$components/ui/Button.svelte';
	import JumpChip from '$components/ui/JumpChip.svelte';
</script>

<svelte:head>
	<title>{labels.notFound.title} · JCT</title>
</svelte:head>

<Container class="flex flex-col items-start gap-5 py-[clamp(64px,9vw,128px)]">
	<p class="m-0 font-mono text-mk-eyebrow uppercase text-fg-muted">
		{page.status === 404 ? labels.notFound.eyebrow : page.status}
	</p>
	<h1 class="m-0 max-w-[52rem] text-balance text-mk-h1 text-fg">{labels.notFound.title}</h1>
	<p class="m-0 max-w-[46rem] text-pretty text-mk-lead text-fg-muted">{labels.notFound.line}</p>
	<nav aria-label={labels.nav.main} class="flex flex-wrap gap-2">
		{#each notFoundNav as l (l.href)}
			<JumpChip href={l.href} tone="link">{l.label}</JumpChip>
		{/each}
	</nav>
	<!-- Full width under 760px (buttons.md: page CTAs stack full width). -->
	<Button href={CONSULT_HREF} class="mt-3 w-full sm:w-auto">{labels.cta.primary}</Button>
</Container>
