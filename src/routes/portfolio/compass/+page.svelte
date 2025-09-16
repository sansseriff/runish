<script lang="ts">
	import { base } from '$app/paths';
	import SectionHeader from '$lib/SectionHeader.svelte';
	const hero = `${base}/videos/feathered_peacoq.mp4`;
</script>

<section class="prose max-w-none w-full mx-auto mt-6 lg:pr-4">
	<SectionHeader title="COMPASS – a precursor to Lunaframe" tag="h1" />
	<div class="p-6 lg:p-8 font-serif text-sm leading-relaxed space-y-6 dark:text-gray-300">
		<video src={hero} autoplay muted loop playsinline class="w-full object-cover"></video>
		<p>
			A prototyping environment for composable scientific visuals—establishing design primitives
			later formalized in Lunaframe. Focus areas include temporal layering, semantic color systems,
			and resolution‑independent geometry.
		</p>
	</div>
</section>
