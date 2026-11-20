<!--
	Check list (cards.md › Offer card, full): rows of a 20px check icon (1.8 stroke, `primary`,
	2px down) and 16px/1.5 text. `size="body"` uses mk-body text (How I Work, Work).
-->
<script>
	import Icon from './Icon.svelte';

	let { items, size = 'ui', class: className = '' } = $props();
</script>

<ul class="m-0 flex list-none flex-col gap-2.5 p-0 {className}">
	{#each items as item (item)}
		<li
			class="grid grid-cols-[20px_1fr] gap-x-2.5 text-fg {size === 'body'
				? 'text-mk-body'
				: 'text-base leading-[1.5]'}"
		>
			<Icon name="check" size={20} stroke={1.8} class="mt-0.5 text-primary" />
			<span>{item}</span>
		</li>
	{/each}
</ul>
