<!--
	ResponsiveImage: one of the optimised images from scripts/images.mjs (src/lib/images.js), as
	<picture> with AVIF and WebP sources and a JPEG/PNG fallback, at the widths generated.
	Width and height are set from the original, so the layout doesn't shift while it loads.
	Below the fold it's lazy by default; `priority` (the hero) loads it eagerly with high fetch
	priority.
	<ResponsiveImage name="seltza-tap" alt="The Seltza sparkling-water tap installed at a kitchen sink" sizes="(min-width: 1024px) 600px, 100vw" />
-->
<script>
	import { images } from '$lib/images';

	let {
		name,
		alt,
		sizes = '100vw',
		priority = false,
		loading = priority ? 'eager' : 'lazy',
		class: cls = '',
		style = undefined
	} = $props();

	const img = $derived(images[name]);
	const set = (ext) => img.widths.map((w) => `/img/${name}-${w}.${ext} ${w}w`).join(', ');
	const fallback = $derived(`/img/${name}-${img.widths.at(-1)}.${img.fallback}`);
</script>

<picture>
	<source type="image/avif" srcset={set('avif')} {sizes} />
	<source type="image/webp" srcset={set('webp')} {sizes} />
	<img
		src={fallback}
		srcset={set(img.fallback)}
		{sizes}
		{alt}
		width={img.width}
		height={img.height}
		{loading}
		decoding="async"
		fetchpriority={priority ? 'high' : undefined}
		class={cls}
		{style}
	/>
</picture>
