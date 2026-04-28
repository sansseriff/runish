<script lang="ts">
	import { base } from '$app/paths';
	import RunishText from '$lib/RunishText.svelte';

	let { compact = false }: { compact?: boolean } = $props();
</script>

<a href="{base}/" class="brand-lockup" class:compact aria-label="runi.sh — Home">
	<img src="{base}/Runish.svg" width="18" height="18" alt="" />
	<span class="wordmark">
		<RunishText size="sm" rememberVisitor={false} />
	</span>
</a>

<style>
	.brand-lockup {
		display: inline-flex;
		align-items: center;
		justify-content: flex-end;
		gap: 8px;
		text-decoration: none;
		color: var(--rs-fg-strong);
		background-image: none;
	}
	.brand-lockup:hover {
		background-size: 0 1px;
	}
	.wordmark {
		font-family: var(--font-serif-rs);
		font-weight: 500;
		font-size: 14px;
		line-height: 1;
		letter-spacing: -0.01em;
		color: var(--rs-fg-strong);
	}
	.brand-lockup.compact .wordmark {
		font-size: 13px;
	}
</style>
