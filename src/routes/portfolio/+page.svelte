<script lang="ts">
	// Filter logic
	type Flag = 'software' | 'quantum' | 'visual';
	interface Media {
		path: string; // path to media file (under /static)
		startOffset?: number; // optional start offset in seconds (for videos only)
	}
	interface Card {
		title: string;
		slug: string; // future detail page
		flags: Flag[];
		media: Media; // background image
		video?: Media; // optional video for hover
		blurhash?: string; // optional blurhash string for placeholder
		description: string;
		textColorOverride?: string; // optional text color override for cards with white backgrounds
		iconFlags?: Record<Flag, string>; // optional mapping to icon asset
	}

	import { base } from '$app/paths';
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
			title: 'WORMHOLE',
			slug: 'wormhole',
			flags: ['quantum', 'software', 'visual'],
			media: {
				path: `${base}/portfolio/wormhole/wormhole_hero.webp`
			},
			video: {
				path: `${base}/portfolio/wormhole/wormhole_hero.webm`
			},
			blurhash: blurhashes.wormhole,
			description: 'Cover image for Nature issue 612, and accompanying press-release visualizations'
		},
		{
			title: 'SCIENTIFIC VISUALIZATION',
			slug: 'scienceviz',
			flags: ['quantum', 'visual'],
			media: {
				path: `${base}/portfolio/scienceviz/peacoq_hero.jpg`
			},
			video: {
				path: `${base}/portfolio/scienceviz/peacoq_hero.webm`,
				startOffset: 0.5
			},
			blurhash: blurhashes.scienceviz,
			description: 'Scientific Visualization using 3D graphics and animation'
		},
		{
			title: 'INVARIANT',
			slug: 'invariant',
			flags: ['visual'],
			media: {
				path: `${base}/portfolio/invariant/invariant_hero.webp`
			},
			video: {
				path: `${base}/portfolio/invariant/invariant_hero.webm`,
				startOffset: 0.5
			},
			blurhash: blurhashes.invariant,
			description: 'My 3rd aerial short film featuring UCSD views and students'
		},
		{
			title: 'GAMES WE PLAY',
			slug: 'gwp',
			flags: ['visual'],
			media: {
				path: `${base}/portfolio/gwp/gwp_hero.webp`
			},
			video: {
				path: `${base}/portfolio/gwp/gwp_hero.webm`,
				startOffset: 0.5
			},
			blurhash: blurhashes.gwp,
			description: 'What if college breakup arguments involved lightsabers?'
		},
		{
			title: 'THE PLACES WE HAVE BEEN',
			slug: 'tpwhb',
			flags: ['visual'],
			media: {
				path: `${base}/portfolio/tpwhb/tpwhb_hero.webp`
			},
			video: {
				path: `${base}/portfolio/tpwhb/tpwhb_hero.webm`,
				startOffset: 0.5
			},
			blurhash: blurhashes.tpwhb,
			description: 'My first aerial short film that garnered widespread attention around campus'
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

	// Video loading state - track which card indices should load their videos
	let cardsToLoad = $state<Set<number>>(new Set());
	// Initialize cardElements with the correct length filled with nulls
	let cardElements: (HTMLElement | null)[] = $state(new Array(cards.length).fill(null));

	// Intersection observer to detect visible cards
	$effect(() => {
		if (typeof window === 'undefined') return;

		const observer = new IntersectionObserver(
			(entries) => {
				// Collect all visible card indices
				const visibleIndices: number[] = [];

				entries.forEach((entry) => {
					const index = parseInt(entry.target.getAttribute('data-card-index') || '-1');
					if (index >= 0 && entry.isIntersecting) {
						visibleIndices.push(index);
					}
				});

				// Sort by priority (lower index = higher priority) and add to load queue
				visibleIndices.sort((a, b) => a - b);
				visibleIndices.forEach((index) => {
					cardsToLoad.add(index);
				});

				// Trigger reactive update
				cardsToLoad = new Set(cardsToLoad);
			},
			{
				rootMargin: '50px', // Start loading slightly before the card enters viewport
				threshold: 0.1
			}
		);

		// Observe all card elements
		cardElements.forEach((el) => {
			if (el) observer.observe(el);
		});

		return () => {
			observer.disconnect();
		};
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
			{#each cards as c, i}
				{#if shown(c)}
					<PortfolioCard
						card={c}
						cardIndex={i}
						shouldLoadVideo={cardsToLoad.has(i)}
						bind:cardElement={cardElements[i]}
					/>
				{/if}
			{/each}
		</div>
	</div>
</PageWrapper>
