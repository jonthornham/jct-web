<!--
	Week track (section-layouts.md › Week track): ≥760px, 5 columns, gap 8px; row 1 the heads
	"Week 1"–"Week 5" (Geist Mono 13/500 fg-subtle, bottom rule); row 2 the blocks, "Weeks 2–3"
	spanning two. Block: surface, radius 14, inset ring, padding 18, gap 8: a 6px primary bar,
	label (Geist Mono 13/600 accent-text), copy (mk-ui fg). Under 760px: one column, heads hidden.
-->
<script>
	let { heads, blocks } = $props();
</script>

<div class="grid gap-2 sm:grid-cols-5">
	{#each heads as head (head)}
		<div
			aria-hidden="true"
			class="hidden border-b px-1 pb-2 font-mono text-[13px] font-medium text-fg-subtle sm:block"
		>
			{head}
		</div>
	{/each}
	<ol class="m-0 contents list-none p-0">
		{#each blocks as block (block.label)}
			<li
				class="flex flex-col gap-2 rounded-md bg-surface p-[18px] ring-1 ring-inset ring-border {block.span ===
				2
					? 'sm:col-span-2'
					: ''}"
			>
				<span class="h-1.5 rounded-pill bg-primary" aria-hidden="true"></span>
				<span class="font-mono text-[13px] font-semibold text-accent-text">{block.label}</span>
				<span class="text-mk-ui text-fg">{block.body}</span>
			</li>
		{/each}
	</ol>
</div>
