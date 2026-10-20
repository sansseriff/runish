<script lang="ts">
	import { base } from '$app/paths';
	import PortfolioPage from '$lib/PortfolioPage.svelte';

	const img = (f: string) => `${base}/portfolio/gwp/${f}`;
</script>

<PortfolioPage
	title="Games We Play"
	eyebrow="Short film · 2017"
	paragraphs={[
		'What if college breakup arguments involved lightsabers?',
		'Co-writer, director and editor.'
	]}
	links={[{ label: 'IMDb', href: 'https://www.imdb.com/title/tt11204682/' }]}
	video={{ src: img('gwp_hero.webm') }}
	images={[
		{ src: img('still-3.avif'), alt: 'A student holding a lit lightsaber', wide: true },
		{ src: img('still-1.avif'), alt: 'Three students in a campus courtyard' },
		{ src: img('still-2.avif'), alt: 'A student mid-conversation' },
		{ src: img('still-5.avif'), alt: 'Two students at a café table' },
		{ src: img('still-6.avif'), alt: 'Two students facing each other' },
		{ src: img('bts-1.avif'), alt: 'Production still of three students' },
		{ src: img('bts-2.avif'), alt: 'Production still of a student walking' },
		{ src: img('credits.avif'), alt: 'End credits over a red silhouette of trees', wide: true }
	]}
/>
