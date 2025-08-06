// @ts-check
const { defineConfig, devices } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./e2e",
  timeout: 60000,
  expect: {
    timeout: 30000,
  },
  fullyParallel: true,
  forbidOnly: true,
  retries: 1,
  workers: 2,
  maxFailures: 10,
  reporter: [
    ["json", { outputFile: "playwright-report/results.json" }],
    ["list"],
    ["github"],
  ],
  use: {
    baseURL: "http://localhost:1313",
    trace: "on-first-retry",
    screenshot: "on",
    video: "retain-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      // Only run on Linux for consistent baseline generation
      grep: /.*/,
      grepInvert: /.*/,
      testIgnore: process.platform !== 'linux' ? /.*/ : undefined,
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
      // Only run on Linux for consistent baseline generation
      grep: /.*/,
      grepInvert: /.*/,
      testIgnore: process.platform !== 'linux' ? /.*/ : undefined,
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
      // Only run on Linux for consistent baseline generation
      grep: /.*/,
      grepInvert: /.*/,
      testIgnore: process.platform !== 'linux' ? /.*/ : undefined,
    },
  ],

  webServer: {
    command:
      "npm run build && ./setup-examplesite.sh && cd exampleSite && hugo server --buildDrafts --buildFuture --disableFastRender --bind 0.0.0.0 --port 1313",
    url: "http://localhost:1313",
    timeout: 180000,
    reuseExistingServer: false,
    stdout: "pipe",
    stderr: "pipe",
  },
});
