import { VERT } from './common';
import { FRAG_PLASMA } from './plasma';
import { FRAG_NEBULA } from './nebula';
import { FRAG_ASCII } from './ascii';

export const PRESETS = ['plasma', 'nebula', 'ascii'] as const;
export type Preset = (typeof PRESETS)[number];

export const FRAG_BY_PRESET: Record<Preset, string> = {
	plasma: FRAG_PLASMA,
	nebula: FRAG_NEBULA,
	ascii: FRAG_ASCII
};

export { VERT };

export function nextPreset(p: Preset): Preset {
	const i = PRESETS.indexOf(p);
	return PRESETS[(i + 1) % PRESETS.length];
}
