import { mdsvex } from 'mdsvex';
// import BlogLayout from './src/lib/layouts/BlogLayout.svelte';
// import adapter from '@sveltejs/adapter-auto';
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: [
		vitePreprocess(),
		mdsvex({
			extensions: ['.svx'],
			layout: {
				blog: dirname(fileURLToPath(import.meta.url)) + '/src/lib/layouts/BlogLayout.svelte'
			}
		})
	],
	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter(),
		paths: {
			base: process.env.NODE_ENV === 'production' ? '/runish' : ''
		}
	},
	extensions: ['.svelte', '.svx']
};

export default config;
