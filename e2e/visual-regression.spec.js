const { test, expect } = require('@playwright/test');

test.describe('Visual Regression Tests', () => {
  test('homepage visual comparison', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Wait for any animations or lazy-loaded content
    await page.waitForTimeout(2000);
    
    // Take full page screenshot
    await expect(page).toHaveScreenshot('homepage-full.png', {
      fullPage: true,
      threshold: 0.3, // Allow 30% difference for initial run
    });
    
    // Take viewport screenshot
    await expect(page).toHaveScreenshot('homepage-viewport.png', {
      threshold: 0.3,
    });
  });

  test('responsive design screenshots', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Desktop view
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot('homepage-desktop.png', {
      threshold: 0.3,
    });
    
    // Tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot('homepage-tablet.png', {
      threshold: 0.3,
    });
    
    // Mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot('homepage-mobile.png', {
      threshold: 0.3,
    });
  });

  test('sidebar and navigation screenshots', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Try to open sidebar if it exists
    const sidebarToggle = page.locator('[data-behavior="open-sidebar"], .btn-open-sidebar, #btn-open-sidebar');
    
    if (await sidebarToggle.count() > 0) {
      // Screenshot with sidebar closed
      await expect(page).toHaveScreenshot('sidebar-closed.png', {
        threshold: 0.3,
      });
      
      // Open sidebar and screenshot
      await sidebarToggle.first().click();
      await page.waitForTimeout(500);
      
      await expect(page).toHaveScreenshot('sidebar-open.png', {
        threshold: 0.3,
      });
    }
  });

  test('blog post visual comparison', async ({ page }) => {
    await page.goto('/');
    
    // Find first blog post link
    const postLink = page.locator('a[href*="/post/"], a[href*="/posts/"], .post-link').first();
    
    if (await postLink.count() > 0) {
      await postLink.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      
      // Screenshot of blog post
      await expect(page).toHaveScreenshot('blog-post.png', {
        fullPage: true,
        threshold: 0.3,
      });
    }
  });

  test('footer and copyright area', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Scroll to bottom to ensure footer is visible
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    
    // Screenshot just the footer area
    const footer = page.locator('footer, [role="contentinfo"], .footer');
    
    if (await footer.count() > 0) {
      await expect(footer.first()).toHaveScreenshot('footer.png', {
        threshold: 0.3,
      });
    }
  });

  test('dark mode visual comparison', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Look for dark mode toggle
    const darkModeToggle = page.locator('[data-behavior="toggle-theme"], .theme-toggle, .dark-mode-toggle');
    
    if (await darkModeToggle.count() > 0) {
      // Screenshot in light mode
      await expect(page).toHaveScreenshot('light-mode.png', {
        threshold: 0.3,
      });
      
      // Toggle to dark mode
      await darkModeToggle.first().click();
      await page.waitForTimeout(500);
      
      // Screenshot in dark mode
      await expect(page).toHaveScreenshot('dark-mode.png', {
        threshold: 0.3,
      });
    }
  });

  test('search overlay visual comparison', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Look for search button/trigger
    const searchTrigger = page.locator('[data-behavior="open-algolia-search"], .search-trigger, .search-btn');
    
    if (await searchTrigger.count() > 0) {
      await searchTrigger.first().click();
      await page.waitForTimeout(500);
      
      // Screenshot with search overlay
      await expect(page).toHaveScreenshot('search-overlay.png', {
        threshold: 0.3,
      });
    }
  });
});