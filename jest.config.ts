import { resolve } from 'path';

import type { Config } from '@jest/types';

const extensions = {
  ts: '^.+\\.ts$',
  svelte: '^.+\\.svelte$',
};

/** Convert a mapping to have regular expressions as keys and values. */
function mapDirectories(dirMapping: Record<string, string>) {
  return Object.fromEntries(
    Object.entries(dirMapping).map(([aliasDir, targetDir]) => [
      `^${aliasDir.replace('$', '\\$')}/(.*)$`,
      `${resolve(targetDir)}/$1`,
    ])
  );
}

const config: Config.InitialOptions = {
  verbose: true,
  transform: {
    [extensions.ts]: 'ts-jest',
    [extensions.svelte]: ['svelte-jester', { preprocess: true }],
  },
  moduleNameMapper: mapDirectories({
    $lib: './src/lib',
    $userland: './src/userland',
  }),
  moduleFileExtensions: ['js', 'ts', 'svelte'],
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
  testEnvironment: 'jsdom',
};

export default config;
