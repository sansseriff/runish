// Email addresses are stored reversed and split, so neither the prerendered HTML
// nor the JS bundle contains a plain address for scrapers to harvest. They are
// assembled in the browser (see Email.svelte and SocialLink.svelte).
const ENCODED = {
	gmail: ['relleumretswerdna', 'moc.liamg'],
	caltech: ['relleuma', 'ude.hcetlac']
} as const;

export type EmailKey = keyof typeof ENCODED;

const rev = (s: string) => [...s].reverse().join('');

export function emailAddress(key: EmailKey): string {
	const [user, domain] = ENCODED[key];
	return `${rev(user)}@${rev(domain)}`;
}
