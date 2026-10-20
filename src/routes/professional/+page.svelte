<script lang="ts">
	import { getContext } from 'svelte';
	import { base } from '$app/paths';
	import HomeHero from '$lib/HomeHero.svelte';
	import ThemedImage from '$lib/ThemedImage.svelte';
	import { work, workHref, cardImage } from '$lib/data/work';
	import { cvPdf } from '$lib/data/cv';

	const theme = getContext<{ isDark: boolean; toggleTheme: () => void }>('rs-theme');
	const isDark = $derived(theme.isDark);

	const featured = work.filter((w) => w.featured);
</script>

<svelte:head>
	<title>Andrew Mueller · Physicist and software engineer</title>
	<meta
		name="description"
		content="Andrew Mueller: postdoctoral scholar at NASA JPL building superconducting detector instrumentation, lab software, and tools for explaining science."
	/>
</svelte:head>

<article class="pro-home">
	<HomeHero
		{isDark}
		onToggleTheme={theme.toggleTheme}
		preset="plasma"
		density={0.8}
		speed={0.35}
		accent={0.36}
		kicker="Physicist · Software engineer"
		title="Andrew Mueller"
		lede="Postdoctoral scholar at NASA JPL’s Microdevices Laboratory. I build instrumentation for superconducting single-photon detectors, the software that runs the lab, and a new tool for explaining how physical systems work."
	>
		{#snippet actions()}
			<div class="cta-row">
				<a class="cta primary" href="{base}/professional/work">Selected work →</a>
				<a class="cta" href="{base}/professional/cv">CV</a>
				<a class="cta" href="https://snsphd.online" target="_blank" rel="noopener noreferrer"
					>PhD thesis ↗</a
				>
				<a
					class="cta"
					href="https://github.com/sansseriff"
					target="_blank"
					rel="noopener noreferrer">GitHub ↗</a
				>
			</div>
		{/snippet}
	</HomeHero>

	<section class="featured">
		<header class="sec-header">
			<div>
				<div class="eyebrow">Selected work</div>
				<h2 class="sec-title">Recent projects</h2>
			</div>
			<a class="sec-link rs-flourish" href="{base}/professional/work">All work →</a>
		</header>

		<div class="cards">
			{#each featured as w}
				<a class="card" href={workHref(w)}>
					<span class="card-frame">
						<ThemedImage
							src={cardImage(w).src}
							srcDark={cardImage(w).srcDark}
							alt={cardImage(w).alt}
							class="card-img"
						/>
					</span>
					<span class="card-meta">{w.years}</span>
					<h3 class="card-title">{w.title}</h3>
					<p class="card-text">{w.tagline}</p>
				</a>
			{/each}
		</div>
	</section>

	<section class="split">
		<div class="col">
			<div class="eyebrow">Now</div>
			<ul class="facts">
				<li>
					<strong>Postdoctoral scholar, JPL Microdevices Laboratory.</strong> Readout and interconnects
					for large superconducting detector arrays; mid-infrared detector testing; measurement software
					for the lab.
				</li>
				<li>
					<strong>Recent talk:</strong>
					<a href="{base}/professional/work/asc-2026"
						>Measurement infrastructure for mid- to far-infrared SNSPDs</a
					>, Applied Superconductivity Conference, Sept 2026.
				</li>
				<li>
					<strong>Building:</strong>
					<a href="{base}/professional/work/ironfell">Ironfell</a>, an editor for explaining
					science, in Rust and WebAssembly.
				</li>
			</ul>
		</div>
		<div class="col">
			<div class="eyebrow">Background</div>
			<ul class="facts">
				<li>
					<strong>PhD, Applied Physics, Caltech</strong> (2024). Advised by Maria Spiropulu and Matthew
					Shaw.
				</li>
				<li><strong>BS, Physics, UC San Diego</strong> (2017).</li>
				<li>Cover artwork for <em>Nature</em> 612 (2022).</li>
				<li>
					<a href={cvPdf} download>Download CV (PDF)</a> ·
					<a href="mailto:andrewstermueller@gmail.com">andrewstermueller@gmail.com</a>
				</li>
			</ul>
		</div>
	</section>
</article>

<style>
	.pro-home {
		display: flex;
		flex-direction: column;
		font-family: var(--font-sans-rs);
	}

	.cta-row {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}
	.cta {
		font-family: var(--font-mono-rs);
		font-size: 11px;
		letter-spacing: 0.06em;
		padding: 7px 13px;
		border: 1px solid var(--rs-border-strong);
		border-radius: 2px;
		color: var(--rs-fg-strong);
		background: color-mix(in srgb, var(--rs-bg) 70%, transparent);
		text-decoration: none;
		background-image: none;
		transition:
			background 0.18s ease,
			border-color 0.18s ease;
	}
	.cta:hover {
		background: var(--rs-bg-hover);
		border-color: var(--rs-fg-muted);
	}
	.cta.primary {
		background: var(--rs-fg-strong);
		border-color: var(--rs-fg-strong);
		color: var(--rs-bg);
	}
	.cta.primary:hover {
		background: var(--rs-fg-accent);
		border-color: var(--rs-fg-accent);
	}

	.eyebrow {
		font-family: var(--font-mono-rs);
		font-size: 11px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--rs-fg-subtle);
		margin-bottom: 4px;
	}

	.featured {
		border-bottom: 1px solid var(--rs-rule);
	}
	.sec-header {
		padding: 24px 28px 14px;
		border-bottom: 1px solid var(--rs-rule);
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 14px;
	}
	.sec-title {
		font-family: var(--font-serif-rs);
		font-weight: 500;
		font-size: 18px;
		letter-spacing: -0.01em;
		color: var(--rs-fg-strong);
		margin: 0;
	}
	.sec-link {
		font-family: var(--font-mono-rs);
		font-size: 11px;
		letter-spacing: 0.06em;
		color: var(--rs-fg-muted);
		text-decoration: none;
	}

	.cards {
		display: grid;
		grid-template-columns: 1fr 1fr;
	}
	.card {
		display: flex;
		flex-direction: column;
		padding: 22px 28px 26px;
		text-decoration: none;
		color: inherit;
		background-image: none;
		border-bottom: 1px solid var(--rs-rule);
		transition: background-color 0.18s ease;
	}
	.card:nth-child(odd) {
		border-right: 1px solid var(--rs-rule);
	}
	.card:nth-last-child(-n + 2):nth-child(odd),
	.card:nth-last-child(-n + 2):nth-child(odd) ~ .card {
		border-bottom: 0;
	}
	.card:hover {
		background-color: var(--rs-bg-hover);
		background-size: 0 1px;
	}
	.card-frame {
		display: block;
		aspect-ratio: 16 / 10;
		border: 1px solid var(--rs-border);
		border-radius: 2px;
		overflow: hidden;
		margin-bottom: 14px;
		background: var(--rs-bg-raised);
		transition:
			box-shadow 0.2s ease,
			border-color 0.2s ease;
	}
	.card:hover .card-frame {
		box-shadow: var(--rs-shadow-1);
		border-color: var(--rs-border-strong);
	}
	.card-frame :global(.card-img) {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: top left;
		margin: 0;
	}
	.card-meta {
		font-family: var(--font-mono-rs);
		font-size: 10px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--rs-fg-subtle);
		margin-bottom: 4px;
	}
	.card-title {
		font-family: var(--font-serif-rs);
		font-weight: 500;
		font-size: 18px;
		letter-spacing: -0.01em;
		line-height: 1.25;
		color: var(--rs-fg-strong);
		margin: 0 0 6px;
		transition: color 0.18s ease;
	}
	.card:hover .card-title {
		color: var(--rs-fg-accent);
	}
	.card-text {
		font-size: 13px;
		line-height: 1.55;
		color: var(--rs-fg-muted);
		margin: 0;
	}

	.split {
		display: grid;
		grid-template-columns: 1fr 1fr;
		border-bottom: 1px solid var(--rs-rule);
	}
	.split .col {
		padding: 24px 28px 26px;
	}
	.split .col:first-child {
		border-right: 1px solid var(--rs-rule);
	}
	.facts {
		list-style: none;
		margin: 10px 0 0;
		padding: 0;
	}
	.facts li {
		font-size: 13px;
		line-height: 1.6;
		color: var(--rs-fg-muted);
		margin: 0 0 12px;
	}
	.facts strong {
		color: var(--rs-fg-strong);
		font-weight: 600;
	}
	.facts a {
		color: var(--rs-fg-strong);
	}
	.facts a:hover {
		color: var(--rs-fg-accent);
	}

	@media (max-width: 768px) {
		.cards,
		.split {
			grid-template-columns: 1fr;
		}
		.card:nth-child(odd),
		.split .col:first-child {
			border-right: 0;
		}
		.card:nth-last-child(-n + 2):nth-child(odd) {
			border-bottom: 1px solid var(--rs-rule);
		}
		.split .col:first-child {
			border-bottom: 1px solid var(--rs-rule);
		}
	}
</style>
