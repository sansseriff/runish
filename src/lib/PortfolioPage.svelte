<script lang="ts">
	import { base } from '$app/paths';

	// A simple project page: header, links, embedded videos and an image gallery.
	// Used by the portfolio entries until they get bespoke pages.

	interface Img {
		src: string;
		alt: string;
		caption?: string;
		/** Span both gallery columns. */
		wide?: boolean;
	}

	let {
		title,
		eyebrow,
		paragraphs = [],
		links = [],
		youtube = [],
		video,
		images = []
	}: {
		title: string;
		eyebrow: string;
		paragraphs?: string[];
		links?: { label: string; href: string }[];
		/** YouTube video ids, embedded in order. */
		youtube?: { id: string; title: string }[];
		video?: { src: string; caption?: string };
		images?: Img[];
	} = $props();
</script>

<svelte:head>
	<title>{title} · runi.sh</title>
</svelte:head>

<article class="pf">
	<header class="pf-header">
		<a class="crumb rs-flourish" href="{base}/portfolio">← Portfolio</a>
		<div class="eyebrow">{eyebrow}</div>
		<h1 class="pf-title">{title}</h1>
		{#each paragraphs as p}
			<p class="lede">{p}</p>
		{/each}
		{#if links.length}
			<div class="links">
				{#each links as l}
					<a class="link-btn" href={l.href} target="_blank" rel="noopener noreferrer">{l.label} ↗</a
					>
				{/each}
			</div>
		{/if}
	</header>

	{#if video}
		<figure class="embed-video">
			<video src={video.src} autoplay muted loop playsinline></video>
			{#if video.caption}
				<figcaption>{video.caption}</figcaption>
			{/if}
		</figure>
	{/if}

	{#each youtube as v}
		<div class="embed">
			<iframe
				src="https://www.youtube-nocookie.com/embed/{v.id}"
				title={v.title}
				loading="lazy"
				referrerpolicy="strict-origin-when-cross-origin"
				allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
				allowfullscreen
			></iframe>
		</div>
	{/each}

	{#if images.length}
		<section class="gallery">
			{#each images as img}
				<figure class:wide={img.wide}>
					<img src={img.src} alt={img.alt} loading="lazy" />
					{#if img.caption}
						<figcaption>{img.caption}</figcaption>
					{/if}
				</figure>
			{/each}
		</section>
	{/if}
</article>

<style>
	.pf {
		font-family: var(--font-sans-rs);
	}
	.pf-header {
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
	.pf-title {
		font-family: var(--font-serif-rs);
		font-weight: 500;
		font-size: 30px;
		letter-spacing: -0.015em;
		line-height: 1.15;
		color: var(--rs-fg-strong);
		margin: 0 0 12px;
	}
	.lede {
		margin: 0 0 10px;
		font-size: 15px;
		line-height: 1.6;
		color: var(--rs-fg-muted);
		max-width: 64ch;
	}
	.links {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-top: 16px;
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
	}
	.link-btn:hover {
		background: var(--rs-bg-hover);
	}

	.embed {
		padding: 24px 28px 0;
	}
	.embed iframe {
		display: block;
		width: 100%;
		aspect-ratio: 16 / 9;
		border: 1px solid var(--rs-border);
		border-radius: 2px;
	}
	.embed-video {
		margin: 0;
		padding: 24px 28px 0;
	}
	.embed-video video {
		display: block;
		width: 100%;
		border: 1px solid var(--rs-border);
		border-radius: 2px;
	}

	figure {
		margin: 0;
	}
	figcaption {
		font-size: 12px;
		line-height: 1.5;
		color: var(--rs-fg-subtle);
		margin-top: 8px;
	}
	.gallery {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 24px;
		padding: 24px 28px 40px;
		align-items: start;
	}
	.gallery figure.wide {
		grid-column: 1 / -1;
	}
	.gallery img {
		display: block;
		width: 100%;
		height: auto;
		margin: 0;
		border: 1px solid var(--rs-border);
		border-radius: 2px;
	}

	@media (max-width: 640px) {
		.gallery {
			grid-template-columns: 1fr;
		}
	}
</style>
