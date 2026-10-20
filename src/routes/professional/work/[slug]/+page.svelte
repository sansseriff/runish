<script lang="ts">
	import { base } from '$app/paths';
	import ThemedImage from '$lib/ThemedImage.svelte';
	import Lightbox from '$lib/Lightbox.svelte';
	import { groupLabels } from '$lib/data/work';

	let { data } = $props();
	const w = $derived(data.entry);
	const hero = $derived(w.images[0]);
	const gallery = $derived(w.images.slice(1));
	let zoomed = $state<number | null>(null);
</script>

<svelte:head>
	<title>{w.title} · Andrew Mueller</title>
	<meta name="description" content={w.tagline} />
</svelte:head>

<article class="work-detail">
	<header class="page-header">
		<a class="crumb rs-flourish" href="{base}/professional/work">← Work</a>
		<div class="eyebrow">{groupLabels[w.group].eyebrow} · {w.years}</div>
		<h1 class="page-title">{w.title}</h1>
		<p class="lede">{w.tagline}</p>
		{#if w.links.length}
			<div class="links">
				{#each w.links as l}
					<a class="link-btn" href={l.href} target="_blank" rel="noopener noreferrer">{l.label} ↗</a
					>
				{/each}
			</div>
		{/if}
	</header>

	<figure class="hero">
		<ThemedImage
			src={hero.src}
			srcDark={hero.srcDark}
			alt={hero.alt}
			class="hero-img"
			loading="eager"
		/>
		{#if hero.caption}
			<figcaption>{hero.caption}</figcaption>
		{/if}
	</figure>

	<div class="content">
		<div class="body">
			{#each w.body as para}
				<p>{para}</p>
			{/each}

			{#if w.highlights.length}
				<h2 class="sub">Highlights</h2>
				<ul class="highlights">
					{#each w.highlights as h}
						<li>{h}</li>
					{/each}
				</ul>
			{/if}
		</div>

		<aside class="facts">
			<dl>
				<dt>Role</dt>
				<dd>{w.role}</dd>
				<dt>When</dt>
				<dd>{w.years}</dd>
				{#if w.stack.length}
					<dt>Stack</dt>
					<dd>
						<ul class="stack">
							{#each w.stack as s}
								<li>{s}</li>
							{/each}
						</ul>
					</dd>
				{/if}
			</dl>
		</aside>
	</div>

	{#if gallery.length}
		<section class="gallery">
			{#each gallery as g, i}
				<figure>
					<button class="zoom" onclick={() => (zoomed = i)} aria-label="Enlarge: {g.alt}">
						<ThemedImage src={g.src} srcDark={g.srcDark} alt={g.alt} class="gallery-img" />
					</button>
					{#if g.caption}
						<figcaption>{g.caption}</figcaption>
					{/if}
				</figure>
			{/each}
		</section>
		<Lightbox images={gallery} bind:index={zoomed} />
	{/if}
</article>

<style>
	.work-detail {
		display: flex;
		flex-direction: column;
		font-family: var(--font-sans-rs);
	}

	.page-header {
		padding: 32px 28px 24px;
		border-bottom: 1px solid var(--rs-rule);
	}
	.crumb {
		display: inline-block;
		font-family: var(--font-mono-rs);
		font-size: 11px;
		letter-spacing: 0.06em;
		color: var(--rs-fg-subtle);
		text-decoration: none;
		margin-bottom: 18px;
	}
	.crumb:hover {
		color: var(--rs-fg-strong);
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
		font-size: 30px;
		letter-spacing: -0.015em;
		line-height: 1.15;
		color: var(--rs-fg-strong);
		margin: 0;
	}
	.lede {
		margin: 12px 0 0;
		font-size: 15px;
		color: var(--rs-fg-muted);
		max-width: 62ch;
		line-height: 1.55;
	}
	.links {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-top: 18px;
	}
	.link-btn {
		font-family: var(--font-mono-rs);
		font-size: 11px;
		letter-spacing: 0.04em;
		padding: 6px 12px;
		border: 1px solid var(--rs-border-strong);
		border-radius: 2px;
		color: var(--rs-fg-strong);
		text-decoration: none;
		background-image: none;
		transition:
			background 0.18s ease,
			border-color 0.18s ease;
	}
	.link-btn:hover {
		background: var(--rs-bg-hover);
		border-color: var(--rs-fg-muted);
	}

	figure {
		margin: 0;
	}
	figcaption {
		font-size: 12px;
		line-height: 1.5;
		color: var(--rs-fg-subtle);
		margin-top: 8px;
		max-width: 70ch;
	}
	.hero {
		padding: 24px 28px;
		border-bottom: 1px solid var(--rs-rule);
	}
	.hero :global(.hero-img),
	.gallery :global(.gallery-img) {
		width: 100%;
		height: auto;
		border: 1px solid var(--rs-border);
		border-radius: 2px;
		margin: 0;
	}

	.content {
		display: grid;
		grid-template-columns: 1fr 200px;
		gap: 32px;
		padding: 28px 28px 32px;
		border-bottom: 1px solid var(--rs-rule);
	}
	.body p {
		font-size: 15px;
		line-height: 1.65;
		color: var(--rs-fg);
		margin: 0 0 14px;
		max-width: 64ch;
	}
	.sub {
		font-family: var(--font-mono-rs);
		font-size: 11px;
		font-weight: 400;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--rs-fg-subtle);
		margin: 26px 0 10px;
	}
	.highlights {
		margin: 0;
		padding: 0;
		list-style: none;
		max-width: 64ch;
	}
	.highlights li {
		position: relative;
		padding-left: 18px;
		margin: 0 0 10px;
		font-size: 14px;
		line-height: 1.6;
		color: var(--rs-fg);
	}
	.highlights li::before {
		content: '';
		position: absolute;
		left: 2px;
		top: 0.62em;
		width: 5px;
		height: 5px;
		border-radius: 1px;
		transform: rotate(45deg);
		background: var(--rs-fg-accent);
	}

	.facts dl {
		margin: 0;
	}
	.facts dt {
		font-family: var(--font-mono-rs);
		font-size: 10px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--rs-fg-subtle);
		margin: 0 0 4px;
	}
	.facts dd {
		margin: 0 0 18px;
		font-size: 13px;
		line-height: 1.5;
		color: var(--rs-fg);
	}
	.stack {
		list-style: none;
		margin: 0;
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

	.zoom {
		display: block;
		width: 100%;
		padding: 0;
		border: 0;
		background: none;
		cursor: zoom-in;
	}
	.zoom :global(.gallery-img) {
		transition:
			box-shadow 0.2s ease,
			border-color 0.2s ease;
	}
	.zoom:hover :global(.gallery-img) {
		box-shadow: var(--rs-shadow-1);
		border-color: var(--rs-border-strong);
	}
	.gallery {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 24px;
		padding: 28px 28px 40px;
	}

	@media (max-width: 760px) {
		.content {
			grid-template-columns: 1fr;
		}
		.zoom {
			display: block;
			width: 100%;
			padding: 0;
			border: 0;
			background: none;
			cursor: zoom-in;
		}
		.zoom :global(.gallery-img) {
			transition:
				box-shadow 0.2s ease,
				border-color 0.2s ease;
		}
		.zoom:hover :global(.gallery-img) {
			box-shadow: var(--rs-shadow-1);
			border-color: var(--rs-border-strong);
		}
		.gallery {
			grid-template-columns: 1fr;
		}
	}
</style>
