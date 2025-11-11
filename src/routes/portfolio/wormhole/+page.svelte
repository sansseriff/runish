<script lang="ts">
	import { base } from '$app/paths';
	import SectionHeader from '$lib/SectionHeader.svelte';
	const hero = `${base}/portfolio/wormhole/traversable_wormholes.jpeg`;
</script>

<section class="prose max-w-none w-full mx-auto mt-6 lg:pr-4">
	<SectionHeader title="Traversable wormholes – nature" tag="h1" headingAddition="mt-0" />
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
