<!--
	Arrow link (links.md): 15px/600 `link`, no underline; hover underline (offset 4px); active `fg`.
	The label already ends in "→" (labels.cta.*).
-->
<script>
	let { href, class: className = '', children } = $props();
</script>

<a
	{href}
	class="inline-flex self-start rounded text-mk-ui font-semibold text-link no-underline underline-offset-4 hover:underline active:text-fg {className}"
	>{@render children()}</a
>
