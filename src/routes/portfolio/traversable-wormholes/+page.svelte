<script lang="ts">
	import { base } from '$app/paths';
	const hero = `${base}/images/traversable_wormholes.png`;
</script>

<section class="prose max-w-none w-full mx-auto mt-6 lg:pr-4">
	<div class="border-y lg:border-t-0 border-gray-300 dark:border-gray-700 p-6 relative">
		<h1 class="font-serif font-medium lg:h-4">Traversable wormholes – nature</h1>
		<div
			class="absolute size-2 z-10 rounded-[1px] rotate-45 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 left-[-4.5px] bottom-[-4.5px]"
		></div>
	</div>
	<div class="p-6 lg:p-8 font-serif text-sm leading-relaxed space-y-6 dark:text-gray-300">
		<img
			src={hero}
			alt="Traversable wormholes visualization"
			class="w-full object-cover"
			loading="lazy"
		/>
		<p>
			Explorations in representing exotic spacetime shortcuts using procedural rendering and
			interactive parameter spaces. This project investigates how negative energy conditions
			manifest visually in quantum information analogs.
		</p>
	</div>
</section>
