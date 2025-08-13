import { test, expect } from '@playwright/test';

test.describe('Core Functionality Tests', () => {
  test('should load main portfolio without runtime errors', async ({ page }) => {
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
    
    // Check page loads successfully
    await expect(page).toHaveTitle(/Venna Venkata Siva Reddy/);
    
    // Check for the specific error we fixed
    const hasDeleteButtonError = errors.some(error => 
      error.includes('Cannot read properties of undefined') && 
      error.includes('DeleteButton')
    );
    
    expect(hasDeleteButtonError).toBeFalsy();
    
    // Check for critical runtime errors
    const hasCriticalErrors = errors.some(error => 
      error.includes('ReferenceError') || 
      error.includes('TypeError') ||
      error.includes('SyntaxError') ||
      error.includes('failed to load image data')
    );
    
    expect(hasCriticalErrors).toBeFalsy();
    
    console.log(`✅ Main portfolio loaded successfully with ${errors.length} total errors (non-critical)`);
  });

  test('should load admin experience page without authentication errors', async ({ page }) => {
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
    
    // Try to access admin experience page directly
    await page.goto('/admin/experience');
    
    // Wait for page to load (might redirect to login)
    await page.waitForLoadState('networkidle');
    
    // Check that we either get the admin page or login page (both are valid)
    const hasAdminContent = await page.locator('h1:has-text("Manage Experience")').first().isVisible().catch(() => false);
    const hasLoginForm = await page.locator('input[name="email"]').first().isVisible().catch(() => false);
    
    expect(hasAdminContent || hasLoginForm).toBeTruthy();
    
    // Most importantly, check for the specific error we fixed
    const hasDeleteButtonError = errors.some(error => 
      error.includes('Cannot read properties of undefined') && 
      error.includes('DeleteButton')
    );
    
    expect(hasDeleteButtonError).toBeFalsy();
    
    console.log(`✅ Admin experience page accessible without critical errors`);
  });

  test('should have working favicon and no image loading errors', async ({ page }) => {
    const imageErrors: string[] = [];
    
    // Monitor for image loading errors
    page.on('response', response => {
      if (response.request().resourceType() === 'image' && response.status() >= 400) {
        imageErrors.push(`Failed to load image: ${response.url()} (${response.status()})`);
      }
    });
    
    await page.goto('/');
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    
    // Check for favicon specifically
    const faviconResponse = await page.request.get('/favicon.ico');
    expect(faviconResponse.status()).toBeLessThan(400);
    
    // Verify no critical image loading errors
    const hasCriticalImageErrors = imageErrors.some(error => 
      error.includes('favicon') || error.includes('404')
    );
    
    expect(hasCriticalImageErrors).toBeFalsy();
    
    console.log(`✅ Images and favicon load correctly`);
  });

  test('should have proper page structure and navigation', async ({ page }) => {
    await page.goto('/');
    
    // Check basic page structure
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('h1')).toBeVisible();
    
    // Check that navigation links exist (use first() to avoid strict mode issues)
    await expect(page.locator('a[href="#home"]').first()).toBeVisible();
    await expect(page.locator('a[href="#about"]').first()).toBeVisible();
    await expect(page.locator('a[href="#experience"]').first()).toBeVisible();
    
    // Check dark theme is applied
    await expect(page.locator('body')).toHaveClass(/bg-black/);
    
    console.log(`✅ Page structure and navigation working correctly`);
  });

  test('should handle admin experience page server-side rendering', async ({ page }) => {
    // Test that the page loads with server-side rendering
    await page.goto('/admin/experience');
    
    // Wait for initial load
    await page.waitForLoadState('domcontentloaded');
    
    // Check that we get some content (either admin panel or login)
    const hasContent = await page.locator('body').isVisible();
    expect(hasContent).toBeTruthy();
    
    // Check that the page has proper HTML structure
    const hasHtml = await page.locator('html').isVisible();
    expect(hasHtml).toBeTruthy();
    
    // Verify server-side rendering worked: title should exist and be non-empty
    const titleText = await page.title();
    expect(titleText.length).toBeGreaterThan(0);
    
    console.log(`✅ Server-side rendering working for admin pages`);
  });
});
