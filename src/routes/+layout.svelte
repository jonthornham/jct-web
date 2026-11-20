<script>
	import '../app.css';
	// Keeps <html data-theme> following the system setting until the visitor picks a theme.
	import '$lib/stores/theme';
	import Shell from '$components/layout/Shell.svelte';
	import SeoHead from '$components/seo/SeoHead.svelte';

	let { children } = $props();
</script>

<SeoHead />

<Shell>
	{@render children()}
</Shell>
