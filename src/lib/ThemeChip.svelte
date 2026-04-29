<script lang="ts">
	type Mode = 'chip' | 'text';

	let {
		isDark = false,
		mode = 'chip',
		onToggle
	}: { isDark?: boolean; mode?: Mode; onToggle?: () => void } = $props();

	const label = $derived(isDark ? 'dark' : 'light');
</script>

{#if mode === 'chip'}
	<button
		type="button"
		onclick={onToggle}
		aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
		class="theme-chip"
	>
		<span class="dot" aria-hidden="true" class:filled={isDark}></span>
		{label}
	</button>
{:else}
	<button
		type="button"
		onclick={onToggle}
		aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
		class="theme-text rs-flourish"
	>
		[{label}]
	</button>
{/if}

<style>
	.theme-chip {
		background: transparent;
		border: 1px solid var(--rs-border);
		border-radius: 2px;
		padding: 4px 8px;
		cursor: pointer;
		color: var(--rs-fg-muted);
		font-family: var(--font-mono-rs);
		font-size: 10px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		display: inline-flex;
		align-items: center;
		gap: 6px;
		transition:
			color 0.18s ease,
			border-color 0.18s ease;
		background-image: none;
	}
	.theme-chip:hover {
		color: var(--rs-fg-strong);
		border-color: var(--rs-border-strong);
		background-size: 0 1px;
	}
	.dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: transparent;
		border: 1px solid var(--rs-fg-muted);
		display: inline-block;
	}
	.dot.filled {
		background: var(--rs-fg-muted);
	}

	.theme-text {
		background: transparent;
		border: 0;
		padding: 0;
		cursor: pointer;
		color: inherit;
		font-family: var(--font-mono-rs);
		font-size: 11px;
		letter-spacing: 0.04em;
		opacity: 0.9;
		display: inline-flex;
		align-items: center;
	}
	.theme-text:hover {
		opacity: 1;
	}
</style>
