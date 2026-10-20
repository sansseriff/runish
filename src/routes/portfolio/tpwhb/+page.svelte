<script lang="ts">
	import { base } from '$app/paths';
	import PortfolioPage from '$lib/PortfolioPage.svelte';
</script>

<PortfolioPage
	title="The Places We Have Been"
	eyebrow="Aerial short film"
	paragraphs={['My first aerial short film, which got a lot of attention around campus.']}
	links={[
		{ label: 'YouTube', href: 'https://www.youtube.com/watch?v=gV_9W-IuCjw' },
		{ label: 'Tricopter FPV – Beginnings', href: 'https://www.youtube.com/watch?v=n0nlsfPtAkE' }
	]}
	youtube={[{ id: 'gV_9W-IuCjw', title: 'The Places We Have Been' }]}
	images={[
		{ src: `${base}/portfolio/aerial/tricopter.avif`, alt: 'A camera tricopter', wide: true }
	]}
/>
