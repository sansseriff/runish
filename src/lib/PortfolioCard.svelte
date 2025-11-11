<script lang="ts">
	import { base } from '$app/paths';
	import { decode } from 'blurhash';

	type Flag = 'software' | 'quantum' | 'visual';
	interface Media {
		path: string; // path to media file (under /static)
		startOffset?: number; // optional start offset in seconds (for videos only)
	}
	interface Card {
		title: string;
		slug: string;
		flags: Flag[];
		media: Media; // background image
		video?: Media; // optional video for hover
		blurhash?: string; // Optional blurhash string for placeholder
		description: string;
		textColorOverride?: string; // Optional text color override for cards with white backgrounds
		iconFlags?: Record<Flag, string>;
	}

	const iconMap: Record<Flag, string> = {
		software: `${base}/icons/software_icon.svg`,
		quantum: `${base}/icons/quantum_icon.svg`,
		visual: `${base}/icons/visual_icon.svg`
	};

	let { card }: { card: Card } = $props();

	const cardState = $state({
		placeholderLoaded: false,
		fullImageLoaded: false,
		placeholderSrc: null as string | null,
		isHovered: false,
		videoElement: null as HTMLVideoElement | null
	});

	// Helper function to decode blurhash into a data URL
	// Use a larger size for better quality when scaled up
	function decodeBlurhash(hash: string, width = 64, height = 64): string {
		if (typeof window === 'undefined') {
			return '';
		}

		try {
			const pixels = decode(hash, width, height);
			const canvas = document.createElement('canvas');
			canvas.width = width;
			canvas.height = height;
			const ctx = canvas.getContext('2d');
			if (!ctx) return '';

			const imageData = ctx.createImageData(width, height);
			imageData.data.set(pixels);
			ctx.putImageData(imageData, 0, 0);

			return canvas.toDataURL();
		} catch (error) {
			console.error('Error decoding blurhash:', error);
			return '';
		}
	}

	// Load placeholder when component mounts
	$effect(() => {
		if (typeof window !== 'undefined') {
			if (card.blurhash) {
				// Use blurhash if available
				const dataUrl = decodeBlurhash(card.blurhash);
				cardState.placeholderSrc = dataUrl;
				cardState.placeholderLoaded = true;
			} else {
				// Fallback: mark as loaded immediately if no blurhash
				cardState.placeholderLoaded = true;
			}
		} else {
			cardState.placeholderLoaded = true;
		}
	});

	// Control video playback based on hover state
	$effect(() => {
		if (cardState.videoElement) {
			if (cardState.isHovered) {
				cardState.videoElement.play().catch(() => {
					// Ignore play errors (e.g., autoplay restrictions)
				});
			} else {
				cardState.videoElement.pause();
			}
		}
	});
</script>

<a
	href={`${base}/portfolio/${card.slug}`}
	class="block group no-underline"
	onmouseenter={() => (cardState.isHovered = true)}
	onmouseleave={() => (cardState.isHovered = false)}
>
	<div
		class="group relative overflow-hidden rounded-sm transition-all duration-300 focus-within:ring-2 focus-within:ring-mint-500 card w-full border border-grid"
		style:opacity={cardState.placeholderLoaded ? '1' : '0'}
		style:transform={cardState.placeholderLoaded ? 'translateY(0)' : 'translateY(10px)'}
		style:transition="opacity 0.3s ease-out, transform 0.3s ease-out"
	>
		<!-- Blurry placeholder image from blurhash -->
		{#if cardState.placeholderSrc}
			<img
				src={cardState.placeholderSrc}
				alt=""
				class="absolute inset-0 w-full h-full object-cover m-0"
				aria-hidden="true"
				style:margin="0"
			/>
		{/if}

		<!-- Full resolution image -->
		<img
			src={card.media.path}
			alt={card.title}
			class="absolute inset-0 transition-opacity duration-300 m-0"
			style:margin="0"
			style:width="100%"
			style:height="100%"
			style:object-fit="cover"
			style:opacity={cardState.fullImageLoaded
				? cardState.isHovered && card.video
					? '0'
					: '1.0'
				: '0'}
			onload={() => {
				cardState.fullImageLoaded = true;
			}}
		/>

		<!-- Optional hover video overlay -->
		{#if card.video}
			<video
				bind:this={cardState.videoElement}
				src={card.video.path}
				muted
				loop
				playsinline
				class="absolute inset-0 z-10 m-0 pointer-events-none"
				style:margin="0"
				style:width="100%"
				style:height="100%"
				style:object-fit="cover"
				style:opacity={cardState.isHovered ? '1' : '0'}
				style:transition="opacity 0.4s ease-out"
				onloadedmetadata={(e) => {
					if (card.video?.startOffset !== undefined) {
						e.currentTarget.currentTime = card.video.startOffset;
					}
				}}
			></video>
		{/if}

		<!-- Title in upper left corner -->
		<div
			class="absolute z-30 leading-none"
			style:top="2rem"
			style:left="2rem"
			style:color={card.textColorOverride || 'white'}
		>
			<h3
				class="font-sans font-medium text-base md:text-lg flex flex-wrap items-center gap-3 m-0 leading-none"
				style:color={card.textColorOverride || 'white'}
				style:margin="0"
			>
				<span>{card.title}</span>
				<span class="flex gap-2 items-center">
					{#each card.flags as f}
						<img
							src={iconMap[f]}
							alt={f}
							class="size-4 opacity-100 group-hover:opacity-100 transition-opacity"
							loading="lazy"
							style:filter={card.textColorOverride ? 'none' : 'brightness(0) invert(1)'}
						/>
					{/each}
				</span>
			</h3>
		</div>

		<!-- Description in lower left corner, shown on hover -->
		<div
			class="absolute z-30 max-w-[calc(100%-12rem)] transition-opacity duration-300"
			style:bottom="2rem"
			style:left="2rem"
			class:opacity-0={!cardState.isHovered}
			class:opacity-100={cardState.isHovered}
			style:color={card.textColorOverride || 'white'}
		>
			<p
				class="font-sans text-[12px] md:text-sm leading-snug m-0"
				style:color={card.textColorOverride || 'white'}
				style:margin="0"
			>
				{card.description}
			</p>
		</div>
	</div>
</a>

<style>
	.card {
		min-height: 15rem;
		height: 15rem;
	}
	@media (min-width: 1024px) {
		.card {
			min-height: 17rem;
			height: 17rem;
		}
	}
	.no-underline {
		text-decoration: none;
	}
	.no-underline:hover {
		text-decoration: none;
	}
	/* Ensure images and videos have no default margins */
	.card img,
	.card video {
		margin: 0;
		display: block;
	}
</style>
