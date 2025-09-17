<script>
	let { children } = $props();
</script>

<div class="prose max-w-none w-full mx-auto mt-6 relative">
	<div class="relative z-10">
		{@render children()}
	</div>
</div>
