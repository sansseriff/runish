<script>
	import Diamond from 'phosphor-svelte/lib/DiamondsFour';
	import X from 'phosphor-svelte/lib/X';

	let menuOpen = false;

	function toggleMenu() {
		menuOpen = !menuOpen;
	}
</script>

<main
	class="min-h-screen h-screen
             bg-gray-50"
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
			class="main-container flex-1 h-screen
                      flex flex-col lg:flex-row"
		>
			<!-- Left sidebar -->
			<div
				class="left-sidebar hidden sm:block w-full lg:w-50 p-4 lg:h-full
                        lg:border-r border-gray-300"
			>
				<div class="">
					<ul
						class="flex flex-row lg:flex-col
                             justify-around lg:justify-start lg:space-y-4
							 lg:text-right lg:pr-4
							 font-serif font-medium"
					>
						<li>Home</li>
						<li>About</li>
						<li>Blog</li>
						<li>Contact</li>
					</ul>
				</div>
			</div>

			<!-- Main content column -->
			<div
				class="main-content w-full lg:w-200 lg:h-20
                        border-y lg:border-t-0 border-gray-300"
			>
				<div class="prose max-w-none mx-auto p-4">
					<h1 class="font-serif font-medium">Hi, I'm Andrew</h1>
					<p class="font-serif font-medium">
						Hello, I'm a postdoctoral scholar studying applied physics. I really like well designed
						explanations and visuals
					</p>
				</div>
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
                  bg-white rounded-t-xl shadow-lg
                  transition-transform duration-300 ease-in-out"
			class:translate-y-0={menuOpen}
			class:translate-y-full={!menuOpen}
		>
			<div
				class="flex justify-between items-center p-4
                        border-b"
			>
				<h2
					class="text-lg
                         font-bold"
				>
					Menu
				</h2>
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
				<ul class="space-y-4">
					<li class="py-2 border-b">Home</li>
					<li class="py-2 border-b">About</li>
					<li class="py-2 border-b">Blog</li>
					<li class="py-2">Contact</li>
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
