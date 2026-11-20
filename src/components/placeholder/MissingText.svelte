<!--
	Copy that's still a placeholder in a content file ("[PLACEHOLDER: …]" strings in
	src/lib/content/). Real text renders as is; a placeholder renders as the amber chip in preview
	builds. Production builds fail on the content file itself, so they never get here.
	Skipped by the placeholder scanner, like Placeholder.svelte.
-->
<script>
	import { isMissing, missingText } from '$lib/config/site';
	import Placeholder from './Placeholder.svelte';

	let { text } = $props();
</script>

{#if isMissing(text)}<Placeholder>{missingText(text)}</Placeholder>{:else}{text}{/if}
