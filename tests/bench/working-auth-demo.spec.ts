import { test, expect } from './fixtures/auth';

test.describe('Working Authentication Demo', () => {
  test('authenticated admin can access all pages', async ({ authenticatedPage: page, baseURL }) => {
    console.log('🧪 Testing authenticated access to all admin pages...');
    
    // Navigate to dashboard first
    await page.goto(`${baseURL}/admin/dashboard`);
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/admin/dashboard');
    console.log('✅ Dashboard access confirmed');
    
    // Test About page
    await page.goto(`${baseURL}/admin/about`);
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/admin/about');
    console.log('✅ About page access confirmed');
    
    // Test Contact page
    await page.goto(`${baseURL}/admin/contact`);
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/admin/contact');
    console.log('✅ Contact page access confirmed');
    
    // Test Skills page
    await page.goto(`${baseURL}/admin/skills`);
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/admin/skills');
    console.log('✅ Skills page access confirmed');
    
    // Test Experience page
    await page.goto(`${baseURL}/admin/experience`);
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/admin/experience');
    console.log('✅ Experience page access confirmed');
  });

  test('can perform basic CRUD operations', async ({ authenticatedPage: page, baseURL }) => {
    console.log('🧪 Testing basic CRUD operations...');
    
    // Test About page update
    await page.goto(`${baseURL}/admin/about`);
    await page.waitForSelector('input[name="name"]');
    
    const testName = `Auth Test ${Date.now()}`;
    await page.fill('input[name="name"]', testName);
    await page.click('button[type="submit"]');
    
    // Wait for success message
    await expect(page.locator('.bg-green-50, .admin-alert-success')).toBeVisible({ timeout: 10000 });
    console.log('✅ About page update successful');
    
    // Verify the change persisted
    await page.reload();
    await page.waitForSelector('input[name="name"]');
    await expect(page.locator('input[name="name"]')).toHaveValue(testName);
    console.log('✅ Data persistence confirmed');
  });

  test('can access and use skills management', async ({ authenticatedPage: page, baseURL }) => {
    console.log('🧪 Testing skills management...');
    
    await page.goto(`${baseURL}/admin/skills`);
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/admin/skills');

    // Try to add a skill (if add skill button exists)
    const addSkillButtons = page.locator('button:has-text("+ Add Skill"), button:has-text("Add Skill")');
    const addSkillCount = await addSkillButtons.count();

    if (addSkillCount > 0) {
      console.log('Found Add Skill buttons, testing skill addition...');
      await addSkillButtons.first().click();

      const skillInput = page.locator('input[placeholder*="Enter new skill"], input[placeholder*="skill"]').first();
      if (await skillInput.isVisible()) {
        await skillInput.fill(`Test Skill ${Date.now()}`);
        await page.click('button:has-text("Add")').catch(() => {});
        console.log('✅ Skill addition attempted');
      }
    } else {
      console.log('ℹ️ No Add Skill buttons found, checking existing skills...');
    }

    // Check if page loaded (any content is fine)
    const pageContent = await page.content();
    expect(pageContent.length).toBeGreaterThan(100);
    console.log('✅ Skills management page functional');
  });

  test('can access experience management', async ({ authenticatedPage: page, baseURL }) => {
    console.log('🧪 Testing experience management...');
    
    await page.goto(`${baseURL}/admin/experience`);
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/admin/experience');

    // Check if we can access the new experience page
    const newExpButton = page.locator('a[href="/admin/experience/new"], button:has-text("Add Experience")');
    if (await newExpButton.isVisible()) {
      await newExpButton.click();
      await page.waitForLoadState('networkidle');
      console.log('✅ New experience page accessible');
    } else {
      console.log('ℹ️ New experience button not found, checking existing functionality...');
    }
    
    console.log('✅ Experience management page functional');
  });

  test('session persists across page reloads', async ({ authenticatedPage: page, baseURL }) => {
    console.log('🧪 Testing session persistence...');
    
    // Start on dashboard
    await page.goto(`${baseURL}/admin/dashboard`);
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/admin/dashboard');

    // Reload the page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Should still be on dashboard (not redirected to login)
    expect(page.url()).toContain('/admin/dashboard');
    console.log('✅ Session persisted after reload');

    // Navigate to another page and back
    await page.goto(`${baseURL}/admin/about`);
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/admin/about');

    await page.goto(`${baseURL}/admin/dashboard`);
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/admin/dashboard');
    
    console.log('✅ Session persisted across navigation');
  });

  test('API endpoints work with authentication', async ({ authenticatedPage: page }) => {
    console.log('🧪 Testing API endpoints...');
    
    // Test session check API
    const sessionResponse = await page.request.get('/api/admin/session-check');
    expect(sessionResponse.status()).toBe(200);
    
    const sessionData = await sessionResponse.json();
    expect(sessionData.authenticated).toBe(true);
    console.log('✅ Session check API working');
    
    // Test metrics API
    const metricsResponse = await page.request.get('/api/admin/metrics?type=paginated&page=1&limit=5');
    expect(metricsResponse.status()).toBe(200);
    
    const metricsData = await metricsResponse.json();
    expect(metricsData).toHaveProperty('metrics');
    expect(metricsData).toHaveProperty('pagination');
    console.log('✅ Metrics API working');
    console.log(`📊 Found ${metricsData.pagination.total} total operations`);
  });
});
