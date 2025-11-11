<script lang="ts">
	import { base } from '$app/paths';
	import SectionHeader from '$lib/SectionHeader.svelte';
	const hero = `${base}/portfolio/science-viz/peacoq_hero.webm`;
</script>

<section class="prose max-w-none w-full mx-auto mt-6 lg:pr-4">
	<SectionHeader title="Feathered PEACOQ" tag="h1" />
	<div class="p-6 lg:p-8 font-serif text-sm leading-relaxed space-y-6 dark:text-gray-300">
		<video src={hero} autoplay muted loop playsinline class="w-full object-cover"></video>
		<p>
			Visualization experiments for high‑rate superconducting single photon detector readout.
			Emphasis on conveying temporal clustering, pattern recognition, and noise discrimination.
		</p>
	</div>
</section>
