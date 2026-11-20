<!--
	Stroke icons (24px grid, Lucide shapes, ISC licence). Decorative: always aria-hidden.
	<Icon name="check" size={20} stroke={1.8} class="text-primary" />
-->
<script>
	let { name, size = 20, stroke = 1.6, class: className = '' } = $props();
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	width={size}
	height={size}
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width={stroke}
	stroke-linecap="round"
	stroke-linejoin="round"
	aria-hidden="true"
	focusable="false"
	class="shrink-0 {className}"
>
	{#if name === 'check'}
		<path d="M20 6 9 17l-5-5" />
	{:else if name === 'chevron-down'}
		<path d="m6 9 6 6 6-6" />
	{:else if name === 'info'}
		<circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
	{:else if name === 'target'}
		<circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle
			cx="12"
			cy="12"
			r="2"
		/>
	{:else if name === 'pencil'}
		<path
			d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"
		/><path d="m15 5 4 4" />
	{:else if name === 'box'}
		<path
			d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"
		/><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" />
	{:else if name === 'factory'}
		<path
			d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"
		/><path d="M17 18h1" /><path d="M12 18h1" /><path d="M7 18h1" />
	{:else if name === 'boxes'}
		<rect x="3" y="13" width="8" height="8" rx="1" /><rect
			x="13"
			y="13"
			width="8"
			height="8"
			rx="1"
		/><rect x="8" y="3" width="8" height="8" rx="1" />
	{:else if name === 'circle-alert'}
		<circle cx="12" cy="12" r="10" /><path d="M12 8v4" /><path d="M12 16h.01" />
	{:else if name === 'loader'}
		<path d="M21 12a9 9 0 1 1-6.219-8.56" />
	{:else if name === 'trending-up'}
		<path d="M16 7h6v6" /><path d="m22 7-8.5 8.5-5-5L2 17" />
	{/if}
</svg>
