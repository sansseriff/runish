<script lang="ts">
	import HomeHero from '$lib/HomeHero.svelte';
	import PreviewsGrid from '$lib/PreviewsGrid.svelte';

	let isDark = $state(false);

	$effect(() => {
		if (typeof document === 'undefined') return;
		const root = document.documentElement;
		const update = () => {
			isDark = root.classList.contains('dark');
		};
		update();
		const obs = new MutationObserver(update);
		obs.observe(root, { attributes: true, attributeFilter: ['class'] });
		return () => obs.disconnect();
	});

	function toggleTheme() {
		const root = document.documentElement;
		const next = !root.classList.contains('dark');
		root.classList.remove('dark', 'light');
		root.classList.add(next ? 'dark' : 'light');
		localStorage.setItem('theme', next ? 'dark' : 'light');
		isDark = next;
	}
</script>

<article class="home">
	<HomeHero {isDark} preset="plasma" density={0.8} speed={0.35} accent={0.36} onToggleTheme={toggleTheme} />
	<PreviewsGrid />
	<footer class="home-footer">
		<span>© {new Date().getFullYear()} · runi.sh · AM</span>
		<span class="hint">mildly mystical, mostly scientific</span>
	</footer>
</article>

<style>
	.home {
		display: flex;
		flex-direction: column;
	}
	.home-footer {
		padding: 18px 28px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		flex-wrap: wrap;
		font-family: var(--font-mono-rs);
		font-size: 11px;
		color: var(--rs-fg-subtle);
		letter-spacing: 0.06em;
	}
</style>
