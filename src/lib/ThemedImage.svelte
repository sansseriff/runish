<script lang="ts">
	/** An image with an optional dark-theme variant. The swap is pure CSS on html.dark,
	 * which app.html sets before first paint, so there is no flash on load. */
	let {
		src,
		srcDark,
		alt,
		class: cls = '',
		loading = 'lazy'
	}: {
		src: string;
		srcDark?: string;
		alt: string;
		class?: string;
		loading?: 'lazy' | 'eager';
	} = $props();

	// With two variants, one is always display:none. Lazy images that are not
	// rendered are never fetched, so lazy-loading both downloads only the visible
	// one; it still loads straight away when it is on screen.
	const mode = $derived(srcDark ? 'lazy' : loading);
</script>

<img {src} {alt} loading={mode} class="{cls} themed-light" class:has-dark={!!srcDark} />
{#if srcDark}
	<img src={srcDark} {alt} loading={mode} class="{cls} themed-dark" />
{/if}

<style>
	.themed-dark {
		display: none;
	}
	:global(html.dark) .themed-light.has-dark {
		display: none;
	}
	:global(html.dark) .themed-dark {
		display: block;
	}
</style>
