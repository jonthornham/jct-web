<script>
	import { pages } from '$lib/content/pages';
	import LegalPage from '$components/layout/LegalPage.svelte';
	import Text from '$lib/content/legal/privacy.md';
</script>

<LegalPage page={pages.privacy}>
	<Text />
</LegalPage>
