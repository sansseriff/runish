import { VERT } from './common';
import { FRAG_PLASMA } from './plasma';
import { FRAG_PULSAR } from './pulsar';
import { FRAG_WAVES } from './waves';
import { FRAG_NANOWIRE } from './nanowire';
import { FRAG_FIELD } from './field';

export const PRESETS = ['plasma', 'pulsar', 'waves', 'nanowire', 'field'] as const;
export type Preset = (typeof PRESETS)[number];

export const FRAG_BY_PRESET: Record<Preset, string> = {
	plasma: FRAG_PLASMA,
	pulsar: FRAG_PULSAR,
	waves: FRAG_WAVES,
	nanowire: FRAG_NANOWIRE,
	field: FRAG_FIELD
};

export { VERT };

export function nextPreset(p: Preset): Preset {
	const i = PRESETS.indexOf(p);
	return PRESETS[(i + 1) % PRESETS.length];
}
