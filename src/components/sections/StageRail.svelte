<!--
	Stage rail (section-layouts.md › Stage rail): an ol of the six stages.
	≥1180px: 6 columns, gap 16; a 40px node row, then the card. The rail (2px border-strong) runs
	         through the node centres from each node to the next (16px past the column edge); the
	         last stops at its own column's edge.
	760–1179px: 3 columns, row gap 28; the rail stops at the end of each row.
	<760px: one column; each stage a 40px / 1fr grid, gap 16, 16px bottom padding; the rail runs
	         down from node to node at x = 19px, none after the last.
	Node: 40px circle, surface, inset 2px primary ring, Geist Mono 14/600 accent-text, "01"–"06".
	Card: padding 22, gap 12: 36px icon tile (radius 10, primary-soft), name 20/1.25 600, copy.
-->
<script>
	import Icon from '$components/ui/Icon.svelte';

	let { stages } = $props();

	// Horizontal rail end per position (see above).
	const railEnd = (i) =>
		i === stages.length - 1 ? 'right-0' : i % 3 === 2 ? 'right-0 xl:-right-4' : '-right-4';
</script>

<ol class="m-0 grid list-none gap-x-4 p-0 sm:grid-cols-3 sm:gap-y-7 xl:grid-cols-6">
	{#each stages as stage, i (stage.name)}
		<li
			class="relative grid grid-cols-[40px_1fr] gap-x-4 pb-4 last:pb-0 sm:flex sm:flex-col sm:gap-4 sm:pb-0"
		>
			<div class="relative h-10">
				<span
					aria-hidden="true"
					class="absolute left-5 top-[19px] hidden h-0.5 bg-border-strong sm:block {railEnd(i)}"
				></span>
				<span
					class="relative z-10 grid h-10 w-10 place-items-center rounded-full bg-surface font-mono text-[14px] font-semibold text-accent-text ring-2 ring-inset ring-primary"
					>{String(i + 1).padStart(2, '0')}</span
				>
			</div>
			{#if i < stages.length - 1}
				<span
					aria-hidden="true"
					class="absolute bottom-0 left-[19px] top-10 w-0.5 bg-border-strong sm:hidden"
				></span>
			{/if}
			<div
				class="flex h-full flex-col gap-3 rounded-card bg-surface p-[22px] ring-1 ring-inset ring-border"
			>
				<span
					class="grid h-9 w-9 place-items-center rounded-icon bg-primary-soft text-accent-text"
					aria-hidden="true"><Icon name={stage.icon} size={20} stroke={1.6} /></span
				>
				<!-- h2: the stages are the page's first level under the H1 (heading order). -->
				<h2 class="m-0 text-[20px] font-semibold leading-[1.25] tracking-[-0.01em] text-fg">
					{stage.name}
				</h2>
				<p class="m-0 text-mk-ui text-fg-muted">{stage.body}</p>
			</div>
		</li>
	{/each}
</ol>
