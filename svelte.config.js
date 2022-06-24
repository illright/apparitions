import * as path from 'path';
import { searchForWorkspaceRoot } from 'vite';
import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';

import { preprocessor } from 'apparitions/preprocessor';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [preprocess(), preprocessor],

	kit: {
		adapter: adapter(),
		// This needs to be here for development only, without it, Vite complains that it
		//   cannot serve files from `./package`. I don't know why, but it works.
		vite: {
			server: {
				fs: {
					allow: [
						path.join(searchForWorkspaceRoot(process.cwd()), 'package'),
					]
				}
			}
		}
	}
};

export default config;
