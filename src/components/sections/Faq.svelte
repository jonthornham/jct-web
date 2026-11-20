<!--
	FAQ accordion (faq.md): "FAQ" (mk-h2) left, the list right (4fr / 8fr), one column under 1000px.
	Each question is a <button> in an h3 with aria-expanded / aria-controls; one item open at a
	time, the first open on load. The answers are in the HTML for crawlers: closed ones are hidden
	with the `hidden` attribute, not left out.
-->
<script>
	import { labels } from '$lib/config/labels';
	import Section from '$components/layout/Section.svelte';
	import Icon from '$components/ui/Icon.svelte';
	import MissingText from '$components/placeholder/MissingText.svelte';

	let { items } = $props();
	let open = $state(0);
</script>

<Section
	labelledby="faq-title"
	class="grid gap-x-[clamp(32px,5vw,72px)] gap-y-7 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]"
>
	<h2 id="faq-title" class="m-0 text-mk-h2 text-fg">{labels.faq.title}</h2>
	<div class="border-t">
		{#each items as item, i (item.q)}
			<div class="border-b">
				<h3 class="m-0">
					<button
						type="button"
						id="faq-q-{i}"
						aria-expanded={open === i}
						aria-controls="faq-a-{i}"
						onclick={() => (open = open === i ? -1 : i)}
						class="flex min-h-11 w-full items-center justify-between gap-5 rounded py-5 text-left text-[17px] font-semibold leading-snug text-fg hover:text-link active:text-link"
					>
						<span>{item.q}</span>
						<Icon
							name="chevron-down"
							size={20}
							stroke={1.7}
							class="text-fg-muted transition-transform duration-150 {open === i
								? 'rotate-180'
								: ''}"
						/>
					</button>
				</h3>
				<div
					id="faq-a-{i}"
					role="region"
					aria-labelledby="faq-q-{i}"
					hidden={open !== i}
					class="pb-[22px] text-mk-body text-fg-muted sm:pr-12"
				>
					<p class="m-0"><MissingText text={item.a} /></p>
				</div>
			</div>
		{/each}
	</div>
</Section>
