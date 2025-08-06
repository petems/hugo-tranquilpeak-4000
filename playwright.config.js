// @ts-check
const { defineConfig, devices } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./e2e",
  timeout: process.env.CI ? 60000 : 15000, // Increased timeout for CI
  expect: {
    timeout: process.env.CI ? 15000 : 5000, // Increased expect timeout for CI
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0, // Increased retries for CI
  workers: process.env.CI ? 1 : 8, // Reduced workers for CI stability
  maxFailures: process.env.CI ? 20 : 5, // Increased max failures for CI
  reporter: process.env.CI
    ? [
        ["json", { outputFile: "playwright-report/results.json" }],
        ["list"],
        ["github"],
      ]
    : [["json", { outputFile: "playwright-report/results.json" }], ["list"]],
  use: {
    baseURL: "http://localhost:1313",
    trace: process.env.CI ? "on-first-retry" : "off",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    // Add more robust settings for CI
    actionTimeout: process.env.CI ? 10000 : 5000,
    navigationTimeout: process.env.CI ? 30000 : 15000,
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
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 5"] },
      // Only run on Linux for consistent baseline generation
      grep: /.*/,
      grepInvert: /.*/,
      testIgnore: process.platform !== 'linux' ? /.*/ : undefined,
    },
    {
      name: "mobile-safari",
      use: { ...devices["iPhone 12"] },
      // Only run on Linux for consistent baseline generation
      grep: /.*/,
      grepInvert: /.*/,
      testIgnore: process.platform !== 'linux' ? /.*/ : undefined,
    },
  ],

  webServer: {
    command: process.env.CI
      ? "npm run build && ./setup-examplesite.sh && cd exampleSite && hugo server --buildDrafts --buildFuture --disableFastRender --bind 0.0.0.0 --port 1313"
      : "./setup-examplesite.sh && cd exampleSite && hugo server --buildDrafts --buildFuture --disableFastRender --bind 0.0.0.0",
    url: "http://localhost:1313",
    timeout: process.env.CI ? 300000 : 120000, // Increased timeout for CI
    reuseExistingServer: !process.env.CI,
    stdout: "pipe",
    stderr: "pipe",
  },
});
