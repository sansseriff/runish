<script lang="ts">
	import { base } from '$app/paths';
	import SectionHeader from '$lib/SectionHeader.svelte';
	import PageWrapper from '$lib/PageWrapper.svelte';
	interface Post {
		title: string;
		slug: string;
		date: string;
		summary: string;
	}
	const posts: Post[] = [
		{
			title: 'The Problem with Three Minute Thesis',
			slug: 'three-minute-thesis',
			date: '2025-11-04',
			summary:
				'Why the popular 3MT competition fails to capture what makes science communication truly effective.'
		},
		{
			title: "Why Science Can't Tell Stories About Itself",
			slug: 'science-stories',
			date: '2025-07-02',
			summary: 'Why modern science struggles to captivate like a good story.'
		},
		{
			title: 'The Galileo Problem',
			slug: 'galileo-problem',
			date: '2025-10-11',
			summary:
				"The parallels between Galileo's challenges and the hurdles facing modern science education."
		}
	];
	function href(p: Post) {
		return `${base}/blog/${p.slug}`;
	}
</script>

<PageWrapper>
	<div class="space-y-6">
		<SectionHeader title="Blog" containerClass="mt-0" />

		<!-- Subtle divider -->
		<!-- <div class="border-t border-grid opacity-50 mx-6 lg:mx-8"></div> -->

		<div class="p-4 lg:p-4 font-sans dark:text-gray-300">
			<div>
				{#each posts as p}
					<div class="blog-card transition-colors duration-200 p-4">
						<a href={href(p)} class="block no-underline">
							<h3 class="font-medium text-base dark:text-gray-100 mt-0">
								{p.title}
							</h3>
							<p class="text-xs opacity-70 dark:text-gray-400">{p.date}</p>
							<p class="text-xs mt-1 max-w-prose dark:text-gray-400">{p.summary}</p>
						</a>
					</div>
					{#if p !== posts[posts.length - 1]}
						<div class="blog-divider border-b border-gray-200/50 dark:border-gray-700/30"></div>
					{/if}
				{/each}
			</div>
		</div>
	</div>
</PageWrapper>

<style>
	.prose {
		overflow-y: unset;
	}
	.blog-card {
		/* Match page background color - start with page bg, hover transitions to hovered-bg */
		background-color: hsl(45, 23%, 97%);
		position: relative;
		transition: background-color 0.2s ease;
		border-radius: 0.5rem;
	}
	:global(html.light) .blog-card {
		background-color: hsl(45, 23%, 97%);
	}
	:global(html.dark) .blog-card {
		background-color: hsla(218, 13%, 8%, 0.95);
	}
	.blog-card::before {
		/* Always show noise texture on cards */
		content: '';
		position: absolute;
		inset: 0;

		background-image: url('/images/noise.0e24d0e5.png');
		background-size: 180px;
		background-repeat: repeat;
		opacity: var(--noise-opacity-light, 0.04);
		pointer-events: none;
		z-index: 0;
		border-radius: inherit;
	}
	:global(html.dark) .blog-card::before {
		opacity: var(--noise-opacity-dark, 0.05);
	}
	.blog-card:hover {
		background-color: var(--color-hovered-bg) !important;
	}
	.blog-card > a {
		position: relative;
		z-index: 1;
	}
	.blog-divider {
		margin-top: 0.6rem;
		margin-bottom: 0.6rem;
	}
</style>
