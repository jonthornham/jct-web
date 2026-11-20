<!--
	Free Consult (screens/free-consult-*; copy-map › Free Consult): 5fr / 7fr. Left: page header,
	lead and Jon's contact line; right: the Calendly booking block (or the intake form when Calendly can't show), top-aligned
	with the eyebrow. Under 1000px: one column, the block under the copy.
-->
<script>
	import { freeConsult as f } from '$lib/content/free-consult';
	import { labels } from '$lib/config/labels';
	import { site } from '$lib/config/site';
	import Section from '$components/layout/Section.svelte';
	import PageHeader from '$components/layout/PageHeader.svelte';
	import ResponsiveImage from '$components/ui/ResponsiveImage.svelte';
	import Booking from '$components/booking/Booking.svelte';
	import MissingLink from '$components/placeholder/MissingLink.svelte';

	const tel = 'tel:+1' + site.phone.replace(/\D/g, '');
	// Inline links (links.md) with a soft underline, so they don't rely on colour alone.
	const inline = 'inline-link';
</script>

<Section
	rule={false}
	top="pt-[clamp(40px,6vw,88px)]"
	class="grid items-start gap-[clamp(32px,5vw,72px)] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"
>
	<PageHeader eyebrow={f.eyebrow} h1={f.h1} lead={f.lead}>
		<!-- 390: photo above the name; ≥760: side by side (screens/free-consult-*). -->
		<div class="mt-5 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
			<!-- Empty alt: his name is printed beside it (assets/ASSETS.md). -->
			<span class="block h-14 w-14 shrink-0 overflow-hidden rounded-full">
				<ResponsiveImage
					name="jon-thornham"
					alt=""
					sizes="56px"
					class="h-full w-full object-cover"
				/>
			</span>
			<div class="flex flex-col gap-1 text-mk-ui">
				<span class="font-semibold text-fg">{f.contact.name}</span>
				<span class="text-fg-muted">
					{f.contact.place} ·
					<a href={tel} class="font-mono tabular-nums {inline}">{site.phone}</a>
					·
					<MissingLink href={site.linkedin} external class={inline}
						>{labels.cta.linkedin}</MissingLink
					>
				</span>
			</div>
		</div>
	</PageHeader>
	<Booking />
</Section>
