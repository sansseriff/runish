<script lang="ts">
	import { base } from '$app/paths';
	import SectionHeader from '$lib/SectionHeader.svelte';
	import PageWrapper from '$lib/PageWrapper.svelte';
	const cvHref = `${base}/AMueller_CV_MayX_2025.pdf`;
	const resumeHref = `${base}/AMueller_CV_MayX_2025.pdf`; // placeholder points to CV for now
	const profileSrc = `${base}/images/profile_picture.png`;
</script>

<PageWrapper>
	<div class="space-y-8">
		<SectionHeader title="About" />

		<div class="p-6 lg:p-8 flex flex-col gap-8">
			<div class="flex flex-col sm:flex-row gap-8 items-start">
				<img
					src={profileSrc}
					alt="Profile"
					class="w-48 sm:w-56 aspect-[3/4] object-cover flex-shrink-0 rounded-sm shadow-soft"
					loading="lazy"
				/>
				<div class="font-serif text-sm leading-snug space-y-4 max-w-prose opacity-90">
					<p>
						My name's Andrew Mueller. I did my undergrad in physics at UC San Diego, and my PhD in
						applied physics at Caltech.
					</p>
					<p>
						Since then, I've been working at the JPL microdevices laboratory on superconducting
						detector development and testing.
					</p>
					<p>
						I have broad interests centered around technical research and communication. I believe
						science publishing and communication must radically change over the next decade to
						inspire future scientists and help them explain their work.
					</p>
					<p>
						I'm developing a software suite in pursuit of this goal: enable scientists to create
						complex stories and visuals to show the world what they do.
					</p>
				</div>
			</div>

			<!-- Subtle divider -->
			<div class="border-t border-grid opacity-50 mx-2"></div>

			<div class="py-4">
				<ul class="flex flex-col sm:flex-row flex-wrap gap-6 justify-center font-serif text-sm">
					<li>
						<a
							href={cvHref}
							class="hover:underline hover:text-accent-blue transition-colors duration-200"
							>◇ Curriculum Vitae</a
						>
					</li>
					<li>
						<a
							href={resumeHref}
							class="hover:underline hover:text-accent-blue transition-colors duration-200"
							>◇ Resume</a
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

			<!-- Subtle divider -->
			<div class="border-t border-grid opacity-50 mx-2"></div>

			<div id="about-site" class="font-serif text-xs leading-relaxed max-w-prose opacity-80">
				<h3 class="font-serif font-medium mb-3 text-base opacity-90">About this website</h3>
				<p>
					This site is built with SvelteKit, Tailwind CSS v4, and deployed statically via GitHub
					Pages. Typography and spacing are handled with a light custom theme. Accessibility and
					performance are ongoing focuses &mdash; images are lazy loaded, layout avoids CLS, and
					interactions are keyboard navigable.
				</p>
			</div>
		</div>
	</div>
</PageWrapper>

<style>
	.prose {
		overflow-y: unset;
	}
</style>
