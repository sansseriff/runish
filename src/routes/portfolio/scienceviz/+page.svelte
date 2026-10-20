<script lang="ts">
	import { base } from '$app/paths';
	import PortfolioPage from '$lib/PortfolioPage.svelte';

	const img = (f: string) => `${base}/portfolio/scienceviz/${f}`;
</script>

<PortfolioPage
	title="Scientific visualization"
	eyebrow="Rendering and animation"
	paragraphs={[
		'Renders and animations made to explain research: detector readout, nano-optics experiments, and materials.'
	]}
	video={{
		src: img('peacoq_hero.webm'),
		caption:
			'PEACOQ: realtime renders for high-rate superconducting single-photon detector readout.'
	}}
	youtube={[
		{
			id: 'PsBOBBO3jiE',
			title: 'Free-space coupled low false count superconducting nanowire single-photon detector'
		},
		{ id: 'RITP65ce0C4', title: 'Upconversion process of NaYF4 nanocrystals doped with Yb and Er' }
	]}
	images={[
		{ src: img('hbn-sio2.avif'), alt: 'Illustration of a scanning probe tip over hBN on SiO2' },
		{ src: img('v2o3.avif'), alt: 'Illustration of a scanning probe tip over V2O3 on Al2O3' },
		{
			src: img('graphene.avif'),
			alt: 'Illustration of a scanning probe tip over a ringed lattice on SiO2 and Si'
		},
		{
			src: img('firewatch.avif'),
			alt: 'Abstract render of coloured spheres around a bright point'
		},
		{ src: img('texture.avif'), alt: 'Close-up render of a red and blue surface texture' },
		{
			src: img('poster.avif'),
			alt: 'Poster for a symposium on sensor technologies for the nervous system'
		}
	]}
/>
