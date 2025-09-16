<script lang="ts">
	import { base } from '$app/paths';
	const hero = `${base}/videos/feathered_peacoq.mp4`;
</script>

<section class="prose max-w-none w-full mx-auto mt-6 lg:pr-4">
	<div class="border-y lg:border-t-0 border-gray-300 dark:border-gray-700 p-6 relative">
		<h1 class="font-serif font-medium lg:h-4">Feathered PEACOQ</h1>
		<div
			class="absolute size-2 z-10 rounded-[1px] rotate-45 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 left-[-4.5px] bottom-[-4.5px]"
		></div>
	</div>
	<div class="p-6 lg:p-8 font-serif text-sm leading-relaxed space-y-6 dark:text-gray-300">
		<video
			src={hero}
			autoplay
			muted
			loop
			playsinline
			class="w-full border border-gray-300 dark:border-gray-700 object-cover"
		></video>
		<p>
			Visualization experiments for high‑rate superconducting single photon detector readout.
			Emphasis on conveying temporal clustering, pattern recognition, and noise discrimination.
		</p>
	</div>
</section>
