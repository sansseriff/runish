<script lang="ts">
	import DownloadSimple from 'phosphor-svelte/lib/DownloadSimple';
	import Printer from 'phosphor-svelte/lib/Printer';
	import {
		contact,
		cvPdf,
		education,
		experience,
		publications,
		doiHref,
		talks,
		skills,
		awards
	} from '$lib/data/cv';
</script>

<svelte:head>
	<title>CV · Andrew Mueller</title>
</svelte:head>

<article class="cv">
	<header class="cv-header">
		<div>
			<div class="eyebrow">Curriculum vitae</div>
			<h1 class="name">{contact.name}</h1>
			<p class="contact">
				<a href="mailto:{contact.email}">{contact.email}</a>
				{#each contact.links as l}
					<span class="sep">·</span>
					<a href={l.href} target="_blank" rel="noopener noreferrer">{l.label}</a>
				{/each}
			</p>
		</div>
		<div class="actions no-print">
			<a class="btn" href={cvPdf} download>
				<DownloadSimple size={14} /> PDF
			</a>
			<button class="btn" type="button" onclick={() => window.print()}>
				<Printer size={14} /> Print
			</button>
		</div>
	</header>

	<section class="block">
		<h2 class="block-title">Experience</h2>
		{#each experience as r}
			<div class="entry">
				<div class="entry-head">
					<div>
						<h3 class="entry-title">{r.title}</h3>
						<div class="entry-org">{r.org}</div>
					</div>
					<div class="when">{r.when}</div>
				</div>
				<ul class="bullets">
					{#each r.bullets as b}
						{#if typeof b === 'string'}
							<li>{b}</li>
						{:else}
							<li>
								{b.text}
								<ul>
									{#each b.sub as s}
										<li>{s}</li>
									{/each}
								</ul>
							</li>
						{/if}
					{/each}
				</ul>
			</div>
		{/each}
	</section>

	<section class="block">
		<h2 class="block-title">Education</h2>
		{#each education as e}
			<div class="entry">
				<div class="entry-head">
					<div>
						<h3 class="entry-title">{e.degree}</h3>
						<div class="entry-org">{e.school}</div>
					</div>
					<div class="when">{e.when}</div>
				</div>
				<ul class="bullets plain">
					{#each e.details as d}
						<li>{d}</li>
					{/each}
				</ul>
			</div>
		{/each}
	</section>

	<section class="block">
		<h2 class="block-title">Selected publications</h2>
		<ol class="pubs">
			{#each publications as p}
				<li>
					<a class="pub-title" href={doiHref(p.doi)} target="_blank" rel="noopener noreferrer"
						>{p.title}.</a
					>
					<span class="pub-authors">{p.authors.replace(/\.$/, '')}.</span>
					<span class="pub-venue">{p.venue}</span>
					<a class="pub-doi" href={doiHref(p.doi)} target="_blank" rel="noopener noreferrer"
						>doi:{p.doi}</a
					>
				</li>
			{/each}
		</ol>
		<p class="note">
			More on <a href={contact.links[1].href} target="_blank" rel="noopener noreferrer"
				>Google Scholar</a
			>.
		</p>
	</section>

	<section class="block">
		<h2 class="block-title">Talks</h2>
		{#each talks as t}
			<div class="entry-head">
				<div>
					<h3 class="entry-title"><a href={t.href}>{t.title}</a></h3>
					<div class="entry-org">{t.venue}</div>
				</div>
				<div class="when">{t.when}</div>
			</div>
		{/each}
	</section>

	<section class="block">
		<h2 class="block-title">Skills</h2>
		<dl class="skills">
			{#each skills as s}
				<dt>{s.area}</dt>
				<dd>{s.items}</dd>
			{/each}
		</dl>
	</section>

	<section class="block">
		<h2 class="block-title">Awards and fellowships</h2>
		<ul class="bullets plain">
			{#each awards as a}
				<li>{a.name} <span class="when-inline">({a.when})</span></li>
			{/each}
		</ul>
	</section>
</article>

<style>
	.cv {
		font-family: var(--font-sans-rs);
		color: var(--rs-fg);
	}
	.cv a {
		color: inherit;
	}

	.cv-header {
		padding: 40px 28px 22px;
		border-bottom: 1px solid var(--rs-rule);
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 18px;
		flex-wrap: wrap;
	}
	.eyebrow {
		font-family: var(--font-mono-rs);
		font-size: 11px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--rs-fg-subtle);
		margin-bottom: 6px;
	}
	.name {
		font-family: var(--font-serif-rs);
		font-weight: 500;
		font-size: 32px;
		letter-spacing: -0.015em;
		color: var(--rs-fg-strong);
		margin: 0;
	}
	.contact {
		margin: 10px 0 0;
		font-size: 13px;
		color: var(--rs-fg-muted);
	}
	.contact a {
		text-decoration: none;
	}
	.contact a:hover {
		color: var(--rs-fg-accent);
	}
	.sep {
		margin: 0 6px;
		color: var(--rs-fg-subtle);
	}
	.actions {
		display: flex;
		gap: 8px;
	}
	.btn {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-family: var(--font-mono-rs);
		font-size: 11px;
		letter-spacing: 0.04em;
		padding: 6px 12px;
		border: 1px solid var(--rs-border-strong);
		border-radius: 2px;
		background: transparent;
		color: var(--rs-fg-strong) !important;
		text-decoration: none;
		background-image: none;
		cursor: pointer;
	}
	.btn:hover {
		background: var(--rs-bg-hover);
	}

	.block {
		padding: 24px 28px 18px;
		border-bottom: 1px solid var(--rs-rule);
	}
	.block-title {
		font-family: var(--font-mono-rs);
		font-size: 11px;
		font-weight: 400;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--rs-fg-subtle);
		margin: 0 0 16px;
	}
	.entry {
		margin-bottom: 20px;
	}
	.entry-head {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 16px;
		margin-bottom: 8px;
	}
	.entry-title {
		font-family: var(--font-serif-rs);
		font-weight: 500;
		font-size: 17px;
		letter-spacing: -0.01em;
		color: var(--rs-fg-strong);
		margin: 0;
	}
	.entry-title a {
		text-decoration: none;
	}
	.entry-title a:hover {
		color: var(--rs-fg-accent);
	}
	.entry-org {
		font-size: 13px;
		color: var(--rs-fg-muted);
		margin-top: 2px;
	}
	.when {
		font-family: var(--font-mono-rs);
		font-size: 11px;
		letter-spacing: 0.04em;
		color: var(--rs-fg-subtle);
		white-space: nowrap;
		text-align: right;
	}
	.when-inline {
		color: var(--rs-fg-subtle);
	}
	.bullets {
		margin: 0;
		padding-left: 18px;
		font-size: 14px;
		line-height: 1.6;
		max-width: 72ch;
	}
	.bullets li {
		margin: 0 0 4px;
	}
	.bullets ul {
		margin: 4px 0 0;
		padding-left: 18px;
		color: var(--rs-fg-muted);
		font-size: 13px;
	}
	.bullets.plain {
		list-style: none;
		padding-left: 0;
	}

	.pubs {
		margin: 0;
		padding-left: 20px;
		font-size: 13px;
		line-height: 1.55;
		max-width: 80ch;
	}
	.pubs li {
		margin-bottom: 10px;
	}
	.pub-title {
		color: var(--rs-fg-strong);
		font-weight: 500;
		text-decoration: none;
		background-image: none;
		transition: color 0.18s ease;
	}
	.pub-title:hover {
		color: var(--rs-fg-accent);
		text-decoration: underline;
		text-underline-offset: 2px;
	}
	.pub-doi {
		margin-left: 6px;
		font-family: var(--font-mono-rs);
		font-size: 11px;
		color: var(--rs-fg-subtle) !important;
		text-decoration: none;
		white-space: nowrap;
	}
	.pub-doi:hover {
		color: var(--rs-fg-accent) !important;
	}
	.pub-authors {
		color: var(--rs-fg-muted);
	}
	.pub-venue {
		font-style: italic;
		color: var(--rs-fg-muted);
	}
	.note {
		font-size: 13px;
		color: var(--rs-fg-muted);
		margin: 4px 0 0;
	}

	.skills {
		display: grid;
		grid-template-columns: 170px 1fr;
		gap: 8px 18px;
		margin: 0;
		font-size: 14px;
		line-height: 1.55;
	}
	.skills dt {
		color: var(--rs-fg-strong);
		font-weight: 500;
	}
	.skills dd {
		margin: 0;
		max-width: 64ch;
	}

	@media (max-width: 640px) {
		.entry-head {
			flex-direction: column;
			gap: 2px;
		}
		.when {
			text-align: left;
		}
		.skills {
			grid-template-columns: 1fr;
			gap: 2px;
		}
		.skills dd {
			margin-bottom: 10px;
		}
	}

	@media print {
		.no-print {
			display: none !important;
		}
		.cv-header {
			padding-top: 0;
		}
		.block {
			padding: 14px 0 10px;
		}
		.cv-header {
			padding-left: 0;
			padding-right: 0;
		}
		.entry {
			break-inside: avoid;
		}
	}
</style>
