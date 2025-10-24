<script lang="ts">
	import type { Snippet } from 'svelte';

	const {
		src,
		alt = '',
		height,
		bleed = 'var(--content-pad-x, 1.5rem)',
		class: className = '',
		children
	} = $props<{
		src: string;
		alt?: string;
		height?: number | string; // e.g. 320 or '24rem'
		bleed?: string;
		class?: string;
		children?: Snippet;
	}>();

	const imgHeight = $derived.by(() => {
		if (height == null) return 'auto';
		return typeof height === 'number' ? `${height}` : height;
	});
</script>

<div
	class={`not-prose ${className}`}
	style="
		--bleed: {bleed};
		width: calc(100% + (var(--bleed) * 2));
		margin-left: calc(var(--bleed) * -1);
		margin-right: calc(var(--bleed) * -1);
		position: relative;
	"
>
	<hr class="not-prose my-0 border-grid dark:border-grid" />

	<div class="not-prose flex-col">
		<!-- <figure class="m-0 justify-center border-r border-grid dark:border-grid"> -->
		<div class="not-prose" style=" display: flex; align-items: center; justify-content: center;">
			<div
				class="border-l border-r border-grid dark:border-grid p-9 pb-6"
				style="display: inline-block; position: relative;"
			>
				<div class="corner-diamond corner-diamond-tr simple-noise" aria-hidden="true"></div>
				<div class="corner-diamond corner-diamond-tl simple-noise" aria-hidden="true"></div>
				<div class="corner-diamond corner-diamond-br simple-noise" aria-hidden="true"></div>
				<div class="corner-diamond corner-diamond-bl simple-noise" aria-hidden="true"></div>
				<img
					{src}
					{alt}
					style="max-height: {imgHeight}rem; max-width: 100%; object-fit: contain; display: block;"
				/>
				{#if children}
					<div class="not-prose caption prose text-cream-500">
						{@render children()}
					</div>
				{/if}
			</div>
		</div>
		<!-- </figure> -->
	</div>

	<hr class="my-0 border-grid dark:border-grid" />
</div>
