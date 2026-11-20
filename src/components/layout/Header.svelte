<!--
	Header (header-nav.md): 64px, sticky, surface with a bottom border.
	≥1280   wordmark + tagline · links · toggle · CTA
	900–1279 tagline hidden
	760–899  wordmark · CTA (full label) · menu button; links and toggle move to the menu
	<760     wordmark · CTA "Free Consult" · menu button
	The mobile menu is a bits-ui Dialog: focus trap, Esc and outside tap close it, body scroll is
	locked, and focus returns to the menu button. It also closes on navigation.
-->
<script>
	import { page } from '$app/state';
	import { afterNavigate } from '$app/navigation';
	import { Dialog } from 'bits-ui';
	import { labels } from '$lib/config/labels';
	import { site, headerNav, CONSULT_HREF } from '$lib/config/site';
	import Wordmark from '$components/brand/Wordmark.svelte';
	import Button from '$components/ui/Button.svelte';
	import ThemeToggle from './ThemeToggle.svelte';

	const path = $derived(page.url.pathname);
	const current = (href) => path === href || path.startsWith(href + '/');

	let menuOpen = $state(false);
	afterNavigate(() => (menuOpen = false));
</script>

<header class="sticky top-0 z-30 border-b border-subtle bg-surface">
	<div class="mx-auto flex h-header max-w-mk-content items-center gap-7 px-mk-gutter">
		<div class="flex items-center">
			<a
				href="/"
				aria-label={labels.nav.homeAria}
				class="flex items-center rounded text-fg no-underline"
			>
				<Wordmark />
			</a>
			<span
				class="ml-3.5 hidden max-w-[190px] border-l border-strong pl-3.5 text-[13px] leading-[1.25] text-fg-muted 2xl:block"
				>{site.tagline}</span
			>
		</div>

		<nav aria-label={labels.nav.main} class="hidden items-center gap-[26px] nav:flex">
			{#each headerNav as l (l.href)}
				<a
					href={l.href}
					aria-current={current(l.href) ? 'page' : undefined}
					class="whitespace-nowrap rounded text-mk-ui no-underline hover:text-fg {current(l.href)
						? 'font-semibold text-fg'
						: 'font-medium text-fg-muted'}">{l.label}</a
				>
			{/each}
		</nav>

		<div class="ml-auto flex items-center gap-1.5 nav:gap-3">
			<div class="hidden nav:block"><ThemeToggle /></div>
			<Button href={CONSULT_HREF} size="sm">
				<span class="sm:hidden">{labels.cta.primaryShort}</span>
				<span class="hidden sm:inline">{labels.cta.primary}</span>
			</Button>

			<Dialog.Root bind:open={menuOpen}>
				<Dialog.Trigger
					class="-mr-2.5 grid h-11 w-11 place-items-center rounded-pill text-fg nav:hidden"
					aria-label={menuOpen ? labels.nav.menuClose : labels.nav.menuOpen}
				>
					<svg
						width="22"
						height="22"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.8"
						stroke-linecap="round"
						aria-hidden="true"
					>
						{#if menuOpen}
							<path d="M6 6l12 12M18 6L6 18" />
						{:else}
							<path d="M4 7h16M4 12h16M4 17h16" />
						{/if}
					</svg>
				</Dialog.Trigger>
				<Dialog.Portal>
					<!-- Transparent: catches a tap outside the sheet, below the bar. -->
					<Dialog.Overlay class="fixed inset-x-0 bottom-0 top-header z-20 nav:hidden" />
					<Dialog.Content
						class="fixed inset-x-0 top-header z-30 flex max-h-[calc(100dvh-64px)] flex-col gap-4 overflow-y-auto border-b border-subtle bg-surface px-mk-gutter pb-5 pt-2 outline-none nav:hidden"
						data-menu-sheet
					>
						<Dialog.Title class="sr-only">{labels.nav.menu}</Dialog.Title>
						<nav aria-label={labels.nav.main} class="flex flex-col">
							{#each headerNav as l (l.href)}
								<a
									href={l.href}
									aria-current={current(l.href) ? 'page' : undefined}
									class="flex min-h-[52px] items-center justify-between border-b border-subtle text-[17px] text-fg no-underline hover:no-underline {current(
										l.href
									)
										? 'font-semibold'
										: 'font-medium'}"
									>{l.label}<span aria-hidden="true" class="text-fg-subtle">→</span></a
								>
							{/each}
						</nav>
						<div class="flex items-center justify-between">
							<span class="text-mk-ui text-fg-muted">{labels.nav.theme}</span>
							<ThemeToggle variant="menu" />
						</div>
						<Button href={CONSULT_HREF} full>{labels.cta.primary}</Button>
					</Dialog.Content>
				</Dialog.Portal>
			</Dialog.Root>
		</div>
	</div>
</header>
