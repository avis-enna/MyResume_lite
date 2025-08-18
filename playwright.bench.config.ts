import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/bench',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : 1, // Force single worker for now to avoid auth conflicts
  globalSetup: require.resolve('./tests/bench/global-setup.ts'),
  maxFailures: 0, // Don't stop on failures, run all tests
  reporter: [
    ['list'], // Shows real-time progress
    ['html', { outputFolder: 'playwright-report-bench', open: 'never' }],
    ['./tests/reporters/bench-reporter.ts']
  ],
  use: {
    baseURL: process.env.BENCH_BASE_URL || 'http://localhost:3001',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: process.env.BENCH_START_CMD || 'npm run dev',
    url: process.env.BENCH_BASE_URL || 'http://localhost:3001',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  env: {
    PLAYWRIGHT_TEST: '1',
    NODE_ENV: process.env.NODE_ENV || 'development',
    AUTH_SECRET: 'test-auth-secret-for-playwright-bench-testing-only',
    JWT_SECRET: 'test-jwt-secret-for-playwright-bench-testing-only',
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio-test'
  }
  },
});
