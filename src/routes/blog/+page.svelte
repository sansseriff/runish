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

		<div class="p-6 lg:p-8 font-sans dark:text-gray-300">
			<ul class="space-y-6">
				{#each posts as p}
					<li class="group">
						<a href={href(p)} class="block">
							<h3 class="font-medium text-base dark:text-gray-400">
								{p.title}
							</h3>
							<p class="text-xs opacity-70 dark:text-gray-400">{p.date}</p>
							<p class="text-xs mt-1 max-w-prose dark:text-gray-400">{p.summary}</p>
						</a>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</PageWrapper>

<style>
	.prose {
		overflow-y: unset;
	}
</style>
