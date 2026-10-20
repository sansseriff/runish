<script lang="ts">
	import { tick } from 'svelte';
	import X from 'phosphor-svelte/lib/X';
	import CaretLeft from 'phosphor-svelte/lib/CaretLeft';
	import CaretRight from 'phosphor-svelte/lib/CaretRight';
	import ThemedImage from '$lib/ThemedImage.svelte';

	/** Full-screen image viewer. `index` is the open image, or null when closed.
	 * Esc or a click on the backdrop closes it; arrow keys step through `images`. */
	interface Img {
		src: string;
		srcDark?: string;
		alt: string;
		caption?: string;
	}

	let { images, index = $bindable(null) }: { images: Img[]; index?: number | null } = $props();

	const current = $derived(index === null ? null : images[index]);
	let closeBtn: HTMLButtonElement | undefined = $state();
	let opener: Element | null = null;

	$effect(() => {
		if (index === null) return;
		opener = document.activeElement;
		const prev = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		tick().then(() => closeBtn?.focus());
		return () => {
			document.body.style.overflow = prev;
			(opener as HTMLElement | null)?.focus?.();
		};
	});

	// Mount on <body> so the overlay escapes the main column's stacking context
	// (its children sit at z-index 1, which would let the footer paint on top).
	function portal(node: HTMLElement) {
		document.body.appendChild(node);
		return { destroy: () => node.remove() };
	}

	function close() {
		index = null;
	}
	function step(d: number) {
		if (index === null) return;
		index = (index + d + images.length) % images.length;
	}
	function onKey(e: KeyboardEvent) {
		if (index === null) return;
		if (e.key === 'Escape') close();
		else if (e.key === 'ArrowRight') step(1);
		else if (e.key === 'ArrowLeft') step(-1);
	}
</script>

<svelte:window onkeydown={onKey} />

{#if current}
	<div
		class="lb"
		use:portal
		role="dialog"
		aria-modal="true"
		aria-label={current.alt}
		tabindex="-1"
		onclick={(e) => e.target === e.currentTarget && close()}
		onkeydown={() => {}}
	>
		<button class="lb-btn lb-close" bind:this={closeBtn} onclick={close} aria-label="Close">
			<X size={20} />
		</button>
		{#if images.length > 1}
			<button class="lb-btn lb-prev" onclick={() => step(-1)} aria-label="Previous image">
				<CaretLeft size={22} />
			</button>
			<button class="lb-btn lb-next" onclick={() => step(1)} aria-label="Next image">
				<CaretRight size={22} />
			</button>
		{/if}
		<figure class="lb-figure">
			<ThemedImage
				src={current.src}
				srcDark={current.srcDark}
				alt={current.alt}
				class="lb-img"
				loading="eager"
			/>
			<figcaption>
				{#if current.caption}<span>{current.caption}</span>{/if}
				{#if images.length > 1}<span class="lb-count">{(index ?? 0) + 1} / {images.length}</span
					>{/if}
			</figcaption>
		</figure>
	</div>
{/if}

<style>
	.lb {
		position: fixed;
		inset: 0;
		z-index: 100;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 56px 72px 32px;
		background: rgba(10, 10, 12, 0.88);
		backdrop-filter: blur(4px);
		cursor: zoom-out;
	}
	.lb-figure {
		margin: 0;
		max-width: 100%;
		max-height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
		cursor: default;
	}
	.lb-figure :global(.lb-img) {
		max-width: 100%;
		max-height: calc(100vh - 190px);
		width: auto;
		height: auto;
		object-fit: contain;
		margin: 0;
		border-radius: 2px;
		box-shadow: 0 8px 40px rgba(0, 0, 0, 0.5);
	}
	figcaption {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		max-width: 80ch;
		font-family: var(--font-sans-rs);
		font-size: 13px;
		line-height: 1.5;
		color: #cacace;
		text-align: center;
	}
	.lb-count {
		font-family: var(--font-mono-rs);
		font-size: 11px;
		color: #8a8a90;
		white-space: nowrap;
	}
	.lb-btn {
		position: absolute;
		display: grid;
		place-items: center;
		width: 40px;
		height: 40px;
		border: 1px solid rgba(255, 255, 255, 0.18);
		border-radius: 2px;
		background: rgba(20, 20, 23, 0.6);
		color: #ededf0;
		cursor: pointer;
	}
	.lb-btn:hover {
		background: rgba(40, 40, 46, 0.9);
	}
	.lb-close {
		top: 12px;
		right: 12px;
	}
	.lb-prev {
		left: 16px;
		top: 50%;
		transform: translateY(-50%);
	}
	.lb-next {
		right: 16px;
		top: 50%;
		transform: translateY(-50%);
	}
	@media (max-width: 640px) {
		.lb {
			padding: 56px 12px 24px;
		}
		.lb-prev,
		.lb-next {
			top: auto;
			bottom: 12px;
			transform: none;
		}
	}
</style>
