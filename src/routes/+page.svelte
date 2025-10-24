<script lang="ts">
	import PageWrapper from '$lib/PageWrapper.svelte';
	import SectionHeader from '$lib/SectionHeader.svelte';

	let runish_mode: boolean = true;
</script>

<PageWrapper>
	<div class="space-y-0">
		<!-- Section header with horizontal line and diamond -->
		<SectionHeader>
			{#if runish_mode}
				<h1 class="mt-6 font-serif font-medium text-2xl lg:text-3xl lg:mb-0">
					<span class="text-accent-black dark:text-gray-400">Something </span>
					<span class="text-accent-blue">Runi</span><span
						class="dot text-blue-300 dark:text-blue-500">.</span
					><span class="text-accent-blue">sh</span>
				</h1>

				<div class="">
					<p
						class="font-sans text-md lg:text-md leading-relaxed opacity-90 max-w-2xl lg:mt-2 dark:text-gray-600"
					>
						Welcome to the portfolio and blog of Andrew Mueller.
						<br class="hidden sm:block" />
						<!-- <br class="hidden sm:block" /> -->
						Mildly mystical, mostly scientific.
					</p>
				</div>
			{:else}
				<h1 class="font-serif font-medium text-2xl lg:text-3xl text-accent-blue lg:mb-0">
					Hi, I'm Andrew
				</h1>

				<!-- Hero content -->
				<div class="">
					<p
						class="font-sans text-md lg:text-md leading-relaxed opacity-90 max-w-2xl lg:mt-1 dark:text-gray-600"
					>
						I'm a postdoc working with quantum networks & single photon detectors. I'm passionate
						about science communication and meta-science.
						<br class="hidden sm:block" />
						<!-- <br class="hidden sm:block" /> -->
					</p>
				</div>
			{/if}
		</SectionHeader>

		<!-- Subtle divider -->
		<!-- <div class="border-t border-grid opacity-50 mx-8 lg:mx-12"></div> -->

		<!-- Coming Soon section -->
		<div class="p-4 px-7 font-sans">
			<h2 class="lg:my-2 font-sans font-medium text-lg mb-3 opacity-80 mt-0 dark:text-gray-400">
				Coming Soon
			</h2>
			<p class="font-sans leading-relaxed opacity-70 dark:prose-invert dark:text-gray-400">
				This website is a work in progress. I'm currently building something beautiful to showcase
				my research and projects. Stay tuned!
			</p>
		</div>
	</div>
</PageWrapper>

<div
	class="block g:h-42 border-grid border-b lg:border-t-0 p-0 px-6 lg:p-6 lg:px-8 lg:pb-0 relative corner-decoration corner-bl mb-0"
></div>
<PageWrapper>
	<div class="p-5 px-7"><div class="this"></div></div>
</PageWrapper>

<style>
	.dot {
		margin-left: -0.02rem;
		margin-right: -0.02rem;
	}
</style>
