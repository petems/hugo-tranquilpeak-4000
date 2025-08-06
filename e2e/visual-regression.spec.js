const { test, expect } = require("@playwright/test");
const { getVisualTestConfig, getCIConfig } = require("./visual-test-config");

test.describe("Visual Regression Tests", () => {
  // Helper function to wait for page stabilization
  async function waitForStabilization(page) {
    // Wait for network to be idle
    await page.waitForLoadState("networkidle");

    // Wait for any animations to complete
    await page.waitForTimeout(2000);

    // Wait for any dynamic content to settle
    await page
      .waitForFunction(
        () => {
          return !document.querySelector("[data-loading], .loading, .spinner");
        },
        { timeout: 10000 }
      )
      .catch(() => {
        // Ignore if no loading elements found
        console.log("No loading elements found, continuing...");
      });

    // Additional wait for CI environment
    if (process.env.CI) {
      await page.waitForTimeout(3000);
    }
  }

  test("homepage visual comparison", async ({ page }) => {
    try {
      await page.goto("/");
      await waitForStabilization(page);

      // Get configuration based on environment
      const config = process.env.CI
        ? getCIConfig("homepage")
        : getVisualTestConfig("homepage");

      console.log("Taking homepage screenshots with config:", JSON.stringify(config, null, 2));

      // Take full page screenshot with stabilization CSS
      await expect(page).toHaveScreenshot("homepage-full.png", {
        fullPage: true,
        ...config,
      });

      // Take viewport screenshot
      await expect(page).toHaveScreenshot("homepage-viewport.png", {
        ...config,
      });

      console.log("✅ Homepage screenshots taken successfully");
    } catch (error) {
      console.error("❌ Error taking homepage screenshots:", error);
      throw error;
    }
  });

  test("responsive design screenshots", async ({ page }) => {
    await page.goto("/");
    await waitForStabilization(page);

    const config = process.env.CI
      ? getCIConfig("responsive")
      : getVisualTestConfig("responsive");

    // Desktop view
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.waitForTimeout(1000); // Increased wait time
    await expect(page).toHaveScreenshot("homepage-desktop.png", {
      ...config,
    });

    // Tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(1000); // Increased wait time
    await expect(page).toHaveScreenshot("homepage-tablet.png", {
      ...config,
    });

    // Mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000); // Increased wait time
    await expect(page).toHaveScreenshot("homepage-mobile.png", {
      ...config,
    });
  });

  test("sidebar and navigation screenshots", async ({ page }) => {
    await page.goto("/");
    await waitForStabilization(page);

    const config = process.env.CI
      ? getCIConfig("sidebar")
      : getVisualTestConfig("sidebar");

    // Try to open sidebar if it exists
    const sidebarToggle = page.locator(
      '[data-behavior="open-sidebar"], .btn-open-sidebar, #btn-open-sidebar'
    );

    if ((await sidebarToggle.count()) > 0) {
      // Screenshot with sidebar closed
      await expect(page).toHaveScreenshot("sidebar-closed.png", {
        ...config,
      });

      // Open sidebar and wait for animation
      await sidebarToggle.first().click();
      await page.waitForTimeout(1000); // Wait longer for sidebar animation

      await expect(page).toHaveScreenshot("sidebar-open.png", {
        ...config,
      });
    }
  });

  test("blog post visual comparison", async ({ page }) => {
    await page.goto("/");

    // Find first blog post link
    const postLink = page
      .locator('a[href*="/post/"], a[href*="/posts/"], .post-link')
      .first();

    if ((await postLink.count()) > 0) {
      await postLink.click();
      await waitForStabilization(page);

      const config = process.env.CI
        ? getCIConfig("blogPost")
        : getVisualTestConfig("blogPost");

      // Screenshot of blog post
      await expect(page).toHaveScreenshot("blog-post.png", {
        fullPage: true,
        ...config,
      });
    }
  });

  test("footer and copyright area", async ({ page }) => {
    await page.goto("/");
    await waitForStabilization(page);

    // Scroll to bottom to ensure footer is visible
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // Screenshot just the footer area
    const footer = page.locator('footer, [role="contentinfo"], .footer');

    if ((await footer.count()) > 0) {
      const config = process.env.CI
        ? getCIConfig("footer")
        : getVisualTestConfig("footer");

      await expect(footer.first()).toHaveScreenshot("footer.png", {
        ...config,
      });
    }
  });

  test("dark mode visual comparison", async ({ page }) => {
    await page.goto("/");
    await waitForStabilization(page);

    const config = process.env.CI
      ? getCIConfig("homepage")
      : getVisualTestConfig("homepage");

    // Look for dark mode toggle
    const darkModeToggle = page.locator(
      '[data-behavior="toggle-theme"], .theme-toggle, .dark-mode-toggle'
    );

    if ((await darkModeToggle.count()) > 0) {
      // Screenshot in light mode
      await expect(page).toHaveScreenshot("light-mode.png", {
        ...config,
      });

      // Toggle to dark mode and wait for transition
      await darkModeToggle.first().click();
      await page.waitForTimeout(1000); // Wait for theme transition

      // Screenshot in dark mode
      await expect(page).toHaveScreenshot("dark-mode.png", {
        ...config,
      });
    }
  });

  test("search overlay visual comparison", async ({ page }) => {
    await page.goto("/");
    await waitForStabilization(page);

    const config = process.env.CI
      ? getCIConfig("homepage")
      : getVisualTestConfig("homepage");

    // Look for search button/trigger
    const searchTrigger = page.locator(
      '[data-behavior="open-algolia-search"], .search-trigger, .search-btn'
    );

    if ((await searchTrigger.count()) > 0) {
      await searchTrigger.first().click();
      await page.waitForTimeout(1000); // Wait for overlay animation

      // Screenshot with search overlay
      await expect(page).toHaveScreenshot("search-overlay.png", {
        ...config,
      });
    }
  });

  test("cross-browser consistency check", async ({ page }) => {
    await page.goto("/");
    await waitForStabilization(page);

    const config = process.env.CI
      ? getCIConfig("crossBrowser")
      : getVisualTestConfig("crossBrowser");

    // Test that screenshots are consistent across different scenarios
    await expect(page).toHaveScreenshot("cross-browser-consistency.png", {
      ...config,
    });
  });
});
