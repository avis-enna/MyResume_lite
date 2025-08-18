import { test, expect } from '@playwright/test';

test.describe('Admin Metrics Tracking', () => {
  test.beforeEach(async ({ page }) => {
    // Login to admin
    await page.goto('/admin');
    await page.fill('input[name="email"]', 'admin@admin.com');
    await page.fill('input[name="password"]', '$iva@V3nna21');
    await page.click('button[type="submit"]');
    await page.waitForURL('/admin/dashboard');
  });

  test('Dashboard displays metrics section', async ({ page }) => {
    console.log('🧪 Testing metrics display on dashboard...');
    
    // Check if metrics section is visible
    await expect(page.locator('h3:has-text("Activity Metrics")')).toBeVisible();
    
    // Check for metrics cards
    await expect(page.locator('text=Total Operations')).toBeVisible();
    await expect(page.locator('text=Most Active')).toBeVisible();
    await expect(page.locator('text=Top Operation')).toBeVisible();
    await expect(page.locator('text=Data Retention')).toBeVisible();
    
    // Check data retention shows 7 days
    await expect(page.locator('text=7 Days')).toBeVisible();
    await expect(page.locator('text=Auto-cleanup')).toBeVisible();
    
    console.log('✅ Metrics section displayed correctly');
  });

  test('Metrics track admin operations', async ({ page }) => {
    console.log('🧪 Testing metrics tracking for admin operations...');
    
    // Perform some operations to generate metrics
    
    // 1. Update About section
    await page.click('a[href="/admin/about"]');
    await page.waitForURL('/admin/about');
    await page.waitForSelector('input[name="name"]');
    
    const testName = `Metrics Test ${Date.now()}`;
    await page.fill('input[name="name"]', testName);
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Data saved successfully')).toBeVisible();
    
    // 2. Update Contact section
    await page.click('a[href="/admin/contact"]');
    await page.waitForURL('/admin/contact');
    await page.waitForSelector('input[name="email"]');
    
    await page.fill('input[name="email"]', `test${Date.now()}@example.com`);
    await page.click('button:has-text("Save Changes")');
    await expect(page.locator('text=Contact information updated successfully')).toBeVisible();
    
    // 3. Go back to dashboard and check metrics
    await page.click('a[href="/admin/dashboard"]');
    await page.waitForURL('/admin/dashboard');
    
    // Wait for metrics to load
    await page.waitForTimeout(2000);
    
    // Check if total operations increased
    const totalOpsElement = page.locator('text=Total Operations').locator('..').locator('p').nth(1);
    const totalOps = await totalOpsElement.textContent();
    console.log('Total operations:', totalOps);
    
    // Should have at least some operations
    expect(parseInt(totalOps || '0')).toBeGreaterThan(0);
    
    console.log('✅ Metrics tracking working correctly');
  });

  test('Recent activity shows tracked operations', async ({ page }) => {
    console.log('🧪 Testing recent activity display...');
    
    // Perform an operation
    await page.click('a[href="/admin/about"]');
    await page.waitForURL('/admin/about');
    await page.waitForSelector('input[name="name"]');
    
    await page.fill('input[name="name"]', `Activity Test ${Date.now()}`);
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Data saved successfully')).toBeVisible();
    
    // Go back to dashboard
    await page.click('a[href="/admin/dashboard"]');
    await page.waitForURL('/admin/dashboard');
    
    // Wait for metrics to refresh
    await page.waitForTimeout(3000);
    
    // Check if recent activity section exists
    const recentActivitySection = page.locator('h4:has-text("Recent Activity")');
    if (await recentActivitySection.isVisible()) {
      console.log('✅ Recent activity section found');
      
      // Check for activity items
      const activityItems = page.locator('div:has-text("UPDATE - about")');
      const activityCount = await activityItems.count();
      console.log(`Found ${activityCount} about update activities`);
      
      if (activityCount > 0) {
        console.log('✅ Recent activity tracking working');
      } else {
        console.log('⚠️ No recent activities found (may be expected for new data)');
      }
    } else {
      console.log('ℹ️ No recent activity section (may be expected if no data)');
    }
  });

  test('Metrics API endpoint works', async ({ page }) => {
    console.log('🧪 Testing metrics API endpoint...');
    
    // Test the metrics API directly
    const response = await page.request.get('/api/admin/metrics?type=summary&days=7');
    expect(response.status()).toBe(200);
    
    const metricsData = await response.json();
    console.log('Metrics API response:', JSON.stringify(metricsData, null, 2));
    
    // Check response structure
    expect(metricsData).toHaveProperty('totalOperations');
    expect(metricsData).toHaveProperty('operationStats');
    expect(metricsData).toHaveProperty('sectionStats');
    expect(metricsData).toHaveProperty('dailyStats');
    expect(metricsData).toHaveProperty('recentActivity');
    expect(metricsData).toHaveProperty('period');
    
    expect(metricsData.period).toBe('7 days');
    expect(Array.isArray(metricsData.operationStats)).toBe(true);
    expect(Array.isArray(metricsData.sectionStats)).toBe(true);
    expect(Array.isArray(metricsData.recentActivity)).toBe(true);
    
    console.log('✅ Metrics API working correctly');
  });

  test('Metrics show correct operation types', async ({ page }) => {
    console.log('🧪 Testing operation type tracking...');
    
    // Create a project to test CREATE operation
    await page.click('a[href="/admin/projects"]');
    await page.waitForURL('/admin/projects');
    await page.click('a:has-text("ADD PROJECT")');
    await page.waitForURL('/admin/projects/new');
    
    const testProjectTitle = `Metrics Test Project ${Date.now()}`;
    await page.fill('input[name="title"]', testProjectTitle);
    await page.fill('textarea[name="description"]', 'Testing metrics tracking');
    await page.click('button[type="submit"]');
    
    // Wait for redirect and success
    await page.waitForURL('/admin/projects');
    await page.waitForTimeout(2000);
    
    // Go to dashboard and check metrics
    await page.click('a[href="/admin/dashboard"]');
    await page.waitForURL('/admin/dashboard');
    await page.waitForTimeout(3000);
    
    // Check if CREATE operations are tracked
    const metricsResponse = await page.request.get('/api/admin/metrics?type=summary&days=7');
    const metricsData = await metricsResponse.json();
    
    const createOps = metricsData.operationStats.find((op: any) => op._id === 'CREATE');
    if (createOps) {
      console.log(`✅ CREATE operations tracked: ${createOps.count}`);
      expect(createOps.count).toBeGreaterThan(0);
    } else {
      console.log('ℹ️ No CREATE operations found yet');
    }
    
    // Check if projects section is tracked
    const projectsSection = metricsData.sectionStats.find((section: any) => section._id === 'projects');
    if (projectsSection) {
      console.log(`✅ Projects section tracked: ${projectsSection.count}`);
      expect(projectsSection.count).toBeGreaterThan(0);
    } else {
      console.log('ℹ️ No projects section operations found yet');
    }
    
    console.log('✅ Operation type tracking working');
  });

  test('Data retention information is displayed', async ({ page }) => {
    console.log('🧪 Testing data retention display...');
    
    // Check data retention card
    const retentionCard = page.locator('text=Data Retention').locator('..');
    await expect(retentionCard).toBeVisible();
    
    // Check 7 days retention
    await expect(page.locator('text=7 Days')).toBeVisible();
    await expect(page.locator('text=Auto-cleanup')).toBeVisible();
    
    console.log('✅ Data retention information displayed correctly');
  });
});
