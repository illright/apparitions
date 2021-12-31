import type { Config } from '@jest/types';

const extensions = {
  ts: '^.+\\.ts$',
  svelte: '^.+\\.svelte$',
};

const config: Config.InitialOptions = {
  verbose: true,
  transform: {
    [extensions.ts]: 'ts-jest',
    [extensions.svelte]: ['svelte-jester', { preprocess: true }]
  },
  extensionsToTreatAsEsm: ['.ts'],
  moduleFileExtensions: ['js', 'ts', 'svelte'],
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
  testEnvironment: 'jsdom'
};

export default config;

