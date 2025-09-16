<script lang="ts">
	import { base } from '$app/paths';

	// import BlogLayout from '$lib/layouts/BlogLayout.svelte';
	const hero = `${base}/images/traversable_wormholes.jpeg`;
	const inline = `${base}/images/profile_picture.jpeg`;
</script>

<article class="prose max-w-none w-full mx-auto mt-6 lg:pr-4 blog-post">
	<div class="border-y lg:border-t-0 border-gray-300 dark:border-gray-700 p-6 relative">
		<h1 class="font-serif font-medium lg:h-4 dark:text-gray-100">
			Designing expressive scientific visuals
		</h1>
		<p class="font-serif font-medium text-sm dark:text-gray-400">2025-09-01 — draft</p>
		<div
			class="absolute size-2 z-10 rounded-[1px] rotate-45 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 left-[-4.5px] bottom-[-4.5px]"
		></div>
	</div>

	<div class="p-6 lg:p-8 font-serif text-[13px] leading-relaxed space-y-6 dark:text-gray-300">
		<figure class="m-0">
			<img src={hero} alt="Visualization hero" class="w-full object-cover" loading="lazy" />
			<figcaption class="text-[10px] mt-1 opacity-70">
				Placeholder figure exploring spatial structure.
			</figcaption>
		</figure>

		<p>
			Effective scientific visualization balances precision with aesthetics. The goal isn't merely
			to decorate data, but to create visual grammars that reduce cognitive friction and invite
			exploration.
		</p>

		<p>
			I'm building tooling that lets researchers iterate on structure &amp; style in the same
			feedback loop. That means procedural color systems, resolution‑independent geometry, and
			composable animation primitives.
		</p>

		<h2 class="font-serif font-medium text-sm tracking-wide dark:text-gray-100">Principles</h2>
		<ul class="list-disc ml-5 space-y-2">
			<li>
				<strong class="dark:text-gray-100">Declarative layout:</strong> specify relationships, not pixel
				positions.
			</li>
			<li>
				<strong class="dark:text-gray-100">Temporal layering:</strong> motion as a first‑class channel
				for causality.
			</li>
			<li>
				<strong class="dark:text-gray-100">Color as structure:</strong> palettes encode semantics &amp;
				uncertainty.
			</li>
		</ul>

		<p>Here's a small inline image reference that might later be replaced:</p>
		<img src={inline} alt="Inline placeholder" class="w-40" loading="lazy" />

		<p>
			Future posts will detail the rendering pipeline and how it interfaces with real experimental
			data streams.
		</p>
	</div>
</article>

<style>
	article {
		overflow-y: unset;
	}
</style>
