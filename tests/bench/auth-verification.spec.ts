import { test, expect } from './fixtures/auth';

test.describe('Authentication Verification', () => {
  test('should maintain authenticated state across tests', async ({ authenticatedPage: page, baseURL }) => {
    console.log('🧪 Testing authentication persistence...');

    // Navigate to dashboard first
    await page.goto(`${baseURL}/admin/dashboard`);
    await page.waitForLoadState('networkidle');

    // Check if we're authenticated (not redirected to login)
    const currentUrl = page.url();
    expect(currentUrl).toContain('/admin');
    expect(currentUrl).not.toMatch(/\/admin\/?$/); // Not just /admin or /admin/

    console.log('✅ Dashboard access confirmed');
    
    // Test navigation to other admin pages
    await page.goto(`${baseURL}/admin/about`);
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/admin/about');

    console.log('✅ About page access confirmed');

    // Test navigation to contact page
    await page.goto(`${baseURL}/admin/contact`);
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/admin/contact');

    console.log('✅ Contact page access confirmed');

    // Test navigation to skills page
    await page.goto(`${baseURL}/admin/skills`);
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/admin/skills');

    console.log('✅ Skills page access confirmed');

    // Return to dashboard
    await page.goto(`${baseURL}/admin/dashboard`);
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/admin/dashboard');
    
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

    // Navigate to dashboard
    await page.goto(`${baseURL}/admin/dashboard`);
    await page.waitForLoadState('networkidle');

    // Check if we're on the dashboard
    expect(page.url()).toContain('/admin/dashboard');

    // Check if page loaded (any content is fine)
    const pageContent = await page.content();
    expect(pageContent.length).toBeGreaterThan(100);

    console.log('✅ Metrics dashboard access confirmed');
  });
});
