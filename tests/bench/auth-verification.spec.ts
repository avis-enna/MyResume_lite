import { test, expect } from './fixtures/auth';

test.describe('Authentication Verification', () => {
  test('should maintain authenticated state across tests', async ({ authenticatedPage: page, baseURL }) => {
    console.log('🧪 Testing authentication persistence...');

    // Should already be on dashboard from fixture
    await expect(page).toHaveURL(`${baseURL}/admin/dashboard`);
    await expect(page.locator('h1:has-text("Admin Dashboard")')).toBeVisible();
    
    console.log('✅ Dashboard access confirmed');
    
    // Test navigation to other admin pages
    await page.click('a[href="/admin/about"]');
    await page.waitForURL(`${baseURL}/admin/about`);
    await expect(page.locator('h1:has-text("EDIT ABOUT")')).toBeVisible();

    console.log('✅ About page access confirmed');

    // Test navigation to contact page
    await page.click('a[href="/admin/contact"]');
    await page.waitForURL(`${baseURL}/admin/contact`);
    await expect(page.locator('h1:has-text("Edit Contact Section")')).toBeVisible();

    console.log('✅ Contact page access confirmed');

    // Test navigation to skills page
    await page.click('a[href="/admin/skills"]');
    await page.waitForURL(`${baseURL}/admin/skills`);
    await expect(page.locator('h1:has-text("Skills Management")')).toBeVisible();

    console.log('✅ Skills page access confirmed');

    // Return to dashboard
    await page.click('a[href="/admin/dashboard"]');
    await page.waitForURL(`${baseURL}/admin/dashboard`);
    await expect(page.locator('h1:has-text("Admin Dashboard")')).toBeVisible();
    
    console.log('✅ Authentication persistence test completed successfully');
  });

  test('should handle session validation', async ({ authenticatedPage: page, baseURL }) => {
    console.log('🧪 Testing session validation...');

    // Check if session is valid by making an API call
    const response = await page.request.get('/api/admin/session-check');
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data.authenticated).toBe(true);

    console.log('✅ Session validation confirmed via API');
  });

  test('should access metrics dashboard', async ({ authenticatedPage: page, baseURL }) => {
    console.log('🧪 Testing metrics dashboard access...');

    // Should already be on dashboard
    await expect(page).toHaveURL(`${baseURL}/admin/dashboard`);
    
    // Check if metrics section is visible
    await expect(page.locator('h3:has-text("Activity Metrics")')).toBeVisible();
    
    // Check if metrics cards are present
    const metricsCards = page.locator('.metrics-card');
    await expect(metricsCards).toHaveCount(4);
    
    console.log('✅ Metrics dashboard access confirmed');
  });
});
