import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Playwright Configuration for PipelineCraft-R3
 * Supports both E2E (UI) and API testing
 */
export default defineConfig({
  // Test directory
  testDir: './tests',

  // Maximum time one test can run
  timeout: parseInt(process.env.TIMEOUT || '30000'),

  // Run tests in files in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Opt out of parallel tests on CI
  workers: process.env.CI ? 2 : undefined,

  // Reporter to use
  reporter: [
    ['html', { outputFolder: 'reports/playwright-report', open: 'never' }],
    ['json', { outputFile: 'reports/playwright-results.json' }],
    ['junit', { outputFile: 'reports/junit-results.xml' }],
    ['list']
  ],

  // Shared settings for all the projects below
  use: {
    // Base URL for E2E tests
    baseURL: process.env.BASE_URL || 'https://www.saucedemo.com',

    // Collect trace when retrying the failed test
    trace: 'retain-on-failure',

    // Screenshot on failure
    screenshot: process.env.SCREENSHOT_ON_FAILURE === 'true' ? 'only-on-failure' : 'off',

    // Video on failure
    video: 'retain-on-failure',

    // Slow down actions (useful for debugging)
    launchOptions: {
      slowMo: parseInt(process.env.SLOW_MO || '0'),
    },
  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        headless: process.env.HEADLESS === 'true',
      },
      testMatch: /tests\/e2e\/.*\.spec\.ts/,
      testIgnore: /tests\/api\/.*\.spec\.ts/,
    },

    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        headless: process.env.HEADLESS === 'true',
      },
      testMatch: /tests\/e2e\/.*\.spec\.ts/,
      testIgnore: /tests\/api\/.*\.spec\.ts/,
    },

    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        headless: process.env.HEADLESS === 'true',
      },
      testMatch: /tests\/e2e\/.*\.spec\.ts/,
      testIgnore: /tests\/api\/.*\.spec\.ts/,
    },

    // API testing project (no browser needed)
    {
      name: 'api',
      use: {
        baseURL: process.env.API_URL || 'https://dummyjson.com',
        // API-specific settings: no screenshots/videos needed
        screenshot: 'off',
        video: 'off',
        trace: 'on-first-retry',
      },
      testMatch: /tests\/api\/.*\.spec\.ts/,
      timeout: 15000, // API tests should be faster
    },
  ],

  // Folder for test artifacts
  outputDir: 'test-results/',
});
