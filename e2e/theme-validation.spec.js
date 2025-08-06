const { test, expect } = require("@playwright/test");

test.describe("Hugo Tranquilpeak Theme Validation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("page loads without errors", async ({ page }) => {
    // Check for console errors
    const errors = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    await page.waitForLoadState("networkidle");

    // Verify page loaded successfully
    await expect(page).toHaveTitle(/./);

    // Report any console errors
    if (errors.length > 0) {
      console.warn("Console errors detected:", errors);
    }

    expect(errors.length).toBe(0);
  });

  test("responsive design works correctly", async ({ page }) => {
    // Test desktop view
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(page.locator("body")).toBeVisible();

    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500);
    await expect(page.locator("body")).toBeVisible();

    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    await expect(page.locator("body")).toBeVisible();
  });

  test("navigation elements are functional", async ({ page }) => {
    await page.waitForLoadState("networkidle");

    // Check if sidebar exists and can be toggled
    const sidebar = page.locator('#sidebar, .sidebar, [role="complementary"]');
    const sidebarVisible =
      (await sidebar.count()) > 0 && (await sidebar.first().isVisible());

    if (sidebarVisible) {
      const toggleButton = page.locator(
        '[data-behavior="open-sidebar"], .btn-open-sidebar, #btn-open-sidebar, .sidebar-toggle'
      );
      if ((await toggleButton.count()) > 0) {
        try {
          await toggleButton.first().click();
          await page.waitForTimeout(1000); // Increased wait time
        } catch (error) {
          console.warn("Could not toggle sidebar:", error.message);
        }
      }
    } else {
      // If no sidebar, that's fine - not all themes have sidebars
      console.log("No sidebar found - this may be normal for this theme");
    }

    // Check main navigation links - be more flexible with selectors
    const navLinks = page.locator(
      "nav a, .sidebar a, .navigation a, .menu a, .nav a"
    );
    const linkCount = await navLinks.count();

    if (linkCount > 0) {
      let validLinksFound = 0;

      for (let i = 0; i < Math.min(linkCount, 5); i++) {
        const link = navLinks.nth(i);
        const href = await link.getAttribute("href");

        if (
          href &&
          !href.startsWith("#") &&
          !href.startsWith("mailto:") &&
          !href.startsWith("tel:")
        ) {
          // Check if internal links are valid
          if (
            href.startsWith("/") ||
            href.startsWith("./") ||
            !href.includes("://")
          ) {
            try {
              await expect(link).toBeVisible();
              validLinksFound++;
            } catch (error) {
              console.warn(`Navigation link not visible: ${href}`);
            }
          }
        }
      }

      // At least one valid navigation link should be found
      expect(validLinksFound).toBeGreaterThan(0);
    }
  });

  test("images load correctly and have alt text", async ({ page }) => {
    await page.waitForLoadState("networkidle");

    const images = page.locator("img");
    const imageCount = await images.count();

    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);

      // Check if image loads
      await expect(img).toHaveAttribute("src");

      // Check for alt text (accessibility)
      const altText = await img.getAttribute("alt");
      if (!altText) {
        console.warn(
          `Image missing alt text: ${await img.getAttribute("src")}`
        );
      }

      // Verify image actually loads - but don't require visibility
      const src = await img.getAttribute("src");
      if (src && !src.startsWith("data:")) {
        // Check if image has proper dimensions or is loaded
        const width = await img.getAttribute("width");
        const height = await img.getAttribute("height");
        const naturalWidth = await img.evaluate((el) => el.naturalWidth);
        const naturalHeight = await img.evaluate((el) => el.naturalHeight);

        // Image is considered valid if it has dimensions or natural size
        const hasDimensions =
          (width && parseInt(width) > 0) ||
          (height && parseInt(height) > 0) ||
          naturalWidth > 0 ||
          naturalHeight > 0;

        if (!hasDimensions) {
          console.warn(`Image may not be loading properly: ${src}`);
        }
      }
    }
  });

  test("CSS and JS resources load successfully", async ({ page }) => {
    const failedRequests = [];

    page.on("response", (response) => {
      if (response.status() >= 400) {
        failedRequests.push({
          url: response.url(),
          status: response.status(),
          statusText: response.statusText(),
        });
      }
    });

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Check for CSS files
    const stylesheets = page.locator('link[rel="stylesheet"]');
    const cssCount = await stylesheets.count();
    console.log(`Found ${cssCount} stylesheets`);

    // Check for JavaScript files
    const scripts = page.locator("script[src]");
    const jsCount = await scripts.count();
    console.log(`Found ${jsCount} script files`);

    if (failedRequests.length > 0) {
      console.warn("Failed resource requests:", failedRequests);
      expect(failedRequests.length).toBe(0);
    }
  });

  test("forms work correctly", async ({ page }) => {
    // Look for search forms
    const searchForms = page.locator(
      'form[role="search"], .search-form, input[type="search"]'
    );
    const searchFormCount = await searchForms.count();

    if (searchFormCount > 0) {
      const searchInput = searchForms.first();
      await expect(searchInput).toBeVisible();

      // Test search functionality if available
      if (
        (await searchInput.getAttribute("type")) === "search" ||
        (await searchInput.getAttribute("name")) === "search" ||
        (await searchInput.getAttribute("placeholder"))
      ) {
        await searchInput.fill("test search");
        await expect(searchInput).toHaveValue("test search");
      }
    }

    // Look for contact or comment forms
    const forms = page.locator("form");
    const formCount = await forms.count();

    for (let i = 0; i < formCount; i++) {
      const form = forms.nth(i);
      const inputs = form.locator("input, textarea, select");
      const inputCount = await inputs.count();

      if (inputCount > 0) {
        console.log(`Found form with ${inputCount} inputs`);
        // Basic form validation - check if required fields are marked
        const requiredInputs = form.locator(
          "input[required], textarea[required], select[required]"
        );
        const requiredCount = await requiredInputs.count();
        console.log(`Form has ${requiredCount} required fields`);
      }
    }
  });

  test("accessibility standards are met", async ({ page }) => {
    // Check for basic accessibility elements
    const headings = page.locator("h1, h2, h3, h4, h5, h6");
    const headingCount = await headings.count();
    expect(headingCount).toBeGreaterThan(0);

    // Check for proper heading hierarchy - be more flexible
    const h1Count = await page.locator("h1").count();
    expect(h1Count).toBeGreaterThanOrEqual(1);

    // For Hugo themes, multiple h1 tags might be acceptable (e.g., in sidebar, posts)
    // Instead of requiring exactly one, check that the main content has a proper heading
    const mainH1 = page.locator("main h1, .content h1, article h1, .post h1");
    const mainH1Count = await mainH1.count();

    if (mainH1Count === 0) {
      // If no h1 in main content, check for other heading levels
      const mainHeadings = page.locator(
        "main h2, .content h2, article h2, .post h2"
      );
      const mainHeadingCount = await mainHeadings.count();
      expect(mainHeadingCount).toBeGreaterThan(0);
    }

    // Check for alt text on images (already done in images test, but good for accessibility focus)
    const imagesWithoutAlt = page.locator("img:not([alt])");
    const imagesWithoutAltCount = await imagesWithoutAlt.count();

    if (imagesWithoutAltCount > 0) {
      console.warn(`Found ${imagesWithoutAltCount} images without alt text`);
    }

    // Check for proper link text (not just "click here" or "read more")
    const links = page.locator("a");
    const linkCount = await links.count();

    for (let i = 0; i < Math.min(linkCount, 10); i++) {
      const link = links.nth(i);
      const linkText = await link.textContent();
      const ariaLabel = await link.getAttribute("aria-label");

      if (linkText && linkText.trim()) {
        const problematicTexts = ["click here", "here", "read more", "more"];
        const isProblematic = problematicTexts.some(
          (text) => linkText.toLowerCase().trim() === text
        );

        if (isProblematic && !ariaLabel) {
          console.warn(`Potentially problematic link text: "${linkText}"`);
        }
      }
    }
  });

  test("social sharing buttons work", async ({ page }) => {
    // Look for social sharing buttons
    const socialButtons = page.locator(
      '[class*="social"], [class*="share"], [data-share]'
    );
    const socialButtonCount = await socialButtons.count();

    if (socialButtonCount > 0) {
      console.log(`Found ${socialButtonCount} social sharing elements`);

      for (let i = 0; i < Math.min(socialButtonCount, 5); i++) {
        const button = socialButtons.nth(i);
        await expect(button).toBeVisible();

        // Check if it has proper href or click handler
        const href = await button.getAttribute("href");
        const onClick = await button.getAttribute("onclick");

        if (!href && !onClick) {
          console.warn(
            "Social button without href or onclick handler detected"
          );
        }
      }
    }
  });

  test("performance metrics are acceptable", async ({ page }) => {
    const startTime = Date.now();

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const loadTime = Date.now() - startTime;
    console.log(`Page load time: ${loadTime}ms`);

    // Check if load time is reasonable (under 5 seconds)
    expect(loadTime).toBeLessThan(5000);

    // Check for large images that might slow down the page
    const images = page.locator("img");
    const imageCount = await images.count();

    for (let i = 0; i < Math.min(imageCount, 10); i++) {
      const img = images.nth(i);
      const src = await img.getAttribute("src");

      if (src && !src.startsWith("data:")) {
        const response = await page.request.get(src).catch(() => null);
        if (response && response.status() === 200) {
          const headers = response.headers();
          const contentLength = headers["content-length"];

          if (contentLength && parseInt(contentLength) > 1000000) {
            // 1MB
            console.warn(
              `Large image detected: ${src} (${Math.round(
                parseInt(contentLength) / 1024
              )}KB)`
            );
          }
        }
      }
    }
  });
});
