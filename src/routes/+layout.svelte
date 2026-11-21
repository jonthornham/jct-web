<script>
	import '../app.css';
	// Keeps <html data-theme> following the system setting until the visitor picks a theme.
	import '$lib/stores/theme';
	import Shell from '$components/layout/Shell.svelte';
	import SeoHead from '$components/seo/SeoHead.svelte';
	import { onMount } from 'svelte';
	// Google Analytics: starts only on www.consultjct.com with VITE_GA_MEASUREMENT_ID set.
	import { initAnalytics } from '$lib/analytics';

	let { children } = $props();

	onMount(() => initAnalytics());
</script>

<SeoHead />

<Shell>
	{@render children()}
</Shell>
