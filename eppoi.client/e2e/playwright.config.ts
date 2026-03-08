import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './',
  timeout: 30_000,
  fullyParallel: false,
  retries: 0,
  reporter: 'list',

  // prevent OneDrive or Google Drive locks on test-results folder
  outputDir: 'C:/Temp/eppoi-playwright/test-results',

  use: {
    baseURL: 'https://127.0.0.1:51740',
    browserName: 'chromium',
    headless: true,
    ignoreHTTPSErrors: true,
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 51740',
    url: 'https://127.0.0.1:51740',
    reuseExistingServer: true,
    timeout: 120_000,
    ignoreHTTPSErrors: true,
  },
});