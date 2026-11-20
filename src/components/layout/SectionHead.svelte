<!--
	Section head (section-layouts.md): max-width 736px, column, gap 14px, margin-bottom
	clamp(28px, 4vw, 48px): optional eyebrow + H2.
-->
<script>
	let { id = undefined, eyebrow = undefined, h2, class: className = '' } = $props();
</script>

<div class="mb-[clamp(28px,4vw,48px)] flex max-w-[46rem] flex-col gap-3.5 {className}">
	{#if eyebrow}<p class="m-0 text-mk-eyebrow uppercase text-fg-muted">{eyebrow}</p>{/if}
	<h2 {id} class="m-0 text-balance text-mk-h2 text-fg">{h2}</h2>
</div>
