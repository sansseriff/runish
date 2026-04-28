<script lang="ts">
	import { posts, postsSorted, blogHref, formatDate } from '$lib/data/blog';

	const sorted = postsSorted();
</script>

<article class="blog-list">
	<header class="page-header">
		<div>
			<div class="eyebrow">Notes</div>
			<h1 class="page-title">From the desk.</h1>
		</div>
		<div class="meta">{posts.length} {posts.length === 1 ? 'entry' : 'entries'}</div>
	</header>

	{#each sorted as p, i}
		<a class="row" href={blogHref(p)}>
			<time class="date">{formatDate(p.date)}</time>
			<div class="row-body">
				<h3 class="row-title">{p.title}</h3>
				<p class="row-summary">{p.summary}</p>
			</div>
			<span class="tag">{p.tag}</span>
		</a>
		{#if i < sorted.length - 1}
			<div class="row-divider"></div>
		{/if}
	{/each}
</article>

<style>
	.blog-list {
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
	.meta {
		font-family: var(--font-mono-rs);
		font-size: 10px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--rs-fg-subtle);
	}

	.row {
		padding: 18px 28px;
		display: grid;
		grid-template-columns: 96px 1fr auto;
		gap: 18px;
		align-items: baseline;
		min-height: 84px;
		text-decoration: none;
		color: inherit;
		background-image: none;
		transition: background-color 0.18s ease;
	}
	.row:hover {
		background-color: var(--rs-bg-hover);
		background-size: 0 1px;
	}
	.row:hover .row-title {
		color: var(--rs-fg-accent);
	}
	.date {
		font-family: var(--font-mono-rs);
		font-size: 11px;
		color: var(--rs-fg-subtle);
		letter-spacing: 0.04em;
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
	.row-summary {
		font-family: var(--font-sans-rs);
		font-size: 13px;
		line-height: 1.55;
		margin: 0;
		color: var(--rs-fg-muted);
		max-width: 60ch;
	}
	.tag {
		font-family: var(--font-mono-rs);
		font-size: 10px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--rs-fg-subtle);
		align-self: start;
		padding-top: 4px;
	}
	.row-divider {
		margin: 0 28px;
		border-bottom: 1px solid var(--rs-rule);
	}

	@media (max-width: 640px) {
		.row {
			grid-template-columns: 1fr auto;
		}
		.date {
			grid-column: 1 / -1;
			margin-bottom: 4px;
		}
	}
</style>
