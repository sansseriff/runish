<script>
	import PageWrapper from '$lib/PageWrapper.svelte';
	import SectionHeader from '$lib/SectionHeader.svelte';
</script>

<PageWrapper>
	<div class="space-y-0">
		<!-- Section header with horizontal line and diamond -->
		<SectionHeader>
			<h1 class="font-serif font-medium text-2xl lg:text-3xl text-accent-blue">Hi, I'm Andrew</h1>

			<!-- Hero content -->
			<div class="">
				<p class="font-serif text-lg lg:text-lg leading-relaxed opacity-90 max-w-2xl">
					I'm a postdoc working with quantum networks & single photon detectors.
					<br class="hidden sm:block" />
					<!-- <br class="hidden sm:block" /> -->
					I'm passionate about science communication and meta-science.
				</p>
			</div>
		</SectionHeader>

		<!-- Subtle divider -->
		<div class="border-t border-grid opacity-50 mx-8 lg:mx-12"></div>

		<!-- Coming Soon section -->
		<div class="p-6 lg:p-8 font-serif">
			<h2 class="font-serif font-medium text-lg mb-3 opacity-80 mt-0">Coming Soon</h2>
			<p class="font-serif leading-relaxed opacity-70">
				This website is a work in progress. I'm currently building something beautiful to showcase
				my research and projects. Stay tuned!
			</p>
		</div>
	</div>
</PageWrapper>
