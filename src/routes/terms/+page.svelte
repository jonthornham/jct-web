<script>
	import { pages } from '$lib/content/pages';
	import LegalPage from '$components/layout/LegalPage.svelte';
	import Text from '$lib/content/legal/terms.md';
</script>

<LegalPage page={pages.terms}>
	<Text />
</LegalPage>
