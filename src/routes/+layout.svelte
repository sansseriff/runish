<script lang="ts">
	import '../app.css';
	import { setContext } from 'svelte';
	import X from 'phosphor-svelte/lib/X';
	import Diamond from 'phosphor-svelte/lib/DiamondsFour';
	import BrandLockup from '$lib/BrandLockup.svelte';
	import ThemeChip from '$lib/ThemeChip.svelte';
	import SocialLink from '$lib/SocialLink.svelte';
	import { base } from '$app/paths';
	import { page } from '$app/state';

	let { children } = $props();
	let menuOpen = $state(false);
	let isDark = $state(false);
	let previousPath = $state(page.url.pathname);

	function applyDarkClass(dark: boolean) {
		if (typeof document === 'undefined') return;
		const root = document.documentElement;
		root.classList.remove('dark', 'light');
		root.classList.add(dark ? 'dark' : 'light');
	}

	function initTheme() {
		if (typeof window === 'undefined') return;
		const stored = localStorage.getItem('theme');
		if (stored === 'light' || stored === 'dark') {
			isDark = stored === 'dark';
			applyDarkClass(isDark);
			return;
		}
		isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		applyDarkClass(isDark);
	}

	$effect(() => {
		initTheme();
		if (typeof window !== 'undefined') {
			const mql = window.matchMedia('(prefers-color-scheme: dark)');
			const listener = () => {
				if (!localStorage.getItem('theme')) {
					isDark = mql.matches;
					applyDarkClass(isDark);
				}
			};
			mql.addEventListener('change', listener);
			return () => mql.removeEventListener('change', listener);
		}
	});

	function toggleTheme() {
		isDark = !isDark;
		localStorage.setItem('theme', isDark ? 'dark' : 'light');
		applyDarkClass(isDark);
	}

	function toggleMenu() {
		menuOpen = !menuOpen;
	}

	$effect(() => {
		if (typeof document === 'undefined') return;
		document.body.style.overflow = menuOpen ? 'hidden' : '';
	});

	$effect(() => {
		const current = page.url.pathname;
		if (current !== previousPath) {
			previousPath = current;
			if (menuOpen) menuOpen = false;
		}
	});

	const navItems = [
		{ label: 'Home', path: '/' },
		{ label: 'About', path: '/about' },
		{ label: 'Portfolio', path: '/portfolio' },
		{ label: 'Blog', path: '/blog' }
	];

	function isActive(path: string): boolean {
		const current = page.url.pathname;
		const target = `${base}${path}`;
		if (path === '/') return current === target || current === `${base}` || current === '/';
		return current === target || current.startsWith(`${target}/`);
	}

	const onPortfolio = $derived(page.url.pathname.startsWith(`${base}/portfolio`));

	setContext('rs-theme', {
		get isDark() {
			return isDark;
		},
		toggleTheme
	});
</script>

