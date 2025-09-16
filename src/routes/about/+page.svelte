<script lang="ts">
	import { base } from '$app/paths';
	const cvHref = `${base}/AMueller_CV_MayX_2025.pdf`;
	const resumeHref = `${base}/AMueller_CV_MayX_2025.pdf`; // placeholder points to CV for now
	const profileSrc = `${base}/images/profile_picture.png`;
</script>

<div class="prose max-w-none w-full mx-auto mt-6 lg:pr-4">
	<div class="border-y lg:border-t-0 border-gray-300 dark:border-gray-700 p-6 relative">
		<h2 class="font-serif font-medium lg:h-4 justify-end flex-col block dark:text-gray-100">
			About
		</h2>
		<div
			class="absolute size-2 z-10 rounded-[1px] rotate-45 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 left-[-4.5px] bottom-[-4.5px]"
		></div>
	</div>

	<div class="p-6 lg:p-8 flex flex-col gap-8">
		<div class="flex flex-col sm:flex-row gap-8 items-start">
			<img
				src={profileSrc}
				alt="Profile"
				class="w-48 sm:w-56 aspect-[3/4] object-cover flex-shrink-0"
				loading="lazy"
			/>
			<div class="font-serif text-sm leading-snug space-y-4 dark:text-gray-300 max-w-prose">
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
					science publishing and communication must radically change over the next decade to inspire
					future scientists and help them explain their work.
				</p>
				<p>
					I'm developing a software suite in pursuit of this goal: enable scientists to create
					complex stories and visuals to show the world what they do.
				</p>
			</div>
		</div>

		<div class="border-y border-gray-300 dark:border-gray-700 py-8">
			<ul
				class="flex flex-col sm:flex-row flex-wrap gap-8 justify-center font-serif text-sm dark:text-gray-200"
			>
				<li><a href={cvHref} class="hover:underline dark:text-gray-200">◇ Curriculum Vitae</a></li>
				<li><a href={resumeHref} class="hover:underline dark:text-gray-200">◇ Resume</a></li>
				<li>
					<a href="#about-site" class="hover:underline dark:text-gray-200">◇ About this website</a>
				</li>
			</ul>
		</div>

		<div id="about-site" class="font-serif text-xs leading-relaxed max-w-prose dark:text-gray-300">
			<h3 class="font-serif font-medium mb-2">About this website</h3>
			<p>
				This site is built with SvelteKit, Tailwind CSS v4, and deployed statically via GitHub
				Pages. Typography and spacing are handled with a light custom theme. Accessibility and
				performance are ongoing focuses &mdash; images are lazy loaded, layout avoids CLS, and
				interactions are keyboard navigable.
			</p>
		</div>
	</div>
</div>

<style>
	.prose {
		overflow-y: unset;
	}
</style>
