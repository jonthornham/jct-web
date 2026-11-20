<!--
	Quote (cards.md › Quote panel): quote mark (Geist Mono 48px, accent, aria-hidden), blockquote
	clamp(20px, 16.8px + .6vw, 24px)/1.45 500, attribution with a 44px initials avatar.
	panel   true: its own surface-2 panel (Work · Seltza); false: bare (inside the Home proof panel)
-->
<script>
	import { seltzaQuote as q } from '$lib/content/shared';

	let { panel = true } = $props();
</script>

<figure
	class="m-0 flex flex-col gap-5 {panel
		? 'rounded-media bg-surface-2 p-[clamp(28px,4.5vw,56px)] ring-1 ring-inset ring-border'
		: ''}"
>
	<span aria-hidden="true" class="font-mono text-[48px] font-semibold leading-[.6] text-accent"
		>“</span
	>
	<blockquote
		class="m-0 max-w-[52rem] text-[clamp(20px,16.8px+.6vw,24px)] font-medium leading-[1.45] tracking-[-0.01em] text-fg"
	>
		<p class="m-0">{q.text}</p>
	</blockquote>
	<figcaption class="flex items-center gap-3">
		<span
			aria-hidden="true"
			class="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-surface-3 text-[15px] font-semibold text-fg-muted"
			>{q.initials}</span
		>
		<span class="flex flex-col">
			<span class="text-[15px] font-semibold text-fg">{q.name}</span>
			<span class="text-[14px] text-fg-muted">{q.role}</span>
		</span>
	</figcaption>
</figure>
