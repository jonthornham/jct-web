<!--
	Home stub (Session 2a): the hero's eyebrow and H1 at mk-hero (44px at 390 → 72px at 1440).
	The full page comes in Session 3.
-->
<script>
	import { pages } from '$lib/content/pages';
	import Container from '$components/layout/Container.svelte';

	const home = pages.home;
</script>

<!-- The hero's 2-up grid (6fr / 5fr), so the H1 wraps as it will on the full page. -->
<Container
	class="grid gap-[clamp(32px,5vw,72px)] py-mk-section lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)]"
>
	<div class="flex flex-col gap-6">
		<p class="m-0 text-mk-eyebrow uppercase text-fg-muted">{home.eyebrow}</p>
		<h1 class="m-0 text-balance text-mk-hero text-fg">{home.h1}</h1>
	</div>
</Container>
