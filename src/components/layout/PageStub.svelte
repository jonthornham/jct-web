<!-- A Session 2a page stub: the page header only. The full page comes in Session 3. -->
<script>
	import PageHeader from './PageHeader.svelte';

	let { page } = $props();
</script>

<div class="pb-mk-section">
	<PageHeader eyebrow={page.eyebrow} h1={page.h1} />
</div>
