<!--
	The Free Consult booking area: Calendly by default, the intake form as the fallback
	(calendly-block.md › States; intake-form.md).
	- No booking URL (site.calendly empty): the form.
	- Calendly not showing after 8s, or its script failed: the form replaces the card.
	- No JavaScript: the prerendered page holds both; CSS shows the form and hides the card
	  (src/app.html marks <html class="js"> when scripts run; .js-only / .nojs-only in app.css).
-->
<script>
	import { onMount } from 'svelte';
	import { site } from '$lib/config/site';
	import CalendlyBlock from './CalendlyBlock.svelte';
	import IntakeForm from './IntakeForm.svelte';

	let mode = $state('page'); // page (prerendered, before scripts) | calendly | form

	onMount(() => {
		if (mode === 'page') mode = site.calendly ? 'calendly' : 'form';
	});
</script>

{#if mode !== 'form'}
	<div class={mode === 'page' ? 'js-only' : ''}>
		<CalendlyBlock onfail={() => (mode = 'form')} />
	</div>
{/if}
{#if mode !== 'calendly'}
	<div class={mode === 'page' ? 'nojs-only' : ''}>
		<IntakeForm active={mode === 'form'} />
	</div>
{/if}
