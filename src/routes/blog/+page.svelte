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
			title: 'Designing expressive scientific visuals',
			slug: 'designing-expressive-scientific-visuals',
			date: '2025-09-01',
			summary: 'A quick tour through the goals and constraints guiding my visualization tooling.'
		}
	];
	function href(p: Post) {
		return `${base}/blog/${p.slug}`;
	}
</script>

<PageWrapper>
	<div class="space-y-6">
		<SectionHeader title="Blog" />

		<!-- Subtle divider -->
		<div class="border-t border-grid opacity-50 mx-6 lg:mx-8"></div>

		<div class="p-6 lg:p-8 font-serif dark:text-gray-300">
			<ul class="space-y-6">
				{#each posts as p}
					<li class="group">
						<a href={href(p)} class="block">
							<h3 class="font-medium text-base group-hover:underline">{p.title}</h3>
							<p class="text-xs opacity-70">{p.date}</p>
							<p class="text-xs mt-1 max-w-prose">{p.summary}</p>
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
