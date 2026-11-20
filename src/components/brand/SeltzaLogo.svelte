<!--
	Seltza logo (assets/ASSETS.md › Logos): single-colour PNG, swapped with the theme
	(onlight = fg-muted on light, ondark = fg-muted on dark). Height via `class` (h-[30px] …).
	alt="" when the name is printed beside it (hero float card); "Seltza" otherwise.
-->
<script>
	let { class: className = '', alt = 'Seltza' } = $props();
</script>

<img
	src="/logos/seltza-logo-onlight.png"
	{alt}
	width="202"
	height="60"
	class="w-auto dark:hidden {className}"
/>
<img
	src="/logos/seltza-logo-ondark.png"
	{alt}
	width="202"
	height="60"
	class="hidden w-auto dark:block {className}"
/>
