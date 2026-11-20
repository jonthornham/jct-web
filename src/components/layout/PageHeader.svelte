<!--
	Page header (section-layouts.md › Page header, non-Home pages): eyebrow (the page name), H1 at
	mk-h1 (max ≈ 830px), optional lead (mk-lead fg-muted, max 736px); gap 20px. It sits in the
	page's first Section, whose top padding is clamp(40px, 6vw, 88px) (PAGE_TOP).
-->
<script>
	let { eyebrow, h1, lead = undefined, class: className = '', children = undefined } = $props();
</script>

<div class="flex flex-col gap-5 {className}">
	<p class="m-0 text-mk-eyebrow uppercase text-fg-muted">{eyebrow}</p>
	<h1 class="m-0 max-w-[52rem] text-balance text-mk-h1 text-fg">{h1}</h1>
	{#if lead}<p class="m-0 max-w-[46rem] text-pretty text-mk-lead text-fg-muted">{lead}</p>{/if}
	{@render children?.()}
</div>
