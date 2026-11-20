<script>
	// The one content width (section-layouts.md): 1200px, centred, with the responsive mk-gutter
	// (20px at 390 → 40px at 1440). Extra classes go on the same element.
	let { class: className = '', children } = $props();
</script>

<div class="mx-auto w-full max-w-mk-content px-mk-gutter {className}">
	{@render children?.()}
</div>
