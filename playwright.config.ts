import { defineConfig, devices } from '@playwright/test'

const baseURL = 'http://127.0.0.1:5173'

export default defineConfig({
  testDir: './tests/e2e',
  testMatch: '**/*.e2e.ts',
  fullyParallel: true,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'yarn dev --host 127.0.0.1',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      BLOG_URL: 'http://127.0.0.1:5173',
      VITE_API_URL: 'http://127.0.0.1:5173/api',
      VITE_BLOG_URL: 'http://127.0.0.1:5173',
      VITE_CAVE_URL: 'http://127.0.0.1:5173',
      VITE_STRIPE_PUBLISHABLE_KEY: 'pk_test_ci',
      VITE_KITANA_URL: 'ws://127.0.0.1:2567',
    },
  },
})
