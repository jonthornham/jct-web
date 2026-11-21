<!--
	Calendly booking block (components/calendly-block.md): Calendly's inline widget inside a JCT
	card. Header row "Free Consult" / "15 min"; embed area min-height 660px (700 under 760).
	- Calendly's script loads only here, and only when the block comes near the screen
	  (IntersectionObserver, 400px ahead), so other pages and the first paint stay fast.
	- The skeleton shows until Calendly's `calendly.event_type_viewed` message (or
	  `calendly.profile_page_viewed` for the account page), at most 8s.
	- Theme change: the embed reloads with the other colour set.
	- Not loaded after 8s, or the script failed: `onfail()` and Booking.svelte swaps in the
	  intake form. (No URL and no JavaScript are handled there too.)
-->
<script>
	import { onMount } from 'svelte';
	import { labels } from '$lib/config/labels';
	import { site } from '$lib/config/site';
	import { theme } from '$lib/stores/theme';
	import { calendlyUrl, isCalendlyEvent, loadCalendly } from '$lib/calendly';

	let { onfail = () => {} } = $props();

	const base = site.calendly;
	// Calendly's "calendar is showing" messages: an event page, or the account page (used until
	// Jon sends the 15-minute event link).
	const SHOWN = ['calendly.event_type_viewed', 'calendly.profile_page_viewed'];
	// Skeleton: a 7 × 5 month grid and three time slots.
	const DAYS = [...Array(35).keys()];
	const SLOTS = [0, 1, 2];

	let block = $state();
	let embed = $state();
	let status = $state('waiting'); // waiting | loading | loaded | failed
	let near = $state(false);

	onMount(() => {
		if (!base) {
			status = 'failed';
			onfail();
			return;
		}
		const io = new IntersectionObserver(
			(entries) => {
				if (entries.some((e) => e.isIntersecting)) {
					near = true;
					io.disconnect();
				}
			},
			{ rootMargin: '400px 0px' }
		);
		io.observe(block);
		const onMessage = (e) => {
			if (isCalendlyEvent(e) && SHOWN.includes(e.data.event)) status = 'loaded';
		};
		window.addEventListener('message', onMessage);
		return () => {
			io.disconnect();
			window.removeEventListener('message', onMessage);
		};
	});

	// Load (and reload on theme change) once the block is near the screen.
	$effect(() => {
		if (!near) return;
		const url = calendlyUrl(base, $theme);
		status = 'loading';
		let cancelled = false;
		const timer = setTimeout(() => {
			if (!cancelled && status === 'loading') {
				status = 'failed';
				onfail();
			}
		}, 8000);
		loadCalendly()
			.then((Calendly) => {
				if (cancelled) return;
				embed.replaceChildren();
				Calendly.initInlineWidget({ url, parentElement: embed, resize: false });
			})
			.catch(() => {
				if (!cancelled) {
					status = 'failed';
					onfail();
				}
			});
		return () => {
			cancelled = true;
			clearTimeout(timer);
		};
	});
</script>

<section
	bind:this={block}
	aria-label={labels.booking.aria}
	class="overflow-hidden rounded-card bg-surface ring-1 ring-inset ring-border"
>
	<div class="flex h-14 items-center justify-between border-b px-6">
		<h2 class="m-0 text-[15px] font-semibold text-fg">{labels.booking.title}</h2>
		<span class="font-mono text-[14px] text-fg-muted">{labels.booking.length}</span>
	</div>
	<div class="relative min-h-[700px] p-4 sm:min-h-[660px] sm:p-6">
		{#if status !== 'failed'}
			<!-- Skeleton (aria-hidden, no animation) until Calendly says the calendar is showing. -->
			{#if status !== 'loaded'}
				<div aria-hidden="true" class="absolute inset-4 sm:inset-6">
					<div class="h-3.5 w-2/5 rounded-[6px] bg-surface-3"></div>
					<div class="mt-7 grid gap-7 sm:grid-cols-[3fr_2fr]">
						<div class="grid grid-cols-7 gap-2">
							{#each DAYS as i (i)}
								<span
									class="aspect-square rounded-full {i % 7 === 0 || i % 7 === 6 || i > 31
										? 'bg-surface-2'
										: 'bg-primary-soft ring-1 ring-inset ring-border'}"
								></span>
							{/each}
						</div>
						<div class="flex flex-col gap-2">
							{#each SLOTS as i (i)}
								<span class="h-11 rounded-input ring-1 ring-inset ring-border-strong"></span>
							{/each}
						</div>
					</div>
				</div>
			{/if}
			<div
				bind:this={embed}
				class="relative h-[668px] w-full sm:h-[612px] {status === 'loaded' ? '' : 'opacity-0'}"
			></div>
		{/if}
	</div>
</section>
