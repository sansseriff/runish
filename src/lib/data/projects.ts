import { base } from '$app/paths';
import { blurhashes } from '$lib/blurhashes';

export type ProjectFlag = 'software' | 'quantum' | 'visual';

export interface ProjectMedia {
	path: string;
	startOffset?: number;
}

export interface Project {
	slug: string;
	title: string;
	year: string;
	tagline: string;
	flags: ProjectFlag[];
	media: ProjectMedia;
	video?: ProjectMedia;
	blurhash?: string;
	textColorOverride?: string;
}

export const projects: Project[] = [
	{
		slug: 'wormhole',
		title: 'Wormhole',
		year: '2022',
		tagline: 'Cover image for Nature 612 and accompanying press-release visualizations.',
		flags: ['quantum', 'software', 'visual'],
		media: { path: `${base}/portfolio/wormhole/wormhole_hero.webp` },
		video: { path: `${base}/portfolio/wormhole/wormhole_hero.webm` },
		blurhash: blurhashes.wormhole
	},
	{
		slug: 'scienceviz',
		title: 'Scientific visualization',
		year: '2024',
		tagline: 'Realtime renders for high-rate superconducting single-photon detector readout.',
		flags: ['quantum', 'visual'],
		media: { path: `${base}/portfolio/scienceviz/peacoq_hero.jpg` },
		video: { path: `${base}/portfolio/scienceviz/peacoq_hero.webm`, startOffset: 0.5 },
		blurhash: blurhashes.scienceviz
	},
	{
		slug: 'invariant',
		title: 'Invariant',
		year: '2018',
		tagline: 'A third aerial short film featuring UC San Diego views and students.',
		flags: ['visual'],
		media: { path: `${base}/portfolio/invariant/invariant_hero.webp` },
		video: { path: `${base}/portfolio/invariant/invariant_hero.webm`, startOffset: 0.5 },
		blurhash: blurhashes.invariant
	},
	{
		slug: 'gwp',
		title: 'Games we play',
		year: '2017',
		tagline: 'What if college breakup arguments involved lightsabers?',
		flags: ['visual'],
		media: { path: `${base}/portfolio/gwp/gwp_hero.webp` },
		video: { path: `${base}/portfolio/gwp/gwp_hero.webm`, startOffset: 0.5 },
		blurhash: blurhashes.gwp
	},
	{
		slug: 'tpwhb',
		title: 'The places we have been',
		year: '2016',
		tagline: 'My first aerial short film that garnered widespread attention around campus.',
		flags: ['visual'],
		media: { path: `${base}/portfolio/tpwhb/tpwhb_hero.webp` },
		video: { path: `${base}/portfolio/tpwhb/tpwhb_hero.webm`, startOffset: 0.5 },
		blurhash: blurhashes.tpwhb
	}
];

export function projectHref(p: Project): string {
	return `${base}/portfolio/${p.slug}`;
}

export function projectFlagIcon(flag: ProjectFlag): string {
	return `${base}/icons/${flag}_icon.svg`;
}

export function primaryFlag(p: Project): ProjectFlag {
	return p.flags[0];
}
