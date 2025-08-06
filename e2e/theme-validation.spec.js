const { test, expect } = require("@playwright/test");
const { navigateToPage } = require("./utils/navigation-helper");
const { createLogger } = require("./utils/test-logger");

test.describe("Hugo Tranquilpeak Theme Validation", () => {
  test.beforeEach(async ({ page }, testInfo) => {
    const logger = createLogger(testInfo);
    logger.step("Setting up test environment");
    await navigateToPage(page, "/", {
      strategy: "networkidle",
      testInfo,
    });
  });

  test("page loads without errors", async ({ page }, testInfo) => {
    const logger = createLogger(testInfo);

    logger.step("Checking for console errors");

    // Check for console errors
    const errors = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
        logger.error("Console error detected:", msg.text());
      }
    });

    await page.waitForLoadState("networkidle");

    // Verify page loaded successfully
    logger.debug("Verifying page title");
    await expect(page).toHaveTitle(/./);
    logger.success("Page title is valid");

    // Report any console errors
    if (errors.length > 0) {
      logger.warn(`Found ${errors.length} console errors:`, errors);
    } else {
      logger.success("No console errors detected");
    }

    expect(errors.length).toBe(0);
    logger.success("Page loads without errors test completed");
  });

  test("basic page elements are present", async ({ page }, testInfo) => {
    const logger = createLogger(testInfo);

    logger.step("Validating basic page elements");
    await page.waitForLoadState("networkidle");

    // Check that the page has basic content
    logger.debug("Checking body element visibility");
    await expect(page.locator("body")).toBeVisible();
    logger.success("Body element is visible");

    // Check for a heading (h1, h2, h3, etc.)
    logger.step("Checking for heading elements");
    const headings = page.locator("h1, h2, h3, h4, h5, h6");
    const headingCount = await headings.count();
    logger.info(`Found ${headingCount} heading elements`);
    expect(headingCount).toBeGreaterThan(0);
    logger.success("Heading elements are present");

    // Check that the page has some content
    logger.step("Checking for content elements");
    const content = page.locator("main, .content, article, .post");
    const contentCount = await content.count();
    logger.info(`Found ${contentCount} content elements`);
    expect(contentCount).toBeGreaterThan(0);
    logger.success("Content elements are present");

    logger.success("Basic page elements validation completed");
  });

  test("images load correctly", async ({ page }, testInfo) => {
    const logger = createLogger(testInfo);

    logger.step("Validating image loading");
    await page.waitForLoadState("networkidle");

    const images = page.locator("img");
    const imageCount = await images.count();
    logger.info(`Found ${imageCount} images on the page`);

    if (imageCount > 0) {
      // Check first few images
      for (let i = 0; i < Math.min(imageCount, 3); i++) {
        const img = images.nth(i);
        logger.debug(`Checking image ${i + 1}/${Math.min(imageCount, 3)}`);

        // Check if image has src attribute
        await expect(img).toHaveAttribute("src");

        // Check if image exists and has valid src (don't require visibility)
        // Some images may be hidden by default in this theme (like author picture)
        const src = await img.getAttribute("src");
        expect(src).toBeTruthy();
        expect(src.length).toBeGreaterThan(0);

        logger.success(`Image ${i + 1} has valid src: ${src}`);
      }
      logger.success("All checked images have valid src attributes");
    } else {
      logger.warn("No images found on the page");
    }

    logger.success("Image loading validation completed");
  });

  test("CSS and JS resources load successfully", async ({ page }, testInfo) => {
    const logger = createLogger(testInfo);

    logger.step("Validating CSS and JS resource loading");

    const failedRequests = [];

    page.on("response", (response) => {
      if (response.status() >= 400) {
        const failedRequest = {
          url: response.url(),
          status: response.status(),
          statusText: response.statusText(),
        };
        failedRequests.push(failedRequest);
        logger.error("Failed resource request:", failedRequest);
      }
    });

    await navigateToPage(page, "/", {
      strategy: "networkidle",
      testInfo,
    });

    // Check for CSS files
    logger.step("Checking CSS stylesheets");
    const stylesheets = page.locator('link[rel="stylesheet"]');
    const cssCount = await stylesheets.count();
    logger.info(`Found ${cssCount} CSS stylesheets`);
    expect(cssCount).toBeGreaterThan(0);
    logger.success("CSS stylesheets are present");

    // Check for JavaScript files
    logger.step("Checking JavaScript resources");
    const scripts = page.locator("script[src]");
    const scriptCount = await scripts.count();
    logger.info(`Found ${scriptCount} JavaScript files`);

    if (scriptCount > 0) {
      logger.success("JavaScript files are present");
    } else {
      logger.debug("No external JavaScript files found (may be inline)");
    }

    if (failedRequests.length > 0) {
      logger.warn(
        `Found ${failedRequests.length} failed resource requests:`,
        failedRequests
      );
      expect(failedRequests.length).toBe(0);
    } else {
      logger.success("All resource requests completed successfully");
    }

    logger.success("CSS and JS resource validation completed");
  });
});
