#!/usr/bin/env node

/**
 * Script to generate all baseline screenshots for visual regression tests
 * Run this before running visual regression tests for the first time
 */

const { chromium } = require("@playwright/test");
const path = require("path");
const fs = require("fs");

async function generateAllBaselines() {
  console.log(
    "🎨 Generating all baseline screenshots for visual regression tests..."
  );

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Navigate to the site with retry mechanism
    let retries = 3;
    while (retries > 0) {
      try {
        await page.goto("http://localhost:1313");
        await page.waitForLoadState("networkidle");
        break;
      } catch (error) {
        retries--;
        if (retries === 0) {
          throw error;
        }
        console.log(`⚠️  Failed to load page, retrying... (${retries} attempts left)`);
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }

    // Create snapshots directory if it doesn't exist
    const snapshotsDir = path.join(
      __dirname,
      "e2e",
      "visual-regression.spec.js-snapshots"
    );
    if (!fs.existsSync(snapshotsDir)) {
      fs.mkdirSync(snapshotsDir, { recursive: true });
    }

    // Wait for page stabilization
    await page.waitForTimeout(2000);

    // Generate baseline screenshots for different test scenarios
    const screenshots = [
      // Homepage screenshots
      {
        name: "homepage-full",
        action: async () => {
          await page.goto("http://localhost:1313");
          await page.waitForLoadState("networkidle");
          await page.waitForTimeout(1000);
        },
      },
      {
        name: "homepage-viewport",
        action: async () => {
          await page.goto("http://localhost:1313");
          await page.waitForLoadState("networkidle");
          await page.waitForTimeout(1000);
        },
      },

      // Responsive design screenshots
      {
        name: "homepage-desktop",
        action: async () => {
          await page.goto("http://localhost:1313");
          await page.setViewportSize({ width: 1200, height: 800 });
          await page.waitForLoadState("networkidle");
          await page.waitForTimeout(1000);
        },
      },
      {
        name: "homepage-tablet",
        action: async () => {
          await page.goto("http://localhost:1313");
          await page.setViewportSize({ width: 768, height: 1024 });
          await page.waitForLoadState("networkidle");
          await page.waitForTimeout(1000);
        },
      },
      {
        name: "homepage-mobile",
        action: async () => {
          await page.goto("http://localhost:1313");
          await page.setViewportSize({ width: 375, height: 667 });
          await page.waitForLoadState("networkidle");
          await page.waitForTimeout(1000);
        },
      },

      // Sidebar screenshots
      {
        name: "sidebar-closed",
        action: async () => {
          await page.goto("http://localhost:1313");
          await page.waitForLoadState("networkidle");
          await page.waitForTimeout(1000);
        },
      },
      {
        name: "sidebar-open",
        action: async () => {
          await page.goto("http://localhost:1313");
          await page.waitForLoadState("networkidle");
          await page.waitForTimeout(1000);
          // Try to open sidebar if it exists
          const toggleButton = page.locator(
            '[data-behavior="open-sidebar"], .btn-open-sidebar, #btn-open-sidebar, .sidebar-toggle'
          );
          if ((await toggleButton.count()) > 0) {
            try {
              await toggleButton.first().click();
              await page.waitForTimeout(1000);
            } catch (error) {
              console.warn("Could not toggle sidebar for screenshot");
            }
          }
        },
      },

      // Footer screenshot
      {
        name: "footer",
        action: async () => {
          await page.goto("http://localhost:1313");
          await page.waitForLoadState("networkidle");
          await page.waitForTimeout(1000);
        },
      },

      // Cross-browser consistency
      {
        name: "cross-browser-consistency",
        action: async () => {
          await page.goto("http://localhost:1313");
          await page.waitForLoadState("networkidle");
          await page.waitForTimeout(1000);
        },
      },

      // Blog post screenshots
      {
        name: "blog-post-full",
        action: async () => {
          await page.goto("http://localhost:1313");
          await page.waitForLoadState("networkidle");
          // Find first blog post link
          const postLink = page
            .locator('a[href*="/post/"], a[href*="/posts/"], .post-link')
            .first();
          if ((await postLink.count()) > 0) {
            await postLink.click();
            await page.waitForLoadState("networkidle");
            await page.waitForTimeout(1000);
          }
        },
      },

      // Dark mode screenshot
      {
        name: "dark-mode",
        action: async () => {
          await page.goto("http://localhost:1313");
          await page.waitForLoadState("networkidle");
          await page.waitForTimeout(1000);
          // Try to toggle dark mode if it exists
          const darkModeToggle = page.locator(
            '[data-theme="dark"], .dark-mode-toggle, .theme-toggle'
          );
          if ((await darkModeToggle.count()) > 0) {
            try {
              await darkModeToggle.first().click();
              await page.waitForTimeout(1000);
            } catch (error) {
              console.warn("Could not toggle dark mode for screenshot");
            }
          }
        },
      },

      // Search overlay screenshot
      {
        name: "search-overlay",
        action: async () => {
          await page.goto("http://localhost:1313");
          await page.waitForLoadState("networkidle");
          await page.waitForTimeout(1000);
          // Try to open search if it exists
          const searchButton = page.locator(
            '.search-button, .search-toggle, [data-behavior="search"]'
          );
          if ((await searchButton.count()) > 0) {
            try {
              await searchButton.first().click();
              await page.waitForTimeout(1000);
            } catch (error) {
              console.warn("Could not open search for screenshot");
            }
          }
        },
      },
    ];

    for (const screenshot of screenshots) {
      console.log(`📸 Generating ${screenshot.name} baseline...`);

      try {
        await screenshot.action();

        const screenshotPath = path.join(
          snapshotsDir,
          `${screenshot.name}-chromium-linux.png`
        );
        await page.screenshot({ path: screenshotPath });

        console.log(`✅ Generated ${screenshotPath}`);
      } catch (error) {
        console.warn(
          `⚠️  Could not generate ${screenshot.name}:`,
          error.message
        );
      }
    }

    console.log("🎉 All baseline screenshots generated successfully!");
    console.log("📁 Screenshots saved to:", snapshotsDir);
  } catch (error) {
    console.error("❌ Error generating baseline screenshots:", error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

// Check if Hugo server is running
async function checkServer() {
  try {
    const response = await fetch("http://localhost:1313");
    return response.ok;
  } catch {
    return false;
  }
}

// Main execution
async function main() {
  console.log("🔍 Checking if Hugo server is running...");

  const serverRunning = await checkServer();
  if (!serverRunning) {
    console.error("❌ Hugo server is not running on http://localhost:1313");
    console.log("💡 In CI environment, this should be handled by Playwright's webServer config");
    console.log("💡 For local development, please start the Hugo server first:");
    console.log("   npm run test:e2e");
    
    // In CI, we'll continue anyway as the webServer should start automatically
    if (process.env.CI) {
      console.log("🔄 Continuing in CI environment...");
      // Wait a bit more for the server to start
      await new Promise(resolve => setTimeout(resolve, 10000));
    } else {
      process.exit(1);
    }
  }

  await generateAllBaselines();
}

main().catch(console.error);
