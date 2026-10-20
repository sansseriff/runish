<script lang="ts">
	import { base } from '$app/paths';
	import PortfolioPage from '$lib/PortfolioPage.svelte';
</script>

<PortfolioPage
	title="The Invariant"
	eyebrow="Aerial short film"
	paragraphs={['An aerial short film featuring UC San Diego views and students.']}
	links={[{ label: 'YouTube', href: 'https://www.youtube.com/watch?v=1IA1IlqJJvA' }]}
	youtube={[{ id: '1IA1IlqJJvA', title: 'The Invariant - A UCSD Aerial Film' }]}
	images={[
		{ src: `${base}/portfolio/aerial/tricopter.avif`, alt: 'A camera tricopter', wide: true },
		{ src: `${base}/portfolio/aerial/tricopter-beach.avif`, alt: 'The tricopter on a beach' },
		{ src: `${base}/portfolio/aerial/tricopter-case.avif`, alt: 'The tricopter packed in its case' }
	]}
/>
