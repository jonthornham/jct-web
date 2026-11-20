<!--
	Button (buttons.md). An <a> when it has an href (navigation), otherwise a <button>.
	variant  primary | secondary | ghost | onPrimary
	size     mk (48px, default) | sm (40px, header)
	full     width 100%
	Active (pressed): 1px down and the hover colour. Focus: the global 2px focus ring.
-->
<script>
	// Rest props pass through to <a>/<button>. This app doesn't compile to custom elements.
	// svelte-ignore custom_element_props_identifier
	let {
		href = undefined,
		variant = 'primary',
		size = 'mk',
		full = false,
		type = 'button',
		class: className = '',
		children,
		...rest
	} = $props();

	const sizes = {
		mk: 'h-12 px-6 text-base',
		sm: 'h-10 px-[18px] text-mk-ui'
	};
	const variants = {
		primary:
			'bg-primary text-primary-fg hover:bg-primary-hover active:translate-y-px active:bg-primary-hover',
		secondary:
			'bg-surface text-fg ring-1 ring-inset ring-border-strong hover:bg-surface-3 active:translate-y-px active:bg-surface-3',
		ghost: 'px-2 text-fg hover:text-link active:text-fg',
		// Fixed colours: the solid CTA block is primary in both themes (buttons.md).
		onPrimary:
			'bg-[#FFFFFF] text-[#00557F] hover:bg-[#E8F4F8] active:translate-y-px active:bg-[#E8F4F8]'
	};
	const cls = $derived(
		[
			'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-pill font-semibold no-underline transition-[background-color,box-shadow,color] duration-150 hover:no-underline disabled:cursor-not-allowed disabled:opacity-40',
			sizes[size],
			variants[variant],
			full ? 'w-full' : '',
			className
		].join(' ')
	);
</script>

{#if href}
	<a {href} class={cls} {...rest}>{@render children()}</a>
{:else}
	<button {type} class={cls} {...rest}>{@render children()}</button>
{/if}
