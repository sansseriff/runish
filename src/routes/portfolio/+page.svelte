<script lang="ts">
	import PortfolioCard from '$lib/PortfolioCard.svelte';
	import {
		projects,
		type ProjectFlag,
		type Project,
		projectFlagIcon
	} from '$lib/data/projects';

	let active: Set<ProjectFlag> = $state(new Set());
	function toggle(flag: ProjectFlag) {
		if (active.has(flag)) active.delete(flag);
		else active.add(flag);
		active = new Set(active);
	}

	function shown(p: Project) {
		if (active.size === 0) return true;
		return p.flags.some((f) => active.has(f));
	}

	let cardsToLoad = $state<Set<number>>(new Set());
	let cardElements: (HTMLElement | null)[] = $state(new Array(projects.length).fill(null));

	$effect(() => {
		if (typeof window === 'undefined') return;
		const observer = new IntersectionObserver(
			(entries) => {
				const visibleIndices: number[] = [];
				entries.forEach((entry) => {
					const index = parseInt(entry.target.getAttribute('data-card-index') || '-1');
					if (index >= 0 && entry.isIntersecting) visibleIndices.push(index);
				});
				visibleIndices.sort((a, b) => a - b);
				visibleIndices.forEach((index) => cardsToLoad.add(index));
				cardsToLoad = new Set(cardsToLoad);
			},
			{ rootMargin: '50px', threshold: 0.1 }
		);
		cardElements.forEach((el) => {
			if (el) observer.observe(el);
		});
		return () => observer.disconnect();
	});

	const flagOptions: ProjectFlag[] = ['software', 'quantum', 'visual'];
</script>

<article class="portfolio-list">
	<header class="page-header">
		<div>
			<div class="eyebrow">Projects</div>
			<h1 class="page-title">Built with code, built with colors.</h1>
			<p class="lede">
				Computational artist; artistic scientist & engineer. My projects span the space of design,
				computation, and aesthetics.
			</p>
		</div>
		<div class="meta">{projects.length} entries</div>
	</header>

	<div class="filters">
		<span class="filter-label">Filter:</span>
		{#each flagOptions as flag}
			<button
				class="chip"
				class:on={active.has(flag)}
				onclick={() => toggle(flag)}
			>
				<img src={projectFlagIcon(flag)} alt="" class="chip-icon" />
				{flag}
			</button>
		{/each}
		{#if active.size > 0}
			<button class="reset" onclick={() => (active = new Set())}>reset</button>
		{/if}
	</div>

	<div class="cards">
		{#each projects as c, i}
			{#if shown(c)}
				<PortfolioCard
					card={{ ...c, description: c.tagline }}
					cardIndex={i}
					shouldLoadVideo={cardsToLoad.has(i)}
					bind:cardElement={cardElements[i]}
				/>
			{/if}
		{/each}
	</div>
</article>

<style>
	.portfolio-list {
		display: flex;
		flex-direction: column;
		font-family: var(--font-sans-rs);
	}

	.page-header {
		padding: 40px 28px 22px;
		border-bottom: 1px solid var(--rs-rule);
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 14px;
	}
	.eyebrow {
		font-family: var(--font-mono-rs);
		font-size: 11px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--rs-fg-subtle);
		margin-bottom: 6px;
	}
	.page-title {
		font-family: var(--font-serif-rs);
		font-weight: 500;
		font-size: 24px;
		letter-spacing: -0.01em;
		color: var(--rs-fg-strong);
		margin: 0;
	}
	.lede {
		margin: 10px 0 0;
		font-size: 13px;
		color: var(--rs-fg-muted);
		max-width: 56ch;
		line-height: 1.55;
	}
	.meta {
		font-family: var(--font-mono-rs);
		font-size: 10px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--rs-fg-subtle);
	}

	.filters {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 8px;
		padding: 16px 28px;
		border-bottom: 1px solid var(--rs-rule);
		font-family: var(--font-mono-rs);
	}
	.filter-label {
		font-size: 10px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--rs-fg-subtle);
		margin-right: 4px;
	}
	.chip {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 4px 10px;
		font-size: 12px;
		font-family: var(--font-sans-rs);
		font-weight: 500;
		border-radius: 2px;
		border: 1px solid var(--rs-border);
		background: transparent;
		color: var(--rs-fg);
		cursor: pointer;
		transition:
			background 0.18s ease,
			color 0.18s ease,
			border-color 0.18s ease;
	}
	.chip:hover {
		border-color: var(--rs-border-strong);
		color: var(--rs-fg-strong);
	}
	.chip.on {
		background: var(--ink-200);
		border-color: var(--ink-200);
		color: var(--rs-fg-inverse);
	}
	:global(html.dark) .chip.on {
		background: var(--paper-50);
		border-color: var(--paper-50);
		color: var(--ink-200);
	}
	.chip-icon {
		width: 11px;
		height: 11px;
		opacity: 0.85;
	}
	.reset {
		font-size: 10px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		text-decoration: underline;
		opacity: 0.7;
		background: transparent;
		border: 0;
		cursor: pointer;
		color: inherit;
	}
	.reset:hover {
		opacity: 1;
	}

	.cards {
		padding: 24px 28px 48px;
		display: flex;
		flex-direction: column;
		gap: 20px;
	}
</style>
