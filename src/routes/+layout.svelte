<script>
	import '../app.css';
	// Keeps <html data-theme> following the system setting until the visitor picks a theme.
	import '$lib/stores/theme';
	import Shell from '$components/layout/Shell.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<!-- Until launch (SEO session): no page is indexed. -->
	<meta name="robots" content="noindex" />
</svelte:head>

<Shell>
	{@render children()}
</Shell>
