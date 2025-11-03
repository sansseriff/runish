<script lang="ts">
	// Filter logic
	type Flag = 'software' | 'quantum' | 'visual';
	interface Card {
		title: string;
		slug: string; // future detail page
		flags: Flag[];
		media: string; // background image or video path (under /static)
		mediaType?: 'image' | 'video';
		video?: string; // optional video path for hover
		blurhash?: string; // optional blurhash string for placeholder
		description: string;
		textColorOverride?: string; // optional text color override for cards with white backgrounds
		iconFlags?: Record<Flag, string>; // optional mapping to icon asset
	}

	import { base } from '$app/paths';
	import { onMount } from 'svelte';
	import SectionHeader from '$lib/SectionHeader.svelte';
	import PageWrapper from '$lib/PageWrapper.svelte';
	import PortfolioCard from '$lib/PortfolioCard.svelte';
	import { blurhashes } from '$lib/blurhashes';
	const iconMap: Record<Flag, string> = {
		software: `${base}/icons/software_icon.svg`,
		quantum: `${base}/icons/quantum_icon.svg`,
		visual: `${base}/icons/visual_icon.svg`
	};

	const cards: Card[] = [
		{
			title: 'Traversable wormholes – nature',
			slug: 'traversable-wormholes',
			flags: ['quantum', 'software', 'visual'],
			media: `${base}/images/traversable_wormholes.jpeg`,
			blurhash: blurhashes.traversable_wormholes,
			description:
				'Interactive figures and tooling exploring negative energy shortcuts in spacetime via quantum information thought experiments.'
		},
		{
			title: 'COMPASS – a precursor to Lunaframe',
			slug: 'compass',
			flags: ['software', 'visual'],
			media: `${base}/images/feathered_peacoq.png`,
			video: `${base}/videos/feathered_peacoq.mp4`,
			blurhash: blurhashes.feathered_peacoq,
			description:
				'A design language & rendering pipeline for procedural scientific visuals later evolved into Lunaframe.'
		},
		{
			title: 'Feathered PEACOQ',
			slug: 'feathered-peacoq',
			flags: ['quantum', 'visual'],
			media: `${base}/images/feathered_peacoq.png`,
			video: `${base}/videos/feathered_peacoq.mp4`,
			blurhash: blurhashes.feathered_peacoq,
			description:
				'High‑rate single photon detection visualization – pattern recognition tricks for superconducting detector signals.'
		}
	];

	let active: Set<Flag> = $state(new Set());
	function toggle(flag: Flag) {
		if (active.has(flag)) active.delete(flag);
		else active.add(flag);
		// trigger update
		active = new Set(active);
	}

	function shown(card: Card) {
		if (active.size === 0) return true;
		return card.flags.some((f) => active.has(f));
	}

	// Preload videos on mount
	onMount(() => {
		const videoUrls = cards.filter((c) => c.video).map((c) => c.video!);
		videoUrls.forEach((url) => {
			const video = document.createElement('video');
			video.src = url;
			video.preload = 'auto';
			video.muted = true;
			video.playsInline = true;
		});
	});
</script>

<PageWrapper>
	<div class="space-y-6">
		<SectionHeader
			title="Built with code, built with colors"
			headingClass="font-serif font-medium text-lg lg:text-xl lg:mb-0 lg:mt-[1.7em] dark:text-gray-400"
		>
			<p class="font-sans font-medium text-sm dark:text-gray-400 max-w-prose mt-3">
				Call me a computational artist, or an artistic scientist and engineer. My projects span the
				space of design, computation, and aesthetics.
			</p>
		</SectionHeader>

		<!-- Subtle divider -->
		<!-- <div class="border-t border-grid opacity-50 mx-6 lg:mx-8"></div> -->

		<div class="px-4 py-4 lg:px-6">
			<div class="text-xs font-serif font-medium flex items-center gap-2 flex-wrap">
				<span class="opacity-70">Filter by flag:</span>
				{#each ['software', 'quantum', 'visual'] as flag}
					<button
						class="px-2 py-1 rounded-sm transition-colors duration-200 focus-visible:outline-none focus-visible:ring ring-offset-1 ring-gray-400 dark:ring-gray-600
          {active.has(flag as Flag)
							? 'bg-gray-900 text-gray-50 dark:bg-gray-100 dark:text-gray-900 '
							: 'border-grid hover:border-gray-500'}"
						onclick={() => toggle(flag as Flag)}>◇ {flag}</button
					>
				{/each}
				{#if active.size > 0}
					<button
						class="ml-2 text-[10px] tracking-wide uppercase underline opacity-70 hover:opacity-100"
						onclick={() => (active = new Set())}>reset</button
					>
				{/if}
			</div>
		</div>

		<div class="m-7 my-0 space-y-6 pb-12 px-2 md:px-0">
			{#each cards as c}
				{#if shown(c)}
					<PortfolioCard card={c} />
				{/if}
			{/each}
		</div>
	</div>
</PageWrapper>
