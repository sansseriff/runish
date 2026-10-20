import { base } from '$app/paths';

export type BlogTag = 'essay' | 'note';

export interface BlogPost {
	slug: string;
	title: string;
	date: string;
	tag: BlogTag;
	summary: string;
	/** Short line for the home page, where space is tight. */
	teaser: string;
}

export const posts: BlogPost[] = [
	{
		slug: 'three-minute-thesis',
		title: 'The problem with three minute thesis',
		teaser: 'Why 3MT misses what makes science communication work.',
		date: '2025-11-04',
		tag: 'essay',
		summary:
			'Why the popular 3MT competition fails to capture what makes science communication effective.'
	},
	{
		slug: 'galileo-problem',
		title: 'The Galileo problem',
		teaser: "Galileo's hurdles, and today's science education.",
		date: '2025-10-11',
		tag: 'essay',
		summary:
			"The parallels between Galileo's challenges and the hurdles facing modern science education."
	},
	{
		slug: 'science-stories',
		title: "Why science can't tell stories about itself",
		teaser: 'Why science struggles to tell a good story.',
		date: '2025-07-02',
		tag: 'essay',
		summary: 'Why modern science struggles to captivate like a good story.'
	}
];

export function postsSorted(): BlogPost[] {
	return [...posts].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function blogHref(p: BlogPost): string {
	return `${base}/blog/${p.slug}`;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function formatDate(iso: string): string {
	const [y, m, d] = iso.split('-').map(Number);
	const month = MONTHS[m - 1] ?? '';
	return `${month} ${String(d).padStart(2, '0')}, ${y}`;
}

export function formatMonthYear(iso: string): string {
	const [y, m] = iso.split('-').map(Number);
	return `${MONTHS[m - 1] ?? ''} ${y}`;
}
