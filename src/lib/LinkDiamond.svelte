<script>
	let { page, path } = $props();
</script>

{#if page.url.pathname === path}
	<div
		class="absolute size-2 z-10 rounded-[1px] rotate-45 border-2 border-black dark:border-blue-300/25 bg-gray-50 dark:bg-black left-[-16px] top-1/2 -translate-y-1/2"
	></div>
{/if}
