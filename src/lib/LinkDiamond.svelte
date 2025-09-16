<script>
	let { page, path } = $props();
</script>

{#if page.url.pathname === path}
	<div
		class="absolute size-2 z-10 rounded-[1px] rotate-45 border border-grid bg-white dark:bg-gray-900 left-[-16px] top-1/2 -translate-y-1/2 shadow-soft"
	></div>
{/if}
