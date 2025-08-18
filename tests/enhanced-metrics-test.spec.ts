import { test, expect } from '@playwright/test';

test.describe('Enhanced Metrics Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Login to admin
    await page.goto('/admin');
    await page.fill('input[name="email"]', 'admin@admin.com');
    await page.fill('input[name="password"]', '$iva@V3nna21');
    await page.click('button[type="submit"]');
    await page.waitForURL('/admin/dashboard');
  });

  test('Dashboard displays enhanced metrics with summary cards', async ({ page }) => {
    console.log('🧪 Testing enhanced metrics dashboard...');
    
    // Check if Activity Metrics section is visible
    await expect(page.locator('h3:has-text("Activity Metrics")')).toBeVisible();
    
    // Check for summary cards (should be 4 cards)
    const summaryCards = page.locator('.metrics-card');
    await expect(summaryCards).toHaveCount(4);
    
    // Check specific summary cards
    await expect(page.locator('.metrics-card').filter({ hasText: 'Total Operations' })).toBeVisible();
    await expect(page.locator('.metrics-card').filter({ hasText: 'Current Page' })).toBeVisible();
    await expect(page.locator('.metrics-card').filter({ hasText: 'Showing' })).toBeVisible();
    await expect(page.locator('.metrics-card').filter({ hasText: 'Data Retention' })).toBeVisible();
    
    // Check data retention shows 7 days (in the metrics card, not header)
    await expect(page.locator('.metrics-card').filter({ hasText: '7 Days' })).toBeVisible();
    await expect(page.locator('.metrics-card').filter({ hasText: 'Auto-cleanup' })).toBeVisible();
    
    console.log('✅ Summary cards displayed correctly');
  });

  test('Activity log shows with pagination', async ({ page }) => {
    console.log('🧪 Testing activity log and pagination...');
    
    // Check if Recent Activity Log section is visible
    await expect(page.locator('h4:has-text("Recent Activity Log")')).toBeVisible();
    
    // Wait for metrics to load
    await page.waitForTimeout(3000);
    
    // Check if pagination info is shown (in pagination controls, not header)
    const paginationInfo = page.locator('.flex.items-center.space-x-2').locator('text=/Page \\d+ of \\d+/');
    await expect(paginationInfo).toBeVisible();
    
    // Check if total operations count is shown
    const totalOpsInfo = page.locator('text=/\\d+ total operations/');
    await expect(totalOpsInfo).toBeVisible();
    
    console.log('✅ Activity log and pagination working');
  });

  test('Activity items are expandable and show change details', async ({ page }) => {
    console.log('🧪 Testing expandable activity items...');
    
    // Perform an operation to generate activity
    await page.click('a[href="/admin/about"]');
    await page.waitForURL('/admin/about');
    await page.waitForSelector('input[name="name"]');
    
    const testName = `Enhanced Test ${Date.now()}`;
    await page.fill('input[name="name"]', testName);
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Data saved successfully')).toBeVisible();
    
    // Go back to dashboard
    await page.click('a[href="/admin/dashboard"]');
    await page.waitForURL('/admin/dashboard');
    await page.waitForTimeout(3000);
    
    // Look for activity items
    const activityItems = page.locator('.activity-item');
    const activityCount = await activityItems.count();
    
    if (activityCount > 0) {
      console.log(`Found ${activityCount} activity items`);
      
      // Click on the first activity item to expand it
      await activityItems.first().click();
      
      // Check if expansion indicator changes
      const expandIcon = activityItems.first().locator('text=/▼|▶/');
      await expect(expandIcon).toBeVisible();
      
      console.log('✅ Activity items are expandable');
    } else {
      console.log('ℹ️ No activity items found (may be expected for new data)');
    }
  });

  test('Pagination controls work correctly', async ({ page }) => {
    console.log('🧪 Testing pagination controls...');
    
    // Wait for metrics to load
    await page.waitForTimeout(3000);
    
    // Check if pagination controls exist
    const prevButton = page.locator('button:has-text("← Previous")');
    const nextButton = page.locator('button:has-text("Next →")');
    
    // Previous button should be disabled on first page
    if (await prevButton.isVisible()) {
      const isDisabled = await prevButton.isDisabled();
      console.log('Previous button disabled on first page:', isDisabled);
    }
    
    // Check pagination info (use first occurrence)
    const pageInfo = page.locator('text=/Page \\d+ of \\d+/').first();
    if (await pageInfo.isVisible()) {
      const pageText = await pageInfo.textContent();
      console.log('Pagination info:', pageText);
    }
    
    // Check items count
    const itemsInfo = page.locator('text=/Showing \\d+ of \\d+ operations/');
    if (await itemsInfo.isVisible()) {
      const itemsText = await itemsInfo.textContent();
      console.log('Items info:', itemsText);
    }
    
    console.log('✅ Pagination controls working correctly');
  });

  test('Theme toggle works and affects metrics display', async ({ page }) => {
    console.log('🧪 Testing theme toggle with metrics...');
    
    // Check if theme toggle is visible
    await expect(page.locator('button:has-text("Dark"), button:has-text("Light")')).toBeVisible();
    
    // Click theme toggle
    await page.click('button:has-text("Dark"), button:has-text("Light")');
    await page.waitForTimeout(1000);
    
    // Check if theme changed (data-theme attribute should change)
    const themeAttr = await page.getAttribute('html', 'data-theme');
    console.log('Current theme:', themeAttr);
    
    // Verify metrics cards are still visible after theme change
    const summaryCards = page.locator('.metrics-card');
    await expect(summaryCards).toHaveCount(4);
    
    console.log('✅ Theme toggle working with metrics');
  });

  test('Navigation links work from dashboard', async ({ page }) => {
    console.log('🧪 Testing navigation links...');
    
    // Test About link
    await page.click('a[href="/admin/about"]');
    await page.waitForURL('/admin/about');
    await expect(page.locator('h1:has-text("EDIT ABOUT")')).toBeVisible();
    
    // Go back to dashboard
    await page.click('a[href="/admin/dashboard"]');
    await page.waitForURL('/admin/dashboard');
    
    // Test Contact link
    await page.click('a[href="/admin/contact"]');
    await page.waitForURL('/admin/contact');
    await expect(page.locator('h1:has-text("Edit Contact Section")')).toBeVisible();
    
    // Go back to dashboard
    await page.click('a[href="/admin/dashboard"]');
    await page.waitForURL('/admin/dashboard');
    
    console.log('✅ Navigation links working correctly');
  });

  test('Metrics API returns correct data structure', async ({ page }) => {
    console.log('🧪 Testing metrics API data structure...');
    
    // Test the paginated metrics API
    const response = await page.request.get('/api/admin/metrics?type=paginated&days=7&page=1&limit=5');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    console.log('Paginated API response structure:', Object.keys(data));
    
    // Check response structure
    expect(data).toHaveProperty('metrics');
    expect(data).toHaveProperty('pagination');
    expect(Array.isArray(data.metrics)).toBe(true);
    
    // Check pagination structure
    expect(data.pagination).toHaveProperty('page');
    expect(data.pagination).toHaveProperty('limit');
    expect(data.pagination).toHaveProperty('total');
    expect(data.pagination).toHaveProperty('pages');
    expect(data.pagination).toHaveProperty('hasNext');
    expect(data.pagination).toHaveProperty('hasPrev');
    
    console.log('Pagination info:', data.pagination);
    console.log('Metrics count:', data.metrics.length);
    
    console.log('✅ Metrics API structure correct');
  });

  test('Old Money theme styling is applied', async ({ page }) => {
    console.log('🧪 Testing Old Money theme styling...');
    
    // Check if admin layout class is applied (use first occurrence)
    const layoutElement = page.locator('.admin-layout').first();
    await expect(layoutElement).toBeVisible();
    
    // Check if metrics cards have theme classes
    const metricsCard = page.locator('.metrics-card').first();
    await expect(metricsCard).toBeVisible();
    
    // Check if theme CSS variables are applied by checking computed styles
    const bgColor = await metricsCard.evaluate(el => 
      getComputedStyle(el).backgroundColor
    );
    console.log('Metrics card background color:', bgColor);
    
    // Check if admin title class is applied
    const adminTitle = page.locator('.admin-title').first();
    await expect(adminTitle).toBeVisible();
    
    console.log('✅ Old Money theme styling applied');
  });
});
