<!--
	Footer (footer.md). 1440: brand block left, links right; © left, Privacy · Terms right.
	390: everything stacks; the links wrap to two lines (4 + 2).
	The contact email under the tagline is the optional footer line (HANDOFF "Still open" 2).
-->
<script>
	import { labels } from '$lib/config/labels';
	import { site, footerNav, legalNav } from '$lib/config/site';
	import Wordmark from '$components/brand/Wordmark.svelte';
	import MissingLink from '$components/placeholder/MissingLink.svelte';
</script>

<footer class="border-t border-subtle bg-canvas">
	<div class="mx-auto max-w-mk-content px-mk-gutter pb-8 pt-12">
		<div class="flex flex-wrap justify-between gap-x-16 gap-y-8">
			<div class="flex max-w-[320px] flex-col gap-3">
				<a
					href="/"
					aria-label={labels.nav.homeAria}
					class="self-start rounded text-fg no-underline"
				>
					<Wordmark />
				</a>
				<p class="m-0 text-mk-ui text-fg-muted">{site.tagline}</p>
				<a
					href="mailto:{labels.contact.email}"
					class="self-start rounded text-mk-ui text-fg-muted no-underline hover:text-primary active:text-primary"
					>{labels.contact.email}</a
				>
			</div>
			<nav
				aria-label={labels.nav.footer}
				class="flex flex-wrap content-start gap-x-7 gap-y-3 text-mk-ui"
			>
				{#each footerNav as l (l.label)}
					<!-- LinkedIn: a placeholder until Jon sends the URL (MissingLink; never href="#"). -->
					<MissingLink
						href={l.href}
						external={l.external}
						class="rounded text-fg-muted no-underline hover:text-primary active:text-primary"
						>{l.label}</MissingLink
					>
				{/each}
			</nav>
		</div>
		<div
			class="mt-10 flex flex-wrap justify-between gap-3 border-t border-subtle pt-5 text-[14px] text-fg-subtle"
		>
			<span>{labels.footer.copyright}</span>
			<span class="flex gap-5">
				{#each legalNav as l (l.href)}
					<a href={l.href} class="rounded text-inherit no-underline hover:text-primary">{l.label}</a
					>
				{/each}
			</span>
		</div>
	</div>
</footer>
