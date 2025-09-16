<script lang="ts">
	import SectionHeader from '$lib/SectionHeader.svelte';
	// mdsvex passes frontmatter as exported metadata; in layouts we can access via $$props if needed.
	// Simpler: expect mdsvex to provide `data` with frontmatter on the default slot root.
	// We'll accept a title prop optionally supplied via frontmatter mapping.
	let { children, title }: { children?: () => any; title?: string } = $props();
	// Fallback: attempt to sniff first h1 client-side (optional) – omitted for simplicity.
</script>

<div class="prose max-w-none w-full mx-auto mt-6 lg:pr-4">
	<SectionHeader {title} tag="h1" />
	<div class="pl-6 pt-6 pb-12 dark:prose-invert prose
		prose-headings:[color:#99a1ad] prose-headings:font-serif prose-headings:font-medium prose-headings:tracking-tight
		prose-p:font-serif prose-p:text-[15px] prose-p:leading-relaxed prose-li:marker:text-gray-400 dark:prose-li:marker:text-gray-500
		prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-a:underline hover:prose-a:decoration-2">
		{@render children?.()}
	</div>
</div>

<style>
	:global(.prose h2 + h3) { margin-top: 0.75rem; }
	/* Hide first markdown h1 if present since we render title via SectionHeader */
	:global(.prose > h1:first-child) { display: none; }
</style>
