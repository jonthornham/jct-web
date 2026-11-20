<!--
	Image slot (components/placeholders.md): a photo that hasn't arrived, at its final size and crop.
	<ImageSlot label="Needs: prototyping photo, 4:3, 1600px+ wide" class="aspect-[4/3]" />
	Renders only when PUBLIC_SHOW_PLACEHOLDERS=true; at launch each slot gets its photo or the layout
	drops it. A production build with any <ImageSlot> left in src/ fails.
-->
<script>
	import { SHOW_PLACEHOLDERS } from '$lib/placeholders';

	let { label, class: className = '' } = $props();
</script>

{#if SHOW_PLACEHOLDERS}
	<div
		data-placeholder
		class="image-slot flex min-h-[120px] items-end rounded-card p-3.5 ring-1 ring-inset ring-border {className}"
	>
		<span
			class="rounded-[6px] bg-surface px-2 py-1 font-mono text-[12px] leading-[1.4] text-fg-muted ring-1 ring-inset ring-border"
			>[PLACEHOLDER] {label}</span
		>
	</div>
{/if}
