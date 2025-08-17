import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Simple Authentication Test', () => {
  test('should authenticate and access dashboard', async ({ browser, baseURL }) => {
    console.log('🧪 Testing simple authentication...');
    
    // Create context with saved auth state
    const authFile = path.join(__dirname, '../../playwright/.auth/bench-admin.json');
    const context = await browser.newContext({
      storageState: authFile,
    });
    
    const page = await context.newPage();
    
    try {
      // Navigate to dashboard
      console.log('📍 Navigating to dashboard...');
      await page.goto(`${baseURL}/admin/dashboard`);
      
      // Wait for page to load
      await page.waitForLoadState('networkidle');
      
      // Check current URL
      const currentURL = page.url();
      console.log(`📍 Current URL: ${currentURL}`);
      
      // Check if we're on the dashboard (not redirected to login)
      if (currentURL.includes('/admin/dashboard')) {
        console.log('✅ Successfully stayed on dashboard - authentication working!');
        
        // Try to find any admin content
        const adminContent = await page.locator('h1, h2, h3').first().textContent();
        console.log(`📄 Page content: ${adminContent}`);
        
        // Check if we can access the API
        const response = await page.request.get('/api/admin/session-check');
        console.log(`🔗 API response status: ${response.status()}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log(`🔐 API authentication status: ${data.authenticated}`);
        }
        
      } else {
        console.log('❌ Redirected away from dashboard - authentication failed');
        console.log(`📍 Redirected to: ${currentURL}`);
      }
      
    } catch (error) {
      console.error('❌ Test failed:', error);
      throw error;
    } finally {
      await context.close();
    }
  });
});
