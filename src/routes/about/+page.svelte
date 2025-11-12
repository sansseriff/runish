<script lang="ts">
	import { base } from '$app/paths';
	import SectionHeader from '$lib/SectionHeader.svelte';
	import PageWrapper from '$lib/PageWrapper.svelte';
	import Page from '../+page.svelte';
	const cvHref = `${base}/AMueller_CV_MayX_2025.pdf`;
	const resumeHref = `${base}/AMueller_CV_MayX_2025.pdf`; // placeholder points to CV for now
	const profileSrc = `${base}/shared/profile_picture.png`;
</script>

<PageWrapper>
	<div class="space-y-8">
		<SectionHeader title="About" />

		<div class="p-6 lg:p-8 flex flex-col gap-8">
			<div class="flex flex-col sm:flex-row gap-8 items-start">
				<img
					src={profileSrc}
					alt="Profile"
					class="w-48 sm:w-56 aspect-[3/4] object-cover flex-shrink-0 rounded-sm shadow-soft block"
					style="margin: 0 !important;"
					loading="lazy"
				/>
				<div class="font-sans text-m leading-snug space-y-4 max-w-prose opacity-90 mt-0 lg:w-full">
					<p class="mt-0">
						I'm Andrew Mueller. I have a physics degree from UC San Diego and a PhD in applied
						physics from Caltech. I currently work at JPL's microdevices laboratory where I develop
						and test superconducting detectors for space and quantum information science.
					</p>
					<p>
						I'm passionate about transforming how scientists communicate their work. To that end,
						I'm building software tools that illustrate and enable storytelling about science.
					</p>
				</div>
			</div>
		</div>
	</div>
</PageWrapper>

<!-- <div class="border-t border-grid opacity-50 mx-2"></div>

<div class="py-4">
	<ul class="flex flex-col sm:flex-row flex-wrap gap-6 justify-center font-serif text-sm">
		<li>
			<a href={cvHref} class="hover:underline hover:text-accent-blue transition-colors duration-200"
				>◇ Curriculum Vitae</a
			>
		</li>
		<li>
			<a
				href={resumeHref}
				class="hover:underline hover:text-accent-blue transition-colors duration-200">◇ Resume</a
			>
		</li>
		<li>
			<a
				href="#about-site"
				class="hover:underline hover:text-accent-blue transition-colors duration-200"
				>◇ About this website</a
			>
		</li>
	</ul>
</div>


<div class="border-t border-grid opacity-50 mx-2"></div>

<div id="about-site" class="font-serif text-xs leading-relaxed max-w-prose opacity-80">
	<h3 class="font-serif font-medium mb-3 text-base opacity-90">About this website</h3>
	<p>
		This site is built with SvelteKit, Tailwind CSS v4, and deployed statically via GitHub Pages.
		Typography and spacing are handled with a light custom theme. Accessibility and performance are
		ongoing focuses &mdash; images are lazy loaded, layout avoids CLS, and interactions are keyboard
		navigable.
	</p>
</div> -->

<!-- <style>
	.prose {
		overflow-y: unset;
	}
</style> -->
