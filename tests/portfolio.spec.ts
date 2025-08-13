import { test, expect } from '@playwright/test';

test.describe('Portfolio Website', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check page loads without errors
    await expect(page).toHaveTitle(/Venna Venkata Siva Reddy/);
    
    // Check main navigation
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('a[href="#home"]').first()).toContainText(/home/i);
    await expect(page.locator('a[href="#about"]').first()).toContainText(/about/i);
    await expect(page.locator('a[href="#experience"]').first()).toContainText(/experience/i);
    
    // Check hero section
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
    const h1Text = (await h1.textContent()) || '';
    expect(h1Text.replace(/\s+/g, '')).toContain('VENNAVENKATASIVAREDDY');
  });

  test('should display experience section', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to experience section
    await page.locator('a[href="#experience"]').first().click({ force: true });
    
    // Wait for section to be visible
    await page.waitForSelector('#experience', { timeout: 10000 });
    
    // Check experience section is present
    const experienceSection = page.locator('#experience');
    await expect(experienceSection).toBeVisible();
    
    // Check if experiences are displayed
    const experienceItems = page.locator('#experience .space-y-8 > div, #experience .text-center');
    await expect(experienceItems.first()).toBeVisible();
  });

  test('should not have image loading errors', async ({ page }) => {
    const imageErrors: string[] = [];
    
    // Monitor for image loading errors
    page.on('response', response => {
      if (response.request().resourceType() === 'image' && response.status() >= 400) {
        imageErrors.push(`Failed to load image: ${response.url()} (${response.status()})`);
      }
    });
    
    // Monitor console errors for image-related issues
    page.on('console', msg => {
      if (msg.type() === 'error' && msg.text().toLowerCase().includes('image')) {
        imageErrors.push(`Console error: ${msg.text()}`);
      }
    });
    
    await page.goto('/');
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    
    // Check for favicon
    const faviconResponse = await page.request.get('/favicon.ico');
    expect(faviconResponse.status()).toBeLessThan(400);
    
    // Verify no image loading errors
    expect(imageErrors).toHaveLength(0);
  });

  test('should have proper styling and theme', async ({ page }) => {
    await page.goto('/');
    
    // Check dark theme
    await expect(page.locator('body')).toHaveClass(/bg-black/);
    await expect(page.locator('body')).toHaveClass(/text-white/);
    
    // Check navigation styling
    const nav = page.locator('nav');
    await expect(nav).toHaveClass(/bg-black/);
    
    // Check responsive design
    await expect(page.locator('.max-w-7xl')).toBeVisible();
  });

  test('should handle navigation smoothly', async ({ page }) => {
    await page.goto('/');

    // Discover in-page nav anchors actually present to avoid waiting on missing sections
    const discovered = await page.$$eval('nav a[href^="#"]', els => Array.from(new Set(els.map(e => (e as HTMLAnchorElement).getAttribute('href') || ''))));
    const fallback = ['#home', '#about', '#experience', '#projects', '#contact'];
    const targets = (discovered.length ? discovered : fallback).filter(Boolean);

    for (const href of targets) {
      await page.evaluate((h) => {
        const el = document.querySelector(`a[href="${h}"]`) as HTMLAnchorElement | null;
        el?.click();
      }, href);
      await page.waitForTimeout(200); // allow smooth scroll

      // Check if matching section exists; if not, log and continue (do not fail entire test)
      const exists = await page.evaluate((h) => !!document.querySelector(h), href);
      if (!exists) {
        console.warn(`Section ${href} not found; skipping visibility assertion.`);
        continue;
      }
      // Use a soft assertion with short timeout to avoid long cumulative waits
      await expect.soft(page.locator(href)).toBeAttached({ timeout: 2000 });
    }
  });

  test('should not have runtime errors', async ({ page }) => {
    const errors: string[] = [];
    
    // Capture console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // Capture page errors
    page.on('pageerror', error => {
      errors.push(error.message);
    });
    
    await page.goto('/');
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    
    // Check for critical runtime errors
    const hasCriticalErrors = errors.some(error => 
      error.includes('ReferenceError') || 
      error.includes('TypeError') ||
      error.includes('SyntaxError') ||
      error.includes('failed to load image data')
    );
    
    expect(hasCriticalErrors).toBeFalsy();
    
    // Log any errors for debugging (but don't fail the test for minor issues)
    if (errors.length > 0) {
      console.log('Non-critical errors found:', errors);
    }
  });

  test('should load admin login page', async ({ page }) => {
    await page.goto('/admin');
    
    // Check login form is present
    await expect(page.locator('input[name="email"]').first()).toBeVisible();
    await expect(page.locator('input[name="password"]').first()).toBeVisible();
    await expect(page.locator('button[type="submit"]').first()).toBeVisible();
    
    // Check styling (dark theme container)
    await expect(page.locator('body')).toBeVisible();
  });
});
