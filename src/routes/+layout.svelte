<script lang="ts">
	import '../app.css';
	import Diamond from 'phosphor-svelte/lib/DiamondsFour';
	import X from 'phosphor-svelte/lib/X';
	import GraduationCap from 'phosphor-svelte/lib/GraduationCap';
	import InstagramLogo from 'phosphor-svelte/lib/InstagramLogo';
	// import Bluesky from 'phosphor-svelte/lib/BlueskyLogo';
	import BlueSkyLogo from '$lib/BlueSkyLogo.svelte';
	import GithubLogo from 'phosphor-svelte/lib/GithubLogo';
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import LinkDiamond from '$lib/LinkDiamond.svelte';
	// Sidebar expandable state for portfolio sub-items
	let portfolioOpen = $state(false);
	// Auto-open when on a portfolio page; close when leaving
	$effect(() => {
		const onPortfolio = page.url.pathname.startsWith(`${base}/portfolio`);
		if (onPortfolio) portfolioOpen = true;
		else portfolioOpen = false;
	});

	let { children } = $props();
	let menuOpen = $state(false);
	let previousPath = $state(page.url.pathname);

	function toggleMenu() {
		menuOpen = !menuOpen;
	}

	// Prevent body scrolling when the mobile menu is open
	$effect(() => {
		if (menuOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
	});

	// Auto-close ONLY when the pathname actually changes (prevents immediate self-closing)
	$effect(() => {
		const current = page.url.pathname;
		if (current !== previousPath) {
			previousPath = current;
			if (menuOpen) menuOpen = false;
		}
	});
</script>

<main class="min-h-screen diagonal-pattern noise-texture transition-colors duration-300">
	<div
		class="centered-content max-w-260 mx-auto transition-all"
		class:portfolio-mode={page.url.pathname.startsWith(`${base}/portfolio`)}
	>
		<!-- Mobile header with hamburger -->
		<div
			class="sm:hidden p-4 border-b border-grid backdrop-soft
                    flex items-center justify-between"
		>
			<div class="logo inline-flex">
				<h1 class="font-serif font-medium">Something Runi</h1>
				<h1 class="text-gray-400 dark:text-gray-400">.</h1>
				<h1 class="font-serif font-medium">sh</h1>
			</div>

			<button
				onclick={toggleMenu}
				class="p-2 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer rounded-sm transition-colors"
			>
				<Diamond size={24} weight={'regular'} color={'gray'}></Diamond>
			</button>
		</div>

		<!-- Container with three columns -->
		<div class="main-container flex flex-col lg:flex-row w-full lg:pb-2">
			<!-- Left sidebar -->
			<div
				class="left-sidebar hidden sm:block w-full lg:w-40
						border-grid lg:border-r lg:border-l lg:flex lg:flex-col lg:justify-between lg:items-end
						sticky top-0 lg:h-screen transition-all duration-300"
				class:portfolio-shift={page.url.pathname.startsWith(`${base}/portfolio`)}
			>
				<div class="block lg:h-42 w-full lg:border-b border-grid"></div>
				<div class="block">
					<ul
						class="flex flex-row lg:flex-col
								 justify-around lg:justify-start lg:space-y-4
								 lg:text-right
								 font-serif font-medium opacity-80 hover:opacity-100 transition-opacity lg:p-4 lg:pt-5"
					>
						<li class="relative my-2">
							<a
								href="{base}/"
								class="relative lg:pr-4"
								class:font-bold={page.url.pathname === `${base}/`}
							>
								Home
								<LinkDiamond {page} path={`${base}/`}></LinkDiamond></a
							>
						</li>
						<li class="relative my-2">
							<a
								href="{base}/about"
								class="relative lg:pr-4"
								class:font-bold={page.url.pathname === `${base}/about`}
							>
								About
								<LinkDiamond {page} path={`${base}/about`}></LinkDiamond>
							</a>
						</li>
						<li class="relative my-2">
							<a
								href="{base}/portfolio"
								onclick={() => (portfolioOpen = !portfolioOpen)}
								class="relative lg:pr-4"
								class:font-bold={page.url.pathname.startsWith(`${base}/portfolio`)}
							>
								<span class="inline-flex items-center gap-1">Portfolio</span>
								<LinkDiamond {page} path={`${base}/portfolio`}></LinkDiamond>
							</a>
							{#if portfolioOpen}
								<ul class="mt-2 space-y-2 text-sm font-normal opacity-70 dark:text-gray-300">
									<li>
										<a
											href="{base}/portfolio/traversable-wormholes"
											class="hover:opacity-100 transition-opacity"
											class:font-bold={page.url.pathname ===
												`${base}/portfolio/traversable-wormholes`}>wormhole</a
										>
									</li>
									<li>
										<a
											href="{base}/portfolio/compass"
											class="hover:opacity-100 transition-opacity"
											class:font-bold={page.url.pathname === `${base}/portfolio/compass`}>compass</a
										>
									</li>
									<li>
										<a
											href="{base}/portfolio/feathered-peacoq"
											class="hover:opacity-100 transition-opacity"
											class:font-bold={page.url.pathname === `${base}/portfolio/feathered-peacoq`}
											>peacoq</a
										>
									</li>
								</ul>
							{/if}
						</li>
						<li class="relative my-2">
							<a
								href="{base}/blog"
								class="relative lg:pr-4"
								class:font-bold={page.url.pathname === `${base}/blog`}
							>
								Blog
								<LinkDiamond {page} path={`${base}/blog`}></LinkDiamond>
							</a>
						</li>
					</ul>
				</div>

				<div
					class="hidden lg:flex lg:flex-col lg:items-end lg:space-y-4 lg:mt-auto opacity-60 hover:opacity-100 transition-opacity lg:mr-5 lg:mb-5"
				>
					<a href="https://bsky.app/profile/sansseriff.bsky.social">
						<BlueSkyLogo cls="text-current hover:text-accent-blue transition-colors"></BlueSkyLogo>
					</a>
					<a href="https://www.instagram.com/andstermueller/" class="cursor-pointer">
						<InstagramLogo
							size={24}
							weight={'regular'}
							class="text-current hover:text-accent-blue transition-colors"
						></InstagramLogo>
					</a>
					<a
						href="https://scholar.google.com/citations?user=FRQbz4sAAAAJ&hl=en"
						class="cursor-pointer"
					>
						<GraduationCap
							size={24}
							weight={'regular'}
							class="text-current hover:text-accent-blue transition-colors"
						></GraduationCap>
					</a>

					<a href="https://github.com/sansseriff">
						<GithubLogo
							size={24}
							weight={'regular'}
							class="text-current hover:text-accent-blue transition-colors"
						></GithubLogo>
					</a>
				</div>
			</div>

			<!-- Main content column - Slot for page content -->
			<div
				class="main-content main-content-with-noise lg:w-full lg:mt-0 sm:flex m:flex transition-all bg-cream-50 dark:bg-[hsl(218,_13%,_8%)]"
			>
				{@render children()}
			</div>
			<div
				class="right-sidebar hidden sm:block w-full lg:w-45
						border-grid lg:border-r lg:border-l lg:flex lg:flex-col lg:justify-between lg:items-end
						sticky top-0 lg:h-screen transition-all duration-300"
			></div>
		</div>

		<!-- Mobile bottom modal menu -->
		{#if menuOpen}
			<!-- Overlay -->
			<div
				class="lg:hidden fixed inset-0 z-40 backdrop-blur-sm bg-black/20"
				role="button"
				tabindex="0"
				onclick={toggleMenu}
				onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleMenu()}
				aria-label="Close menu overlay"
			></div>
			<!-- Panel (explicit inline style to guarantee fixed positioning even if a parent gains transform) -->
			<div
				class="lg:hidden bottom-0 left-0 right-0 z-50 backdrop-soft shadow-soft border-t border-grid transition-transform duration-300 ease-in-out noise-texture"
				class:translate-y-0={menuOpen}
				class:translate-y-full={!menuOpen}
				style="position:fixed"
			>
				<div class="flex justify-between items-center p-4 border-b border-grid">
					<h2 class="font-serif font-bold">Menu</h2>
					<button
						onclick={toggleMenu}
						class="p-2 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer rounded-sm transition-colors"
					>
						<X size={24} weight={'regular'}></X>
					</button>
				</div>
				<div class="p-4">
					<ul class="space-y-4 font-serif font-medium">
						<li class="py-2 border-b border-grid">
							<a
								href="{base}/"
								onclick={() => (menuOpen = false)}
								class:font-bold={page.url.pathname === `${base}/`}
							>
								Home
							</a>
						</li>
						<li class="py-2 border-b border-grid">
							<a
								href="{base}/about"
								onclick={() => (menuOpen = false)}
								class:font-bold={page.url.pathname === `${base}/about`}
							>
								About
							</a>
						</li>
						<li class="py-2 border-b border-grid">
							<a
								href="{base}/portfolio"
								onclick={() => (menuOpen = false)}
								class:font-bold={page.url.pathname === `${base}/portfolio`}
							>
								Portfolio
							</a>
						</li>
						<li class="py-2 border-b border-grid">
							<a
								href="{base}/blog"
								onclick={() => (menuOpen = false)}
								class:font-bold={page.url.pathname === `${base}/blog`}
							>
								Blog
							</a>
						</li>
					</ul>
				</div>
			</div>
		{/if}
	</div>
</main>

<!-- <style>
    /* Add this to ensure the transition works properly */
    .translate-y-full {
        transform: translateY(100%);
    }
    .translate-y-0 {
        transform: translateY(0);
    }

    /* Make sure the menu transitions smoothly */
    .transform {
        will-change: transform;
    }
</style> -->

<style>
	:global(html),
	:global(body) {
		scrollbar-gutter: stable both-edges;
	}
	:root {
		--portfolio-shift: 10rem;
	}
	/* Sidebar shift now uses negative margin to reclaim layout space (no transform gap) */
	@media (min-width: 1024px) {
		.left-sidebar.portfolio-shift {
			margin-left: calc(-1 * var(--portfolio-shift));
		}
		/* Fixed widths: normal pages use 56rem, portfolio uses 85rem */
		.main-content {
			width: 56rem;
			max-width: 56rem;
			/* custom easing: slow start, accelerate, gentle end */
			transition:
				width 650ms cubic-bezier(0.55, 0.06, 0.25, 0.95),
				max-width 650ms cubic-bezier(0.55, 0.06, 0.25, 0.95);
		}
		.portfolio-mode .main-content {
			width: 85rem;
			max-width: 85rem;
		}
		/* Keep centered container controlling total span */
		.centered-content {
			display: flex;
		}
		.main-container {
			width: 100%;
			justify-content: flex-start;
		}
		.main-content {
			margin-left: 0;
		}
	}
	/* Ensure media inside main-content never overflow */
	:global(.main-content :is(img, video, canvas, figure)) {
		max-width: 100%;
		height: auto;
	}

	/* Noise texture for main-content */
	.main-content-with-noise::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-image: url('/images/noise.0e24d0e5.png');
		background-size: 180px;
		background-repeat: repeat;
		opacity: 0.035;
		pointer-events: none;
		z-index: 0;
	}

	@media (prefers-color-scheme: dark) {
		.main-content-with-noise::before {
			opacity: 0.012;
		}
	}

	/* Ensure content appears above noise */
	.main-content > :global(*) {
		position: relative;
		z-index: 1;
	}
</style>
