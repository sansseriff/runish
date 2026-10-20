<script lang="ts">
	import { getContext } from 'svelte';
	import HomeHero from '$lib/HomeHero.svelte';
	import type { Preset } from '$lib/shaders';

	// Temporary page for choosing hero shaders. Not linked from the nav.
	const theme = getContext<{ isDark: boolean; toggleTheme: () => void }>('rs-theme');
	const isDark = $derived(theme.isDark);

	const candidates: { preset: Preset; note: string }[] = [
		{ preset: 'plasma', note: 'Current default: contour map over a dot grid.' },
		{ preset: 'pulsar', note: 'Stacked pulse profiles (Unknown Pleasures). Mouse raises a peak.' },
		{
			preset: 'waves',
			note: 'Ripple tank: crest rings of three drifting sources; where two crests cross, it lights up.'
		},
		{
			preset: 'nanowire',
			note: 'Detector array; photon hits spread along the wires. Mouse is a light source.'
		},
		{ preset: 'field', note: 'Field lines and dashed equipotentials of four drifting charges.' }
	];
</script>

<svelte:head>
	<title>Shader lab</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<article class="lab">
	<header class="lab-header">
		<h1>Shader lab</h1>
		<p>
			Each candidate in the real hero, with the main page's settings. Move the mouse over one and
			click to send a pulse. The theme toggle in any hero switches all of them.
		</p>
	</header>

	{#each candidates as c}
		<section class="candidate">
			<HomeHero
				{isDark}
				onToggleTheme={theme.toggleTheme}
				preset={c.preset}
				density={0.8}
				speed={0.35}
				accent={0.36}
				kicker={c.preset}
				lede={c.note}
			/>
		</section>
	{/each}
</article>

<style>
	.lab-header {
		padding: 32px 28px 20px;
		border-bottom: 1px solid var(--rs-rule);
		font-family: var(--font-sans-rs);
	}
	.lab-header h1 {
		font-family: var(--font-serif-rs);
		font-weight: 500;
		font-size: 24px;
		color: var(--rs-fg-strong);
		margin: 0 0 8px;
	}
	.lab-header p {
		margin: 0;
		font-size: 13px;
		color: var(--rs-fg-muted);
		max-width: 60ch;
	}
	.candidate {
		border-bottom: 6px solid var(--rs-rule);
	}
</style>
