<!--
	Case-study block (cards.md › Case-study block): eyebrow "Case study · {name}", H2, then a dl
	(rows 160px / 1fr, 18px padding, top rules, the last with a bottom rule; stacked at 390).
	Layout: 6fr text / 5fr media, media left when `flip` (FLO). One column under 1000px, text first.
	The media is a snippet: each page passes its own photo, logo panel or image slots.
-->
<script>
	import { labels, fill } from '$lib/config/labels';
	import CheckList from '$components/ui/CheckList.svelte';
	import Chip from '$components/ui/Chip.svelte';

	let { study, flip = false, media } = $props();
	const [START, DID, RESULT, WHY] = labels.work.labels;
</script>

<div
	class="grid items-start gap-[clamp(32px,5vw,72px)] {flip
		? 'lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]'
		: 'lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)]'}"
>
	<div class={flip ? 'lg:order-2' : ''}>
		<p class="m-0 text-mk-eyebrow uppercase text-fg-muted">
			{fill(labels.work.caseEyebrow, { name: study.name })}
		</p>
		<h2 id="{study.id}-title" class="m-0 mt-3.5 max-w-[46rem] text-balance text-mk-h2 text-fg">
			{study.h2}
		</h2>
		<dl class="m-0 mt-[clamp(28px,4vw,32px)] border-b">
			{@render row(START, study.start)}
			<div class="grid gap-x-7 gap-y-1.5 border-t py-[18px] sm:grid-cols-[160px_1fr]">
				<dt class="pt-1 text-[13px] font-semibold uppercase tracking-[.12em] text-fg-muted">
					{DID}
				</dt>
				<dd class="m-0 text-mk-body text-fg">
					{#if study.did.intro}
						<p class="m-0 text-fg-muted">{study.did.intro}</p>
						<CheckList items={study.did.items} class="mt-3" />
					{:else}
						{study.did.text}
					{/if}
				</dd>
			</div>
			{#if study.result}
				<div class="grid gap-x-7 gap-y-1.5 border-t py-[18px] sm:grid-cols-[160px_1fr]">
					<dt class="pt-1 text-[13px] font-semibold uppercase tracking-[.12em] text-fg-muted">
						{RESULT}
					</dt>
					<dd class="m-0">
						<ul class="m-0 flex list-none flex-wrap gap-2 p-0">
							{#each study.result as r (r)}<li><Chip>{r}</Chip></li>{/each}
						</ul>
					</dd>
				</div>
			{/if}
			{#if study.why}{@render row(WHY, study.why)}{/if}
		</dl>
	</div>
	<div class="flex flex-col gap-4 {flip ? 'lg:order-1' : ''}">
		{@render media()}
	</div>
</div>

{#snippet row(label, text)}
	<div class="grid gap-x-7 gap-y-1.5 border-t py-[18px] sm:grid-cols-[160px_1fr]">
		<dt class="pt-1 text-[13px] font-semibold uppercase tracking-[.12em] text-fg-muted">{label}</dt>
		<dd class="m-0 text-mk-body text-fg">{text}</dd>
	</div>
{/snippet}
