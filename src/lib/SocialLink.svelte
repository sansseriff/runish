<script lang="ts" module>
	export type SocialPlatform = 'github' | 'bluesky' | 'instagram' | 'scholar';
	export type SocialMode = 'text' | 'icon';

	interface SocialMeta {
		href: string;
		label: string;
		text: string;
	}

	export const socials: Record<SocialPlatform, SocialMeta> = {
		github: {
			href: 'https://github.com/sansseriff',
			label: 'GitHub',
			text: 'gh'
		},
		bluesky: {
			href: 'https://bsky.app/profile/sansseriff.bsky.social',
			label: 'Bluesky',
			text: 'bsky'
		},
		instagram: {
			href: 'https://www.instagram.com/andstermueller/',
			label: 'Instagram',
			text: 'ig'
		},
		scholar: {
			href: 'https://scholar.google.com/citations?user=FRQbz4sAAAAJ&hl=en',
			label: 'Google Scholar',
			text: 'edu'
		}
	};
</script>

<script lang="ts">
	import GithubLogo from 'phosphor-svelte/lib/GithubLogo';
	import GraduationCap from 'phosphor-svelte/lib/GraduationCap';
	import InstagramLogo from 'phosphor-svelte/lib/InstagramLogo';
	import BlueSkyLogo from '$lib/BlueSkyLogo.svelte';

	let {
		platform,
		mode = 'text',
		size = 20
	}: { platform: SocialPlatform; mode?: SocialMode; size?: number } = $props();

	const meta = $derived(socials[platform]);
</script>

<a
	href={meta.href}
	aria-label={meta.label}
	title={meta.label}
	class="social-link"
	class:text-mode={mode === 'text'}
	class:icon-mode={mode === 'icon'}
	class:rs-flourish={mode === 'text'}
	target="_blank"
	rel="noopener noreferrer"
>
	{#if mode === 'text'}
		<span aria-hidden="true">[{meta.text}]</span>
	{:else if platform === 'github'}
		<GithubLogo {size} weight={'regular'} />
	{:else if platform === 'bluesky'}
		<BlueSkyLogo cls="bsky-themed" />
	{:else if platform === 'instagram'}
		<InstagramLogo {size} weight={'regular'} />
	{:else if platform === 'scholar'}
		<GraduationCap {size} weight={'regular'} />
	{/if}
</a>

<style>
	.social-link {
		color: inherit;
		text-decoration: none;
		display: inline-flex;
		align-items: center;
		transition: color 0.18s ease;
	}
	.icon-mode {
		background-image: none;
	}
	.social-link:hover {
		color: var(--rs-fg-accent);
	}
	.text-mode {
		font-family: var(--font-mono-rs);
		font-size: 11px;
		letter-spacing: 0.04em;
		opacity: 0.9;
	}
	.text-mode:hover {
		opacity: 1;
	}
	:global(.bsky-themed) {
		color: currentColor;
	}
</style>
