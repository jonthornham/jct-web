<!-- Jump chip (links.md): Work's case-study chips and the 404's page chips. -->
<script>
	// tone: fg (links.md, Work) | link (the 404 screen draws its chips in the link colour)
	let { href, tone = 'fg', children } = $props();
</script>

<a
	{href}
	class="inline-flex min-h-[30px] items-center rounded-pill bg-surface-2 px-3 py-1 text-[14px] font-medium no-underline {tone ===
	'link'
		? 'text-link'
		: 'text-fg'} ring-1 ring-inset ring-border hover:bg-surface-3 hover:no-underline focus-visible:rounded-pill"
	>{@render children()}</a
>
