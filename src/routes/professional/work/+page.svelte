<script lang="ts">
	import { base } from '$app/paths';
	import ThemedImage from '$lib/ThemedImage.svelte';
	import { exitProMode } from '$lib/mode.svelte';
	import { work, groupOrder, groupLabels, workHref, cardImage } from '$lib/data/work';

	const groups = groupOrder
		.map((g) => ({ group: g, ...groupLabels[g], entries: work.filter((w) => w.group === g) }))
		.filter((g) => g.entries.length > 0);
</script>

<svelte:head>
	<title>Work · Andrew Mueller</title>
</svelte:head>

<article class="work-list">
	<header class="page-header">
		<div>
			<div class="eyebrow">Work</div>
			<h1 class="page-title">Instruments, software, and the physics between them.</h1>
			<p class="lede">
				I build measurement hardware for superconducting detectors and the software that runs it,
				and I am building a new tool for explaining how physical systems work.
			</p>
		</div>
		<div class="meta">{work.length} entries</div>
	</header>

	{#each groups as g}
		<section class="group">
			<header class="group-header">
				<div class="eyebrow">{g.eyebrow}</div>
				<h2 class="group-title">{g.title}</h2>
			</header>

			{#each g.entries as w, i}
				{#if w.minor}
					<a class="row minor" href={workHref(w)}>
						<span class="thumb">
							<ThemedImage
								src={cardImage(w).src}
								srcDark={cardImage(w).srcDark}
								alt=""
								class="thumb-img"
							/>
						</span>
						<div class="row-body">
							<h3 class="minor-title">{w.title}</h3>
							<p class="summary">{w.tagline}</p>
						</div>
						<span class="year">{w.years}</span>
					</a>
				{:else}
					<a class="row major" href={workHref(w)}>
						<span class="frame">
							<ThemedImage
								src={cardImage(w).src}
								srcDark={cardImage(w).srcDark}
								alt={cardImage(w).alt}
								class="frame-img"
							/>
						</span>
						<div class="row-body">
							<div class="row-meta">
								<span>{w.years}</span>
								<span class="sep">·</span>
								<span>{w.role}</span>
							</div>
							<h3 class="major-title">{w.title}</h3>
							<p class="summary">{w.tagline}</p>
							{#if w.stack.length}
								<ul class="stack">
									{#each w.stack as s}
										<li>{s}</li>
									{/each}
								</ul>
							{/if}
							<span class="more">Read more →</span>
						</div>
					</a>
				{/if}
				{#if i < g.entries.length - 1}
					<div class="row-divider"></div>
				{/if}
			{/each}
		</section>
	{/each}

	<footer class="aside">
		Away from the lab I make aerial films and digital art.
		<a href="{base}/portfolio" class="rs-flourish" onclick={exitProMode}>See the full site →</a>
	</footer>
</article>

<style>
	.work-list {
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
		white-space: nowrap;
	}

	.group {
		border-bottom: 1px solid var(--rs-rule);
	}
	.group-header {
		padding: 24px 28px 14px;
		border-bottom: 1px solid var(--rs-rule);
	}
	.group-title {
		font-family: var(--font-serif-rs);
		font-weight: 500;
		font-size: 18px;
		letter-spacing: -0.01em;
		color: var(--rs-fg-strong);
		margin: 0;
	}

	.row {
		display: grid;
		gap: 22px;
		padding: 22px 28px;
		text-decoration: none;
		color: inherit;
		background-image: none;
		transition: background-color 0.18s ease;
	}
	.row:hover {
		background-color: var(--rs-bg-hover);
		background-size: 0 1px;
	}
	.row-divider {
		margin: 0 28px;
		border-bottom: 1px solid var(--rs-rule);
	}
	.row-body {
		min-width: 0;
	}

	.major {
		grid-template-columns: minmax(0, 300px) 1fr;
		align-items: start;
	}
	.frame {
		display: block;
		aspect-ratio: 16 / 10;
		border: 1px solid var(--rs-border);
		border-radius: 2px;
		overflow: hidden;
		background: var(--rs-bg-raised);
		transition:
			box-shadow 0.2s ease,
			border-color 0.2s ease;
	}
	.row:hover .frame {
		box-shadow: var(--rs-shadow-1);
		border-color: var(--rs-border-strong);
	}
	.frame :global(.frame-img) {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: top left;
		margin: 0;
	}
	.row-meta {
		font-family: var(--font-mono-rs);
		font-size: 10px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--rs-fg-subtle);
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		margin-bottom: 6px;
	}
	.sep {
		opacity: 0.7;
	}
	.major-title {
		font-family: var(--font-serif-rs);
		font-weight: 500;
		font-size: 20px;
		letter-spacing: -0.01em;
		color: var(--rs-fg-strong);
		margin: 0 0 6px;
		transition: color 0.18s ease;
	}
	.row:hover .major-title,
	.row:hover .minor-title {
		color: var(--rs-fg-accent);
	}
	.summary {
		font-size: 13px;
		line-height: 1.55;
		color: var(--rs-fg-muted);
		margin: 0;
		max-width: 60ch;
	}
	.stack {
		list-style: none;
		margin: 12px 0 0;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}
	.stack li {
		font-family: var(--font-mono-rs);
		font-size: 10px;
		letter-spacing: 0.04em;
		padding: 2px 7px;
		border: 1px solid var(--rs-border);
		border-radius: 2px;
		color: var(--rs-fg-muted);
		margin: 0;
	}
	.more {
		display: inline-block;
		margin-top: 12px;
		font-family: var(--font-mono-rs);
		font-size: 11px;
		letter-spacing: 0.06em;
		color: var(--rs-fg-subtle);
	}
	.row:hover .more {
		color: var(--rs-fg-strong);
	}

	.minor {
		grid-template-columns: 52px 1fr auto;
		align-items: center;
		gap: 18px;
		padding-top: 16px;
		padding-bottom: 16px;
	}
	.thumb {
		display: block;
		width: 52px;
		height: 52px;
		border: 1px solid var(--rs-border);
		border-radius: 2px;
		overflow: hidden;
	}
	.thumb :global(.thumb-img) {
		width: 100%;
		height: 100%;
		object-fit: cover;
		margin: 0;
	}
	.minor-title {
		font-family: var(--font-sans-rs);
		font-weight: 600;
		font-size: 12px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		margin: 0 0 4px;
		color: var(--rs-fg-strong);
		transition: color 0.18s ease;
	}
	.year {
		font-family: var(--font-mono-rs);
		font-size: 10px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--rs-fg-subtle);
		white-space: nowrap;
	}

	.aside {
		padding: 22px 28px 36px;
		font-size: 13px;
		color: var(--rs-fg-muted);
	}
	.aside a {
		color: var(--rs-fg-strong);
		text-decoration: none;
	}

	@media (max-width: 640px) {
		.page-header {
			flex-direction: column;
		}
		.major {
			grid-template-columns: 1fr;
		}
		.minor {
			grid-template-columns: 52px 1fr;
		}
		.year {
			display: none;
		}
	}
</style>
