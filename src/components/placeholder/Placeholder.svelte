<!--
	[PLACEHOLDER] chip (components/placeholders.md): a missing fact, link or logo.
	<Placeholder>Needs contact email</Placeholder> → "[PLACEHOLDER: Needs contact email]"
	Renders only when PUBLIC_SHOW_PLACEHOLDERS=true. A production build with any <Placeholder> left
	in src/ fails (scripts/placeholders.js).
-->
<script>
	import { SHOW_PLACEHOLDERS } from '$lib/placeholders';

	let { children } = $props();
</script>

{#if SHOW_PLACEHOLDERS}
	<span
		data-placeholder
		class="rounded-[4px] bg-warning-soft px-1.5 py-px font-mono text-[0.8125em] font-medium text-warning outline-dashed outline-1 -outline-offset-1 outline-warning-solid [-webkit-box-decoration-break:clone] [box-decoration-break:clone]"
		>[PLACEHOLDER: {@render children()}]</span
	>
{/if}
