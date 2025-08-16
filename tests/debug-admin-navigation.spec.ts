import { test, expect } from '@playwright/test';

test.describe('Debug Admin Navigation', () => {
  test('should debug admin dashboard and navigation', async ({ page }) => {
    // Step 1: Login to admin
    console.log('🔍 Step 1: Navigating to admin login...');
    await page.goto('/admin');
    
    console.log('🔍 Step 2: Filling login credentials...');
    await page.fill('input[name="email"]', 'admin@admin.com');
    await page.fill('input[name="password"]', '$iva@V3nna21');
    await page.click('button[type="submit"]');
    
    console.log('🔍 Step 3: Waiting for dashboard...');
    await page.waitForURL('/admin/dashboard');
    await expect(page.locator('h1')).toContainText('Admin Dashboard');
    
    console.log('🔍 Step 4: Taking screenshot of dashboard...');
    await page.screenshot({ path: 'debug-dashboard.png' });
    
    console.log('🔍 Step 5: Looking for admin/about link...');
    const aboutLink = page.locator('a[href="/admin/about"]');
    const aboutLinkExists = await aboutLink.count();
    console.log(`About link count: ${aboutLinkExists}`);
    
    if (aboutLinkExists > 0) {
      console.log('🔍 Step 6: About link found, clicking...');
      await aboutLink.click();
      
      console.log('🔍 Step 7: Waiting for About Management page...');
      try {
        await page.waitForSelector('h1:has-text("About Management")', { timeout: 10000 });
        console.log('✅ About Management page loaded successfully!');
      } catch (error) {
        console.log('❌ About Management page failed to load');
        console.log('Current URL:', await page.url());
        console.log('Page title:', await page.title());
        
        // Take screenshot of current state
        await page.screenshot({ path: 'debug-about-failed.png' });
        
        // Check what's actually on the page
        const h1Elements = await page.locator('h1').allTextContents();
        console.log('H1 elements found:', h1Elements);
        
        throw error;
      }
    } else {
      console.log('❌ About link not found on dashboard');
      
      // List all links on the page
      const allLinks = await page.locator('a').allTextContents();
      console.log('All links on dashboard:', allLinks);
      
      // Take screenshot
      await page.screenshot({ path: 'debug-no-about-link.png' });
      
      throw new Error('About link not found on dashboard');
    }
  });
});
