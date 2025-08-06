// @ts-check
const { defineConfig, devices } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./e2e",
  timeout: process.env.CI ? 30000 : 15000,
  expect: {
    timeout: process.env.CI ? 10000 : 5000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : 8,
  maxFailures: process.env.CI ? 10 : 5,
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
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "mobile-safari",
      use: { ...devices["iPhone 12"] },
    },
  ],

  webServer: {
    command: process.env.CI
      ? "npm run build && ./setup-examplesite.sh && cd exampleSite && hugo server --buildDrafts --buildFuture --disableFastRender --bind 0.0.0.0 --port 1313"
      : "./setup-examplesite.sh && cd exampleSite && hugo server --buildDrafts --buildFuture --disableFastRender --bind 0.0.0.0",
    url: "http://localhost:1313",
    timeout: process.env.CI ? 180000 : 120000,
    reuseExistingServer: !process.env.CI,
    stdout: "pipe",
    stderr: "pipe",
  },
});
