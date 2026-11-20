<!--
	A link whose URL Jon hasn't sent yet (site.js: linkedin, stripe.*). With a real URL it's a
	normal link (or a Button when `button` is set). While the value is still a placeholder, preview
	builds show the label without a link plus the amber chip; production builds never get here,
	because the placeholder in site.js fails them. Never href="#".
	This file is skipped by the placeholder scanner (scripts/placeholders.js), like Placeholder.svelte.
-->
<script>
	import { isMissing, missingText } from '$lib/config/site';
	import { SHOW_PLACEHOLDERS } from '$lib/placeholders';
	import Button from '$components/ui/Button.svelte';
	import Placeholder from './Placeholder.svelte';

	let { href, external = false, button = undefined, class: className = '', children } = $props();
	const missing = $derived(isMissing(href));
	const rel = $derived(external ? 'noopener' : undefined);
</script>

{#if !missing}
	{#if button}
		<Button {href} {rel} {...button} class={className}>{@render children()}</Button>
	{:else}
		<a {href} {rel} class={className}>{@render children()}</a>
	{/if}
{:else if SHOW_PLACEHOLDERS}
	<span
		class="inline-flex flex-wrap gap-2 {button
			? button.full
				? 'w-full flex-col items-stretch'
				: 'flex-col items-start'
			: 'items-center'}"
	>
		{#if button}
			<Button {...button} disabled class={className}>{@render children()}</Button>
		{:else}
			<span class={className}>{@render children()}</span>
		{/if}
		<Placeholder>{missingText(href)}</Placeholder>
	</span>
{/if}
