<script lang="ts">
	import { base } from '$app/paths';
	import PortfolioPage from '$lib/PortfolioPage.svelte';

	const img = (f: string) => `${base}/portfolio/wormhole/${f}`;
</script>

<PortfolioPage
	title="Traversable wormhole"
	eyebrow="Nature cover · 2022"
	paragraphs={[
		'I was asked to make the artwork for the Nature cover and the accompanying press images for the traversable-wormhole experiment on a quantum processor. The images were used on the cover of Nature 612 and in coverage including The New York Times.',
		'Made in Blender and Photoshop.'
	]}
	links={[{ label: 'Nature 612', href: 'https://www.nature.com/nature/volumes/612/issues/7938' }]}
	video={{ src: img('wormhole_hero.webm') }}
	images={[
		{
			src: img('press-1.avif'),
			alt: 'Press image: a bright beam passing through a wormhole of circuit elements',
			wide: true
		},
		{
			src: img('cover-art.avif'),
			alt: 'Cover artwork: a beam crossing between two folded circuit surfaces'
		},
		{
			src: img('wires.avif'),
			alt: 'Alternate artwork: glowing paths through a blue circuit surface'
		},
		{ src: img('holographic.avif'), alt: 'Line-art illustration titled Holographic Wormholes' },
		{ src: img('nyt-tweet.avif'), alt: 'The New York Times sharing the illustration on Twitter' },
		{
			src: img('nature-site.avif'),
			alt: 'The artwork on the Nature website',
			caption: 'On nature.com.',
			wide: true
		},
		{
			src: img('nyt.avif'),
			alt: 'The artwork in The New York Times science section',
			caption: 'In The New York Times.',
			wide: true
		}
	]}
/>
