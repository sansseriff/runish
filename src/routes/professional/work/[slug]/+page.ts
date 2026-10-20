import { error } from '@sveltejs/kit';
import { work, workBySlug } from '$lib/data/work';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () =>
	work.filter((w) => !w.href).map((w) => ({ slug: w.slug }));

export const load: PageLoad = ({ params }) => {
	const entry = workBySlug(params.slug);
	if (!entry) error(404, 'Not found');
	return { entry };
};
