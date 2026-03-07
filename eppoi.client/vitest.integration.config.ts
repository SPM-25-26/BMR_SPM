import { defineConfig, mergeConfig } from 'vitest/config';
import baseConfig from './vite.config';

const integrationBaseUrl = process.env.INTEGRATION_BASE_URL ?? 'https://127.0.0.1:7156';

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      include: ['src/**/*.integration.test.ts'],
      exclude: ['**/node_modules/**', '**/.git/**'],
      setupFiles: ['./src/test/setup.integration.ts'],
      environmentOptions: {
        jsdom: {
          url: integrationBaseUrl,
        },
      },
    },
  })
);