<script lang="ts">
	import { base } from '$app/paths';
	import SectionHeader from '$lib/SectionHeader.svelte';
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

<div class="prose max-w-none w-full mx-auto mt-6 lg:pr-4">
	<SectionHeader title="Blog" />

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

<style>
	.prose {
		overflow-y: unset;
	}
</style>
