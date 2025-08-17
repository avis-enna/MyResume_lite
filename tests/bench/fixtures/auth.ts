import { test as base, expect } from '@playwright/test';
import path from 'path';

// Extend the base test with authentication
export const test = base.extend<{
  authenticatedPage: any;
}>({
  authenticatedPage: async ({ browser, baseURL }, use) => {
    // Create a new context with the saved authentication state
    const authFile = path.join(__dirname, '../../../playwright/.auth/bench-admin.json');
    
    const context = await browser.newContext({
      storageState: authFile,
    });
    
    const page = await context.newPage();
    
    // Navigate directly to admin dashboard to verify authentication
    await page.goto(`${baseURL}/admin/dashboard`);

    // Verify we're authenticated (should not redirect to login)
    try {
      await expect(page).toHaveURL(`${baseURL}/admin/dashboard`);
      await expect(page.locator('h1:has-text("Admin Dashboard")')).toBeVisible({ timeout: 5000 });
      console.log('✅ Authentication verified for test');
    } catch (error) {
      console.error('❌ Authentication verification failed:', error);
      
      // If auth fails, try to re-authenticate
      console.log('🔄 Attempting to re-authenticate...');
      await page.goto(`${baseURL}/admin`);
      await page.fill('input[name="email"]', 'admin@admin.com');
      await page.fill('input[name="password"]', '$iva@V3nna21');
      await page.click('button[type="submit"]');
      await page.waitForURL(`${baseURL}/admin/dashboard`, { timeout: 10000 });
      
      console.log('✅ Re-authentication successful');
    }
    
    await use(page);
    await context.close();
  },
});

export { expect } from '@playwright/test';
