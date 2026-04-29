<script lang="ts">
	import RunishText from '$lib/RunishText.svelte';
	import ShaderCanvas from '$lib/ShaderCanvas.svelte';
	import ThemeChip from '$lib/ThemeChip.svelte';
	import { posts as blogPosts } from '$lib/data/blog';

	type Preset = 'ascii' | 'plasma' | 'ember' | 'weave' | 'jormun' | 'rune' | 'valk';

	let {
		isDark = false,
		preset = 'plasma' as Preset,
		density = 0.8,
		speed = 0.35,
		accent = 0.36,
		onToggleTheme
	}: {
		isDark?: boolean;
		preset?: Preset;
		density?: number;
		speed?: number;
		accent?: number;
		onToggleTheme?: () => void;
	} = $props();

	const latest = blogPosts[0];
</script>

<section class="hero-band">
	<div class="shader-layer">
		<ShaderCanvas {preset} {isDark} {density} {speed} {accent} />
	</div>

	<!-- Faint paper overlay for legibility -->
	<div class="paper-overlay" class:dark={isDark}></div>
	<!-- Bottom-edge fade to page background -->
	<div class="bottom-fade" class:dark={isDark}></div>

	<!-- Corner registration marks -->
	<span class="corner tl" aria-hidden="true"></span>
	<span class="corner tr" aria-hidden="true"></span>
	<span class="corner bl" aria-hidden="true"></span>
	<span class="corner br" aria-hidden="true"></span>

	<div class="hero-content">
		<div class="hero-eyebrow">
			<div class="eyebrow-left">
				<span class="diamond-mark" aria-hidden="true"></span>
				<span>live</span>
			</div>
			{#if onToggleTheme}
				<div class="eyebrow-right">
					<ThemeChip {isDark} onToggle={onToggleTheme} />
				</div>
			{/if}
		</div>

		<div class="kicker">Something</div>

		<h1 class="hero-title">
			<RunishText rememberVisitor={false} />
		</h1>

		<p class="hero-lede">
			Portfolio and blog of Andrew Mueller — mildly mystical, mostly scientific.
		</p>

		<div class="transmission-log">
			<span>v0.5</span>
			<span class="sep">·</span>
			<span>latest: <a href="#latest" class="log-link rs-flourish">{latest?.title ?? '—'}</a></span>
			<span class="sep">·</span>
			<span>click anywhere in the field to emit a pulse</span>
			<span class="preset-label">{preset} · ch 1</span>
		</div>
	</div>
</section>

<style>
	.hero-band {
		position: relative;
		border-bottom: 1px solid var(--rs-rule);
		overflow: hidden;
		min-height: 480px;
	}
	.shader-layer {
		position: absolute;
		inset: 0;
		z-index: 0;
	}
	.paper-overlay {
		position: absolute;
		inset: 0;
		z-index: 1;
		pointer-events: none;
		background: linear-gradient(
			180deg,
			rgba(251, 249, 244, 0.18) 0%,
			rgba(251, 249, 244, 0.32) 100%
		);
	}
	.paper-overlay.dark {
		background: linear-gradient(180deg, rgba(14, 14, 16, 0.1) 0%, rgba(14, 14, 16, 0.25) 100%);
	}
	.bottom-fade {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		height: 55%;
		z-index: 1;
		pointer-events: none;
		background: linear-gradient(180deg, rgba(251, 249, 244, 0) 0%, var(--rs-bg) 100%);
	}
	.bottom-fade.dark {
		background: linear-gradient(180deg, rgba(14, 14, 16, 0) 0%, var(--rs-bg) 100%);
	}

	.corner {
		position: absolute;
		width: 14px;
		height: 14px;
		opacity: 0.3;
		z-index: 3;
		pointer-events: none;
	}
	.corner.tl {
		top: 10px;
		left: 10px;
		border-top: 1px solid var(--rs-fg-muted);
		border-left: 1px solid var(--rs-fg-muted);
	}
	.corner.tr {
		top: 10px;
		right: 10px;
		border-top: 1px solid var(--rs-fg-muted);
		border-right: 1px solid var(--rs-fg-muted);
	}
	.corner.bl {
		bottom: 10px;
		left: 10px;
		border-bottom: 1px solid var(--rs-fg-muted);
		border-left: 1px solid var(--rs-fg-muted);
	}
	.corner.br {
		bottom: 10px;
		right: 10px;
		border-bottom: 1px solid var(--rs-fg-muted);
		border-right: 1px solid var(--rs-fg-muted);
	}

	.hero-content {
		position: relative;
		z-index: 2;
		padding: 56px 28px 36px;
		display: flex;
		flex-direction: column;
		gap: 7px;
		min-height: 480px;
		pointer-events: none;
	}

	.hero-eyebrow {
		font-family: var(--font-mono-rs);
		font-size: 11px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--rs-fg-muted);
		margin-bottom: 22px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.eyebrow-left {
		display: flex;
		gap: 10px;
		align-items: center;
	}
	.eyebrow-right {
		pointer-events: auto;
	}
	.diamond-mark {
		width: 6px;
		height: 6px;
		border-radius: 1px;
		transform: rotate(45deg);
		background: var(--rs-fg-accent);
		display: inline-block;
	}
	.kicker {
		font-family: var(--font-serif-rs);
		font-weight: 400;
		font-size: 24px;
		color: var(--rs-fg-muted);
		letter-spacing: -0.01em;
		margin-bottom: 4px;
	}

	.hero-title {
		font-family: var(--font-serif-rs);
		font-weight: 500;
		font-size: 64px;
		letter-spacing: -0.02em;
		line-height: 1;
		margin: 0;
		color: var(--rs-fg-strong);
		display: inline-block;
		pointer-events: auto;
		margin-top: -3rem;
	}

	.hero-lede {
		font-family: var(--font-sans-rs);
		font-size: 16px;
		line-height: 1.6;
		color: var(--rs-fg-muted);
		margin: 26px 0 0;
		max-width: 52ch;
	}

	.transmission-log {
		margin-top: auto;
		padding-top: 20px;
		border-top: 1px solid var(--rs-rule);
		display: flex;
		gap: 16px;
		flex-wrap: wrap;
		align-items: center;
		font-family: var(--font-mono-rs);
		font-size: 11px;
		color: var(--rs-fg-muted);
		letter-spacing: 0.04em;
	}
	.sep {
		color: var(--rs-fg-subtle);
	}
	.preset-label {
		margin-left: auto;
		color: var(--rs-fg-subtle);
	}
	.log-link {
		pointer-events: auto;
		color: inherit;
	}

	@media (max-width: 640px) {
		.hero-band {
			min-height: 440px;
		}
		.hero-title {
			font-size: 44px;
		}
		.hero-content {
			padding: 36px 20px 24px;
			min-height: 440px;
		}
	}
</style>