<main class="rs-shell">
	<!-- Mobile header -->
	<div class="mobile-header">
		<BrandLockup compact />
		<button onclick={toggleMenu} class="menu-btn" aria-label="Open menu">
			<Diamond size={22} weight={'regular'} />
		</button>
	</div>

	<div class="rs-shell-inner" class:portfolio-mode={onPortfolio}>
		<!-- Left sidebar -->
		<aside class="rs-left">
			<div class="brand-row">
				<BrandLockup />
			</div>
			<ul class="nav-list">
				{#each navItems as item}
					<li>
						<a
							href="{base}{item.path === '/' ? '/' : item.path}"
							class="nav-item"
							class:active={isActive(item.path)}
						>
							{item.label}
							{#if isActive(item.path)}
								<span class="active-marker" aria-hidden="true"></span>
							{/if}
						</a>
					</li>
				{/each}
			</ul>
		</aside>

		<!-- Main column -->
		<section class="rs-main rs-main-noise">
			{@render children()}
			<footer class="site-footer">
				<span>© {new Date().getFullYear()} · runi.sh · AM</span>
				<div class="footer-socials">
					<SocialLink platform="github" mode="text" />
					<SocialLink platform="bluesky" mode="text" />
					<SocialLink platform="instagram" mode="text" />
					<SocialLink platform="scholar" mode="text" />
				</div>
				<ThemeChip {isDark} onToggle={toggleTheme} mode="text" />
			</footer>
		</section>

		<!-- Right sidebar -->
		<aside class="rs-right">
			<div class="right-bottom">
				<div class="copyright">© {new Date().getFullYear()} · AM</div>
			</div>
		</aside>
	</div>

	<!-- Mobile bottom modal menu -->
	{#if menuOpen}
		<div
			class="m-overlay"
			role="button"
			tabindex="0"
			onclick={toggleMenu}
			onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleMenu()}
			aria-label="Close menu overlay"
		></div>
		<div class="m-panel">
			<div class="m-head">
				<h2 class="m-head-title">Menu</h2>
				<button onclick={toggleMenu} class="m-close" aria-label="Close menu">
					<X size={22} weight={'regular'} />
				</button>
			</div>
			<ul class="m-list">
				{#each navItems as item}
					<li>
						<a
							href="{base}{item.path === '/' ? '/' : item.path}"
							class="m-link"
							class:active={isActive(item.path)}
							onclick={() => (menuOpen = false)}
						>
							{item.label}
						</a>
					</li>
				{/each}
				<li class="m-theme-row">
					<ThemeChip {isDark} onToggle={toggleTheme} />
				</li>
			</ul>
		</div>
	{/if}
</main>

<style>
	.rs-shell {
		min-height: 100vh;
		background: var(--rs-bg);
		color: var(--rs-fg);
		font-family: var(--font-sans-rs);
	}

	.rs-shell-inner {
		--shell-default: min(1100px, 100vw);
		--shell-wide: min(2100px, 95vw);
		max-width: var(--shell-default);
		width: 100%;
		margin: 0 auto;
		display: flex;
		transition: max-width 700ms cubic-bezier(0.4, 0, 0.2, 1);
	}
	.rs-shell-inner.portfolio-mode {
		max-width: var(--shell-wide);
	}

	/* Mobile header */
	.mobile-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 14px 18px;
		border-bottom: 1px solid var(--rs-rule);
	}
	.menu-btn {
		background: transparent;
		border: 0;
		padding: 6px;
		color: var(--rs-fg-muted);
		cursor: pointer;
		border-radius: 2px;
	}
	.menu-btn:hover {
		color: var(--rs-fg-strong);
		background: var(--rs-bg-hover);
	}

	@media (min-width: 768px) {
		.mobile-header {
			display: none;
		}
	}

	/* Sidebars */
	.rs-left,
	.rs-right {
		display: none;
	}

	@media (min-width: 768px) {
		.rs-left {
			display: flex;
			flex-direction: column;
			width: 168px;
			flex: 0 0 168px;
			border-right: 1px solid var(--rs-rule);
			padding: 48px 0 24px;
			align-self: stretch;
			position: sticky;
			top: 0;
			min-height: 100vh;
		}
		.rs-right {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			width: 168px;
			flex: 0 0 168px;
			border-left: 1px solid var(--rs-rule);
			padding: 48px 18px 24px 12px;
			align-self: stretch;
			position: sticky;
			top: 0;
			min-height: 100vh;
		}
	}

	.brand-row {
		padding: 0 36px 28px 0;
		display: flex;
		justify-content: flex-end;
	}

	.nav-list {
		list-style: none;
		margin: 0;
		padding: 4px 18px 20px 0;
		display: flex;
		flex-direction: column;
		gap: 0;
	}

	.nav-item {
		display: inline-block;
		position: relative;
		font-family: var(--font-mono-rs);
		font-size: 11px;
		font-weight: 400;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--rs-fg-muted);
		text-decoration: none;
		padding: 10px 0;
		transition: color 0.18s ease;
		text-align: right;
		background-image: none;
	}
	.nav-list li {
		text-align: right;
	}
	.nav-item:hover {
		color: var(--rs-fg-strong);
		background-size: 0 1px;
	}
	.nav-item.active {
		color: var(--rs-fg-strong);
		font-weight: 600;
	}
	.active-marker {
		position: absolute;
		right: calc(100% + 8px);
		top: 50%;
		width: 6px;
		height: 6px;
		transform: translateY(-50%) rotate(45deg);
		background: var(--rs-fg-accent);
		border-radius: 1px;
	}

	.right-bottom {
		margin-top: auto;
		font-family: var(--font-mono-rs);
		font-size: 10px;
		color: var(--rs-fg-subtle);
		letter-spacing: 0.06em;
	}
	.copyright {
		color: var(--rs-fg-subtle);
	}

	/* Main column */
	.rs-main {
		flex: 1 1 auto;
		min-width: 0;
		position: relative;
		min-height: 100vh;
	}
	@media (min-width: 768px) {
		.rs-main {
			border-left: 1px solid var(--rs-rule);
			border-right: 1px solid var(--rs-rule);
		}
	}

	/* Paper noise texture — preserved from prior design for character */
	.rs-main-noise::before {
		content: '';
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-image: url('/shared/noise.0e24d0e5.png');
		background-size: 180px;
		background-repeat: repeat;
		opacity: 0.04;
		pointer-events: none;
		z-index: 2;
	}
	:global(html.dark) .rs-main-noise::before {
		opacity: 0.05;
	}
	.rs-main > :global(*) {
		position: relative;
		z-index: 1;
	}

	.site-footer {
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
		border-top: 1px solid var(--rs-rule);
	}
	.footer-socials {
		display: flex;
		gap: 16px;
		align-items: center;
	}

	/* Mobile bottom modal menu */
	.m-overlay {
		position: fixed;
		inset: 0;
		z-index: 40;
		backdrop-filter: blur(6px);
		background: rgba(0, 0, 0, 0.2);
	}
	.m-panel {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 50;
		background: var(--rs-bg);
		border-top: 1px solid var(--rs-rule);
		box-shadow: var(--rs-shadow-2);
	}
	.m-head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 14px 18px;
		border-bottom: 1px solid var(--rs-rule);
	}
	.m-head-title {
		font-family: var(--font-sans-rs);
		font-weight: 600;
		font-size: 14px;
		margin: 0;
		color: var(--rs-fg-strong);
	}
	.m-close {
		background: transparent;
		border: 0;
		padding: 6px;
		color: var(--rs-fg-muted);
		cursor: pointer;
	}
	.m-list {
		list-style: none;
		margin: 0;
		padding: 8px 18px 20px;
	}
	.m-list li {
		padding: 0;
		border-bottom: 1px solid var(--rs-rule);
	}
	.m-list li:last-child {
		border-bottom: 0;
	}
	.m-link {
		display: block;
		padding: 14px 0;
		font-family: var(--font-mono-rs);
		font-size: 12px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--rs-fg-muted);
		text-decoration: none;
		background-image: none;
	}
	.m-link.active {
		color: var(--rs-fg-strong);
		font-weight: 600;
	}
	.m-theme-row {
		padding: 14px 0 0;
		border-bottom: 0 !important;
	}

	:global(.theme-color) {
		color: currentColor;
	}
	:global(.theme-color):hover {
		color: var(--rs-fg-accent);
	}
</style>
