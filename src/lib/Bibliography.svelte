<script lang="ts">
	export type Reference = { n: number; href: string; label: string };
	const { references = [] }: { references?: Reference[] } = $props();
</script>

<hr class="not-prose my-0 border-gray-200 dark:border-gray-800" />

<ol class="not-prose list-none space-y-1 mb-15 mt-0 p-6 relative">
	<div class="corner-diamond simple-noise corner-diamond-tr" aria-hidden="true"></div>
	<div class="corner-diamond simple-noise corner-diamond-tl" aria-hidden="true"></div>
	{#each references as r}
		<li id={'ref-' + r.n} class="text-sm pl-0">
			[{r.n}]
			<a
				href={r.href}
				target="_blank"
				rel="noopener noreferrer"
				class="text-cream-500 hover:underline"
			>
				{r.label}
			</a>
		</li>
	{/each}
</ol>
