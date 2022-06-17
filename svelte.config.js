import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';

import { preprocessor } from 'apparitions/preprocessor';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [
		preprocess(),
		preprocessor,
	],

	kit: {
		adapter: adapter()
	}
};

export default config;
