<script lang="ts">
	import { base } from '$app/paths';
	import { posts as allPosts, postsSorted, blogHref, formatMonthYear } from '$lib/data/blog';
	import {
		projects as allProjects,
		projectHref,
		projectFlagIcon,
		primaryFlag
	} from '$lib/data/projects';

	let { blogLimit = 4, projectLimit = 4 }: { blogLimit?: number; projectLimit?: number } = $props();

	const blogPreview = $derived(postsSorted().slice(0, blogLimit));
	const projectPreview = $derived(allProjects.slice(0, projectLimit));
	const rows = $derived(Math.max(blogPreview.length, projectPreview.length));
</script>

<!--
	One grid for both columns, so row n of the notes and row n of the projects
	share a height and their dividers line up. Cells are in DOM order per
	column, which is also the stacking order on narrow screens.
-->
<section class="previews" style:--rows={rows}>
	<header class="col-header blog-cell" style:grid-row="1">
		<div>
			<div class="eyebrow">Notes</div>
			<h2 class="col-title">From the Desk</h2>
		</div>
		<div class="meta">Blog · {blogPreview.length} of {allPosts.length}</div>
	</header>
	{#each blogPreview as p, i}
		<a
			class="row blog-row blog-cell"
			class:first={i === 0}
			href={blogHref(p)}
			style:grid-row={i + 2}
		>
			<div class="row-body">
				<h3 class="row-title">{p.title}</h3>
				<p class="row-summary">{p.teaser}</p>
			</div>
			<time class="date" datetime={p.date}>{formatMonthYear(p.date)}</time>
		</a>
	{/each}
	{#each Array(rows - blogPreview.length) as _, i}
		<div class="filler blog-cell" style:grid-row={blogPreview.length + i + 2}></div>
	{/each}
	<div class="col-footer blog-cell" style:grid-row={rows + 2}>
		<a class="all-link rs-flourish" href="{base}/blog">All notes →</a>
	</div>

	<header class="col-header proj-cell" style:grid-row="1">
		<div>
			<div class="eyebrow">Projects</div>
			<h2 class="col-title">Code & Colors</h2>
		</div>
		<div class="meta">Portfolio · {projectPreview.length} of {allProjects.length}</div>
	</header>
	{#each projectPreview as p, i}
		<a
			class="row project-row proj-cell"
			class:first={i === 0}
			href={projectHref(p)}
			style:grid-row={i + 2}
		>
			<span class="fragment" style:background-image={`url(${p.media.path})`} aria-hidden="true">
				<span class="frag-overlay"></span>
				<span class="frag-tick"></span>
			</span>
			<div class="row-body">
				<div class="proj-titlerow">
					<img class="flag-icon" src={projectFlagIcon(primaryFlag(p))} alt={primaryFlag(p)} />
					<h3 class="proj-title">{p.title}</h3>
				</div>
				<p class="row-summary">{p.tagline}</p>
			</div>
			<span class="year">{p.year}</span>
		</a>
	{/each}
	{#each Array(rows - projectPreview.length) as _, i}
		<div class="filler proj-cell" style:grid-row={projectPreview.length + i + 2}></div>
	{/each}
	<div class="col-footer proj-cell" style:grid-row={rows + 2}>
		<a class="all-link rs-flourish" href="{base}/portfolio">All projects →</a>
	</div>
</section>

<style>
	.previews {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: auto repeat(var(--rows), auto) auto;
		border-bottom: 1px solid var(--rs-rule);
	}
	.blog-cell {
		grid-column: 1;
		border-right: 1px solid var(--rs-rule);
	}
	.proj-cell {
		grid-column: 2;
	}
	/* Inset divider above every row but the first, as before. */
	.row,
	.filler {
		position: relative;
	}
	.row:not(.first)::before {
		content: '';
		position: absolute;
		top: 0;
		left: 28px;
		right: 28px;
		border-top: 1px solid var(--rs-rule);
	}

	.col-header {
		padding: 24px 28px 14px;
		border-bottom: 1px solid var(--rs-rule);
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 14px;
		min-height: 78px;
		box-sizing: border-box;
	}
	.eyebrow {
		font-family: var(--font-mono-rs);
		font-size: 11px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--rs-fg-subtle);
		margin-bottom: 4px;
	}
	.col-title {
		font-family: var(--font-serif-rs);
		font-weight: 500;
		font-size: 18px;
		letter-spacing: -0.01em;
		color: var(--rs-fg-strong);
		margin: 0;
	}
	.meta {
		font-family: var(--font-mono-rs);
		font-size: 10px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--rs-fg-subtle);
	}

	.row {
		padding: 16px 28px;
		display: grid;
		gap: 18px;
		min-height: 84px;
		box-sizing: border-box;
		text-decoration: none;
		color: inherit;
		background-image: none;
		transition: background-color 0.18s ease;
	}
	.row:hover {
		background-color: var(--rs-bg-hover);
		background-size: 0 1px;
	}
	.blog-row {
		grid-template-columns: 1fr auto;
		align-items: start;
	}
	.project-row {
		grid-template-columns: 52px 1fr auto;
		align-items: start;
	}

	.date {
		white-space: nowrap;
		padding-top: 4px;
		font-family: var(--font-mono-rs);
		font-size: 11px;
		color: var(--rs-fg-subtle);
		letter-spacing: 0.04em;
	}
	.row-body {
		min-width: 0;
	}
	.row-title {
		font-family: var(--font-serif-rs);
		font-weight: 500;
		font-size: 17px;
		margin: 0 0 4px;
		color: var(--rs-fg-strong);
		letter-spacing: -0.01em;
		transition: color 0.18s ease;
	}
	.row:hover .row-title,
	.row:hover .proj-title {
		color: var(--rs-fg-accent);
	}
	.row-summary {
		font-family: var(--font-sans-rs);
		font-size: 13px;
		line-height: 1.55;
		margin: 0;
		color: var(--rs-fg-muted);
		max-width: 50ch;
	}
	.blog-row .date,
	.year {
		font-family: var(--font-mono-rs);
		font-size: 10px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--rs-fg-subtle);
		align-self: start;
		padding-top: 4px;
	}

	.proj-titlerow {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 6px;
	}
	.flag-icon {
		width: 11px;
		height: 11px;
		opacity: 0.85;
	}
	.proj-title {
		font-family: var(--font-sans-rs);
		font-weight: 600;
		font-size: 12px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		margin: 0;
		color: var(--rs-fg-strong);
		transition: color 0.18s ease;
	}

	.fragment {
		position: relative;
		width: 52px;
		height: 56px;
		flex: 0 0 auto;
		border-radius: 2px;
		border: 1px solid var(--rs-border);
		background-size: cover;
		background-position: center;
		overflow: hidden;
		transition:
			box-shadow 0.2s ease,
			border-color 0.2s ease;
	}
	.row:hover .fragment {
		box-shadow: var(--rs-shadow-1);
		border-color: var(--rs-border-strong);
	}
	.frag-overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(180deg, rgba(0, 0, 0, 0) 60%, rgba(0, 0, 0, 0.35) 100%);
	}
	.frag-tick {
		position: absolute;
		left: 5px;
		top: 5px;
		width: 4px;
		height: 4px;
		border-radius: 0.5px;
		transform: rotate(45deg);
		background: rgba(255, 255, 255, 0.6);
		transition: background 0.2s ease;
	}
	.row:hover .frag-tick {
		background: var(--rs-fg-accent);
	}

	.col-footer {
		padding: 14px 28px 20px;
		font-family: var(--font-mono-rs);
		font-size: 11px;
		color: var(--rs-fg-muted);
		letter-spacing: 0.06em;
		border-top: 1px solid var(--rs-rule);
	}
	.all-link {
		color: inherit;
	}

	@media (max-width: 768px) {
		.previews {
			display: flex;
			flex-direction: column;
		}
		.blog-cell {
			border-right: 0;
		}
		.filler {
			display: none;
		}
		.blog-cell.col-footer {
			border-bottom: 1px solid var(--rs-rule);
		}
	}
</style>
