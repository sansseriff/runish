<script>
	let { children } = $props();
</script>

<div class="prose max-w-none w-full mx-auto mt-6 lg:pr-4 relative">
	<div class="relative z-10">
		{@render children()}
	</div>
</div>
