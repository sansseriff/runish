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

	let { children } = $props();
	let menuOpen = $state(false);

	function toggleMenu() {
		menuOpen = !menuOpen;
	}
</script>

<main
	class="min-h-screen h-screen
             bg-gray-50 overflow-y-auto"
>
	<div class="centered-content max-w-300 mx-auto h-full">
		<!-- Mobile header with hamburger -->
		<div
			class="sm:hidden p-4
                    flex items-center justify-between"
		>
			<div class="logo inline-flex">
				<h1 class="font-serif font-medium">Something Runi</h1>
				<h1 class="text-gray-400">.</h1>
				<h1 class="font-serif font-medium">sh</h1>
			</div>

			<button
				onclick={toggleMenu}
				class="p-2
                          hover:bg-gray-100
                          cursor-pointer"
			>
				<Diamond size={24} weight={'regular'}></Diamond>
			</button>
		</div>

		<!-- Container with three columns -->
		<div
			class="main-container flex-1
                      flex flex-col lg:flex-row"
		>
			<!-- Left sidebar -->
			<div
				class="left-sidebar hidden sm:block w-full lg:w-50 p-4
                        lg:border-r border-gray-300 lg:flex lg:flex-col lg:justify-between lg:items-end
                        sticky top-0 lg:h-screen"
			>
				<div class="lg:mt-48">
					<ul
						class="flex flex-row lg:flex-col
                             justify-around lg:justify-start lg:space-y-4
                             lg:text-right lg:pr-4
                             font-serif font-medium"
					>
						<li>
							<a href="{base}/" class="relative" class:font-bold={page.url.pathname === `${base}/`}>
								Home
								<LinkDiamond {page} path={`${base}/`}></LinkDiamond></a
							>
						</li>
						<li>
							<a
								href="{base}/about"
								class="relative"
								class:font-bold={page.url.pathname === `${base}/about`}
							>
								About
								<LinkDiamond {page} path={`${base}/about`}></LinkDiamond>
							</a>
						</li>
						<li>
							<a
								href="{base}/projects"
								class="relative"
								class:font-bold={page.url.pathname === `${base}/projects`}
							>
								Projects
								<LinkDiamond {page} path={`${base}/projects`}></LinkDiamond>
							</a>
						</li>
						<li>
							<a
								href="{base}/blog"
								class="relative"
								class:font-bold={page.url.pathname === `${base}/blog`}
							>
								Blog
								<LinkDiamond {page} path={`${base}/blog`}></LinkDiamond>
							</a>
						</li>
					</ul>
				</div>

				<div class="hidden lg:flex lg:flex-col lg:items-end lg:space-y-4 lg:mt-auto">
					<a href="https://bsky.app/profile/sansseriff.bsky.social">
						<BlueSkyLogo cls="text-gray-400 hover:text-gray-600"></BlueSkyLogo>
					</a>
					<a href="https://www.instagram.com/andstermueller/" class="cursor-pointer">
						<InstagramLogo size={24} weight={'regular'} class="text-gray-400 hover:text-gray-600"
						></InstagramLogo>
					</a>
					<a
						href="https://scholar.google.com/citations?user=FRQbz4sAAAAJ&hl=en"
						class="cursor-pointer"
					>
						<GraduationCap size={24} weight={'regular'} class="text-gray-400 hover:text-gray-600"
						></GraduationCap>
					</a>

					<a href="https://github.com/sansseriff">
						<GithubLogo size={24} weight={'regular'} class="text-gray-400 hover:text-gray-600"
						></GithubLogo>
					</a>
				</div>
			</div>

			<!-- Main content column - Slot for page content -->
			<div
				class="main-content w-full lg:w-200
                         lg:mt-6 sm:flex m:flex"
			>
				{@render children()}
			</div>
		</div>
	</div>

	<!-- Mobile bottom modal menu -->
	{#if menuOpen}
		<div
			class="lg:hidden fixed inset-0 z-40
                  bg-black/30"
			onclick={toggleMenu}
		></div>
		<div
			class="lg:hidden fixed bottom-0 left-0 right-0 z-50
                  bg-white shadow-lg
                  transition-transform duration-300 ease-in-out"
			class:translate-y-0={menuOpen}
			class:translate-y-full={!menuOpen}
		>
			<div
				class="flex justify-between items-center p-4
                        border-b border-gray-300"
			>
				<h2 class="font-serif font-bold">Menu</h2>
				<button
					onclick={toggleMenu}
					class="p-2
                              hover:bg-gray-100
                              cursor-pointer"
				>
					<X size={24} weight={'regular'}></X>
				</button>
			</div>
			<div class="p-4">
				<ul class="space-y-4 font-serif font-medium">
					<li class="py-2 border-b border-gray-300">
						<a href="{base}/" class:font-bold={page.url.pathname === `${base}/`}> Home </a>
					</li>
					<li class="py-2 border-b border-gray-300">
						<a href="{base}/about" class:font-bold={page.url.pathname === `${base}/about`}>
							About
						</a>
					</li>
					<li class="py-2 border-b border-gray-300">
						<a href="{base}/projects" class:font-bold={page.url.pathname === `${base}/projects`}>
							Projects
						</a>
					</li>
					<li class="py-2">
						<a href="{base}/blog" class:font-bold={page.url.pathname === `${base}/blog`}> Blog </a>
					</li>
				</ul>
			</div>
		</div>
	{/if}
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
