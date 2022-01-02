import { resolve } from 'path';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: preprocess(),
  kit: {
    target: '#svelte',
    vite: {
      resolve: {
        alias: {
          $userland: resolve('./src/userland'),
        },
      },
    },
  },
};

export default config;
