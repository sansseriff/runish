<script lang="ts">
	import SectionHeader from '$lib/SectionHeader.svelte';
	import Bibliography from '$lib/Bibliography.svelte';
	import { setContext } from 'svelte';
	import { Tooltip } from 'bits-ui';

	// mdsvex passes frontmatter as exported metadata; in layouts we can access via $$props if needed.
	// Simpler: expect mdsvex to provide `data` with frontmatter on the default slot root.
	// We'll accept a title prop optionally supplied via frontmatter mapping.
	let {
		children,
		title,
		references = []
	}: {
		children?: () => any;
		title?: string;
		references?: { n: number; href: string; label: string }[];
	} = $props();

	// Make references available to <Citation /> via context.
	const refMap = new Map(references.map((r) => [r.n, r]));
	setContext('references', refMap);
</script>

<div class="prose mt-0 lg:pr-0 max-w-none">
	<SectionHeader {title} tag="h1" />
	<Tooltip.Provider>
		<div
			class="pl-6 w-full pr-6 pt-6 pb-8 max-w-none dark:prose-invert prose
		prose-headings:[color:var(--color-cream-700)] dark:prose-headings:[color:var(--color-cream-400)] prose-headings:font-sans prose-headings:font-medium prose-headings:tracking-tight
		prose-p:font-sans prose-p:text-[15px] prose-p:leading-relaxed prose-li:marker:text-gray-400 dark:prose-li:marker:text-gray-500
		prose-strong:text-gray-900 dark:prose-strong:text-gray-100
		prose-a:text-cream-500 prose-a:no-underline prose:text-gray-500"
			style="--content-pad-x: 1.5rem"
		>
			<!-- matches pl-6/pr-6 -->

			{@render children?.()}
		</div>

		{#if references.length}
			<Bibliography {references} />
		{/if}
	</Tooltip.Provider>
</div>

<style>
	:global(.prose h2 + h3) {
		margin-top: 0.75rem;
	}
	/* Hide first markdown h1 if present since we render title via SectionHeader */
	:global(.prose > h1:first-child) {
		display: none;
	}

	/* a :global {
		text-decoration: none;
		color: darkblue;

	} */
</style>
