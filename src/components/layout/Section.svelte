<!--
	A page section (section-layouts.md): canvas background, 1px `border` rule on top, padding
	clamp(56px, 7vw, 88px) top and bottom, content in the 1200px container. Sections never
	alternate background colours.
	rule   false for the first section under the header (the header has its own rule)
	top    override the top padding class (page headers use clamp(40px, 6vw, 88px))
-->
<script>
	import Container from './Container.svelte';

	let {
		id = undefined,
		rule = true,
		top = 'pt-mk-section',
		bottom = 'pb-mk-section',
		labelledby = undefined,
		class: className = '',
		children
	} = $props();
</script>

<section {id} aria-labelledby={labelledby} class="{rule ? 'border-t' : ''} {top} {bottom}">
	<Container class={className}>
		{@render children()}
	</Container>
</section>
