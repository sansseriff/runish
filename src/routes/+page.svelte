<script lang="ts">
	import { getContext } from 'svelte';
	import HomeHero from '$lib/HomeHero.svelte';
	import PreviewsGrid from '$lib/PreviewsGrid.svelte';

	const theme = getContext<{ isDark: boolean; toggleTheme: () => void }>('rs-theme');
	const isDark = $derived(theme.isDark);
</script>

<article class="home">
	<HomeHero {isDark} onToggleTheme={theme.toggleTheme} preset="plasma" density={0.8} speed={0.35} accent={0.36} />
	<PreviewsGrid />
</article>

<style>
	.home {
		display: flex;
		flex-direction: column;
	}
</style>
