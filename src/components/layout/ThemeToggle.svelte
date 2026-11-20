<!--
	ThemeToggle (header-nav.md › Theme toggle).
	compact (header, ≥900px): System · Light · Dark, 28×28 icon buttons with aria-labels.
	menu (mobile menu's Theme row): Light | Dark text buttons, 38px tall. The resolved theme shows
	as pressed, so a visitor on "system" sees which one is in effect.
	Saves to localStorage['jct-theme'] through $lib/stores/theme and applies at once; src/app.html
	sets the same theme before first paint, so there's no flash.
-->
<script>
	import { theme, themeChoice, setThemeChoice } from '$lib/stores/theme';
	import { labels } from '$lib/config/labels';

	let { variant = 'compact' } = $props();

	const compact = [
		{ value: 'system', label: labels.theme.system, icon: 'system' },
		{ value: 'light', label: labels.theme.light, icon: 'light' },
		{ value: 'dark', label: labels.theme.dark, icon: 'dark' }
	];
	const menu = [
		{ value: 'light', text: labels.theme.lightShort },
		{ value: 'dark', text: labels.theme.darkShort }
	];
	const options = $derived(variant === 'menu' ? menu : compact);
	const pressed = (v) => (variant === 'menu' ? $theme === v : $themeChoice === v);
</script>

<div
	class="inline-flex gap-0.5 rounded-pill bg-surface-2 p-0.5 ring-1 ring-inset ring-border"
	role="group"
	aria-label={labels.nav.theme}
>
	{#each options as o (o.value)}
		<button
			type="button"
			aria-pressed={pressed(o.value)}
			aria-label={o.label}
			onclick={() => setThemeChoice(o.value)}
			class="grid place-items-center rounded-pill transition-colors duration-150 {variant === 'menu'
				? 'h-[38px] px-4 text-mk-ui font-medium'
				: 'h-7 w-7'} {pressed(o.value)
				? 'bg-surface text-fg shadow-seg'
				: 'text-fg-muted hover:text-fg'}"
		>
			{#if o.text}
				{o.text}
			{:else}
				<svg
					width="15"
					height="15"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.4"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					{#if o.icon === 'system'}
						<rect x="3" y="4" width="18" height="12" rx="2" />
						<path d="M8 20h8M12 16v4" />
					{:else if o.icon === 'light'}
						<circle cx="12" cy="12" r="4" />
						<path
							d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
						/>
					{:else}
						<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
					{/if}
				</svg>
			{/if}
		</button>
	{/each}
</div>
