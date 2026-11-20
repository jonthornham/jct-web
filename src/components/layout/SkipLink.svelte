<!-- The first stop on every page (checklist › Accessibility: skip link to main content). -->
<script>
	import { labels } from '$lib/config/labels';

	// The router handles #main without moving focus, so do it here.
	const skip = (e) => {
		const main = document.getElementById('main');
		if (!main) return;
		e.preventDefault();
		main.focus();
		main.scrollIntoView();
	};
</script>

<a
	href="#main"
	onclick={skip}
	class="sr-only z-[70] rounded-pill bg-primary text-sm font-semibold text-primary-fg no-underline focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:px-4 focus:py-2"
	>{labels.a11y.skip}</a
>
