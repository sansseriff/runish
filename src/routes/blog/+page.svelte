<script lang="ts">
	import { base } from '$app/paths';
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
	<div class="border-y lg:border-t-0 border-gray-300 dark:border-gray-700 p-6 relative">
		<h2 class="font-serif font-medium lg:h-4 justify-end flex-col block dark:text-gray-100">
			Blog
		</h2>
		<div
			class="absolute size-2 z-10 rounded-[1px] rotate-45 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 left-[-4.5px] bottom-[-4.5px]"
		></div>
	</div>

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
