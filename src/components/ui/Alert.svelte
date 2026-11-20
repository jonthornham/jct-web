<!--
	Alert (intake-form.md › Alerts): radius 14px, padding 16px 18px, 15px/1.5, 20px icon, gap 12px.
	tone  danger | success | neutral
	The caller sets role="alert" (or "status") when it should be announced.
-->
<script>
	import Icon from './Icon.svelte';

	// svelte-ignore custom_element_props_identifier
	let { tone = 'neutral', class: className = '', children, ...rest } = $props();

	const tones = {
		danger: { box: 'bg-danger-soft ring-danger/35', icon: 'circle-alert', color: 'text-danger' },
		success: { box: 'bg-success-soft ring-success/35', icon: 'check', color: 'text-success' },
		neutral: { box: 'bg-surface-2 ring-border-strong', icon: 'info', color: 'text-fg-muted' }
	};
	const t = $derived(tones[tone] ?? tones.neutral);
</script>

<div
	class="flex items-start gap-3 rounded-md px-[18px] py-4 text-mk-ui text-fg ring-1 ring-inset {t.box} {className}"
	{...rest}
>
	<Icon name={t.icon} size={20} class="mt-px {t.color}" />
	<div class="min-w-0">{@render children()}</div>
</div>
