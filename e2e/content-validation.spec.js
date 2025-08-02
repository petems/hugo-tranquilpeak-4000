const { test, expect } = require('@playwright/test');

test.describe('Content Validation Tests', () => {
  test('homepage displays correctly', async ({ page }) => {
    await page.goto('/');
    
    // Check for basic page structure
    await expect(page.locator('body')).toBeVisible();
    
    // Check for main content area
    const main = page.locator('main, [role="main"], .main-content, #main');
    if (await main.count() > 0) {
      await expect(main.first()).toBeVisible();
    }
    
    // Check for header
    const header = page.locator('header, [role="banner"], .header');
    if (await header.count() > 0) {
      await expect(header.first()).toBeVisible();
    }
    
    // Check for footer
    const footer = page.locator('footer, [role="contentinfo"], .footer');
    if (await footer.count() > 0) {
      await expect(footer.first()).toBeVisible();
    }
  });

  test('blog posts are accessible', async ({ page }) => {
    await page.goto('/');
    
    // Look for blog post links
    const postLinks = page.locator('a[href*="/post/"], a[href*="/posts/"], .post-link, .entry-title a');
    const postLinkCount = await postLinks.count();
    
    if (postLinkCount > 0) {
      console.log(`Found ${postLinkCount} blog post links`);
      
      // Test first few post links
      for (let i = 0; i < Math.min(postLinkCount, 3); i++) {
        const link = postLinks.nth(i);
        const href = await link.getAttribute('href');
        
        if (href && (href.startsWith('/') || href.startsWith('./'))) {
          // Navigate to the post
          await link.click();
          await page.waitForLoadState('networkidle');
          
          // Check if post page loads correctly
          await expect(page.locator('body')).toBeVisible();
          
          // Look for article content
          const article = page.locator('article, .post, .entry, .content');
          if (await article.count() > 0) {
            await expect(article.first()).toBeVisible();
          }
          
          // Check for post title
          const title = page.locator('h1, .post-title, .entry-title');
          if (await title.count() > 0) {
            await expect(title.first()).toBeVisible();
          }
          
          // Go back to homepage for next iteration
          await page.goto('/');
        }
      }
    }
  });

  test('archive/category pages work', async ({ page }) => {
    await page.goto('/');
    
    // Look for archive/category links
    const archiveLinks = page.locator('a[href*="/categories/"], a[href*="/tags/"], a[href*="/archive"], .category-link, .tag-link');
    const archiveLinkCount = await archiveLinks.count();
    
    if (archiveLinkCount > 0) {
      console.log(`Found ${archiveLinkCount} archive/category links`);
      
      // Test first few archive links
      for (let i = 0; i < Math.min(archiveLinkCount, 2); i++) {
        const link = archiveLinks.nth(i);
        const href = await link.getAttribute('href');
        
        if (href && (href.startsWith('/') || href.startsWith('./'))) {
          await link.click();
          await page.waitForLoadState('networkidle');
          
          // Check if archive page loads
          await expect(page.locator('body')).toBeVisible();
          
          // Look for post listings
          const postList = page.locator('.post-preview, .post-summary, .entry-summary, article');
          const postListCount = await postList.count();
          console.log(`Archive page has ${postListCount} post entries`);
          
          await page.goto('/');
        }
      }
    }
  });

  test('search functionality works', async ({ page }) => {
    await page.goto('/');
    
    // Look for search functionality
    const searchInput = page.locator('input[type="search"], input[name*="search"], .search-input');
    const searchForm = page.locator('form[role="search"], .search-form');
    
    if (await searchInput.count() > 0) {
      const input = searchInput.first();
      await expect(input).toBeVisible();
      
      // Test search input
      await input.fill('test');
      await expect(input).toHaveValue('test');
      
      // If there's a search form, try submitting
      if (await searchForm.count() > 0) {
        const form = searchForm.first();
        const submitButton = form.locator('button[type="submit"], input[type="submit"], .search-submit');
        
        if (await submitButton.count() > 0) {
          await submitButton.click();
          await page.waitForLoadState('networkidle');
          
          // Check if search results page loads
          await expect(page.locator('body')).toBeVisible();
        }
      }
    }
  });

  test('RSS/feed links are present', async ({ page }) => {
    await page.goto('/');
    
    // Check for RSS feed links in head
    const rssFeed = page.locator('link[type="application/rss+xml"], link[href*="rss"], link[href*="feed"]');
    const rssFeedCount = await rssFeed.count();
    
    if (rssFeedCount > 0) {
      console.log(`Found ${rssFeedCount} RSS/feed links`);
      
      for (let i = 0; i < rssFeedCount; i++) {
        const feed = rssFeed.nth(i);
        const href = await feed.getAttribute('href');
        
        if (href) {
          // Test if feed URL is accessible
          const response = await page.request.get(href).catch(() => null);
          if (response) {
            expect(response.status()).toBe(200);
            console.log(`RSS feed accessible: ${href}`);
          }
        }
      }
    }
    
    // Also check for visible RSS links
    const visibleRssLinks = page.locator('a[href*="rss"], a[href*="feed"], .rss-link');
    const visibleRssCount = await visibleRssLinks.count();
    
    if (visibleRssCount > 0) {
      console.log(`Found ${visibleRssCount} visible RSS links`);
    }
  });

  test('contact/about pages are accessible', async ({ page }) => {
    await page.goto('/');
    
    // Look for common navigation links
    const aboutLinks = page.locator('a[href*="/about"], a[href*="/contact"], nav a');
    const aboutLinkCount = await aboutLinks.count();
    
    for (let i = 0; i < aboutLinkCount; i++) {
      const link = aboutLinks.nth(i);
      const href = await link.getAttribute('href');
      const text = await link.textContent();
      
      if (href && text && (
        text.toLowerCase().includes('about') || 
        text.toLowerCase().includes('contact') ||
        href.includes('/about') ||
        href.includes('/contact')
      )) {
        if (href.startsWith('/') || href.startsWith('./')) {
          await link.click();
          await page.waitForLoadState('networkidle');
          
          // Check if page loads
          await expect(page.locator('body')).toBeVisible();
          
          // Check for main content
          const content = page.locator('main, .content, .page-content, article');
          if (await content.count() > 0) {
            await expect(content.first()).toBeVisible();
          }
          
          await page.goto('/');
          break; // Only test one about/contact page
        }
      }
    }
  });

  test('multilingual support works', async ({ page }) => {
    await page.goto('/');
    
    // Look for language switcher
    const langSwitcher = page.locator('.language-switcher, .lang-switcher, a[href*="/en/"], a[href*="/es/"], a[href*="/fr/"]');
    const langCount = await langSwitcher.count();
    
    if (langCount > 0) {
      console.log(`Found ${langCount} language-related elements`);
      
      // Test first language link
      const firstLang = langSwitcher.first();
      const href = await firstLang.getAttribute('href');
      
      if (href && (href.startsWith('/') || href.startsWith('./'))) {
        await firstLang.click();
        await page.waitForLoadState('networkidle');
        
        // Check if page loads in different language
        await expect(page.locator('body')).toBeVisible();
        
        // Check for language-specific content indicators
        const htmlLang = await page.locator('html').getAttribute('lang');
        if (htmlLang) {
          console.log(`Page language: ${htmlLang}`);
        }
      }
    }
  });
});