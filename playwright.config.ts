import { defineConfig } from '@playwright/test';

const reporter: any[] = [['list'], ['html'], ['json', { outputFile: 'test-results.json' }]];

if (process.env.CI) {
  reporter.push(['github']);
}

export default defineConfig({
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? undefined : 1,
  reporter,
  timeout: 90000, // Increase global test timeout to 90 seconds
  expect: {
    timeout: 60000 // Increase expect timeout to 60 seconds
  },

  use: {
    trace: process.env.CI ? 'on-first-retry' : 'on',
    actionTimeout: 30000 // Increase action timeout to 30 seconds
  },

  projects: [
    {
      name: 'default',
      testDir: './tests',
      testIgnore: [
        'ssl/**' // custom CA certificate tests require separate server setup and certificate generation
      ]
    },
    {
      name: 'ssl',
      testDir: './tests/ssl'
    }
  ],

  webServer: [
    {
      command: 'npm run dev:web',
      url: 'http://localhost:3000',
      reuseExistingServer: !process.env.CI,
      timeout: 10 * 60 * 1000
    },
    {
      command: 'npm start --workspace=packages/bruno-tests',
      url: 'http://localhost:8081/ping',
      reuseExistingServer: !process.env.CI,
      timeout: 10 * 60 * 1000
    }
  ]
});
