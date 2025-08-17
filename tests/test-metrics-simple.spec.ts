import { test, expect } from '@playwright/test';

test.describe('Simple Metrics Test', () => {
  test('Check if dashboard loads and has metrics section', async ({ page }) => {
    console.log('🧪 Testing basic dashboard and metrics...');
    
    // Login to admin
    await page.goto('/admin');
    await page.waitForSelector('input[name="email"]');
    await page.fill('input[name="email"]', 'admin@admin.com');
    await page.fill('input[name="password"]', '$iva@V3nna21');
    await page.click('button[type="submit"]');
    await page.waitForURL('/admin/dashboard');
    
    // Wait for dashboard to load
    await expect(page.locator('h1:has-text("Admin Dashboard")')).toBeVisible();
    
    // Check if metrics section header exists
    await expect(page.locator('h3:has-text("Activity Metrics")')).toBeVisible();
    
    // Wait a bit for metrics to load
    await page.waitForTimeout(5000);
    
    // Take a screenshot to see what's happening
    await page.screenshot({ path: 'dashboard-metrics-debug.png', fullPage: true });
    
    // Check console logs
    const logs = [];
    page.on('console', msg => {
      logs.push(`${msg.type()}: ${msg.text()}`);
    });
    
    // Reload to capture console logs
    await page.reload();
    await page.waitForTimeout(3000);
    
    console.log('Console logs:', logs);
    
    // Check if any metrics cards are visible
    const totalOpsCard = page.locator('text=Total Operations');
    const isVisible = await totalOpsCard.isVisible();
    console.log('Total Operations card visible:', isVisible);
    
    if (!isVisible) {
      // Check if loading state is shown
      const loadingState = page.locator('.animate-pulse');
      const isLoading = await loadingState.isVisible();
      console.log('Loading state visible:', isLoading);
      
      // Check if error state is shown
      const errorState = page.locator('text=No metrics data available');
      const hasError = await errorState.isVisible();
      console.log('Error state visible:', hasError);
    }
    
    console.log('✅ Basic dashboard test completed');
  });

  test('Test metrics API directly', async ({ page }) => {
    console.log('🧪 Testing metrics API directly...');
    
    // Login first to get auth cookie
    await page.goto('/admin');
    await page.waitForSelector('input[name="email"]');
    await page.fill('input[name="email"]', 'admin@admin.com');
    await page.fill('input[name="password"]', '$iva@V3nna21');
    await page.click('button[type="submit"]');
    await page.waitForURL('/admin/dashboard');
    
    // Test the metrics API
    const response = await page.request.get('/api/admin/metrics?type=summary&days=7');
    console.log('Metrics API status:', response.status());
    
    if (response.status() === 200) {
      const data = await response.json();
      console.log('Metrics API response:', JSON.stringify(data, null, 2));
    } else {
      const errorText = await response.text();
      console.log('Metrics API error:', errorText);
    }
    
    console.log('✅ Metrics API test completed');
  });

  test('Generate some metrics data', async ({ page }) => {
    console.log('🧪 Generating metrics data...');
    
    // Login
    await page.goto('/admin');
    await page.waitForSelector('input[name="email"]');
    await page.fill('input[name="email"]', 'admin@admin.com');
    await page.fill('input[name="password"]', '$iva@V3nna21');
    await page.click('button[type="submit"]');
    await page.waitForURL('/admin/dashboard');
    
    // Perform some operations to generate metrics
    
    // 1. Update About
    await page.click('a[href="/admin/about"]');
    await page.waitForURL('/admin/about');
    await page.waitForSelector('input[name="name"]');
    await page.fill('input[name="name"]', `Test User ${Date.now()}`);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    
    // 2. Update Contact
    await page.click('a[href="/admin/contact"]');
    await page.waitForURL('/admin/contact');
    await page.waitForSelector('input[name="email"]');
    await page.fill('input[name="email"]', `test${Date.now()}@example.com`);
    await page.click('button:has-text("Save Changes")');
    await page.waitForTimeout(2000);
    
    // 3. Go back to dashboard
    await page.click('a[href="/admin/dashboard"]');
    await page.waitForURL('/admin/dashboard');
    await page.waitForTimeout(3000);
    
    // Check metrics API again
    const response = await page.request.get('/api/admin/metrics?type=summary&days=7');
    console.log('Metrics API status after operations:', response.status());
    
    if (response.status() === 200) {
      const data = await response.json();
      console.log('Metrics after operations:', JSON.stringify(data, null, 2));
      
      // Check if we have some operations
      if (data.totalOperations > 0) {
        console.log('✅ Metrics data generated successfully');
      } else {
        console.log('⚠️ No metrics data found after operations');
      }
    } else {
      const errorText = await response.text();
      console.log('❌ Metrics API error after operations:', errorText);
    }
    
    console.log('✅ Metrics generation test completed');
  });
});
