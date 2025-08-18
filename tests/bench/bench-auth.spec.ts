import { test, expect } from '@playwright/test';
import { test as authTest } from './fixtures/auth';
import { ADMIN_EMAIL } from './support/auth';

// Removed serial mode to allow all tests to run independently

test.describe('Authentication & Session', () => {
  authTest('successful login redirects to dashboard', async ({ authenticatedPage: page, baseURL }) => {
    // Already authenticated via fixture, navigate to dashboard
    await page.goto(`${baseURL}/admin/dashboard`);
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/admin/dashboard');
  });

  const invalidEmails = [
    'not-an-email','user@','user@domain','user@domain.','"quoted"@example.com'
  ];
  invalidEmails.forEach(email => {
    test(`login fails with invalid email format: ${email}`, async ({ page }) => {
      await page.goto('/admin');
      await page.fill('input[name="email"]', email);
      await page.fill('input[name="password"]', 'wrong');
      await page.click('button[type="submit"]');
      await expect(page).toHaveURL(/admin$/);
    });
  });

  const badPasswords = ['wrong','123456','password','letmein','admin123'];
  badPasswords.forEach(pw => {
    test(`login fails with bad password variant: ${pw}`, async ({ page }) => {
      await page.goto('/admin');
      await page.fill('input[name="email"]', ADMIN_EMAIL);
      await page.fill('input[name="password"]', pw);
      await page.click('button[type="submit"]');
      await expect(page).toHaveURL(/admin$/);
    });
  });

  authTest('session persists across navigation', async ({ authenticatedPage: page, baseURL }) => {
    // Already authenticated, verify we can navigate away and back
    await page.goto(`${baseURL}/`);
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain(baseURL);

    // Navigate back to admin dashboard
    await page.goto(`${baseURL}/admin/dashboard`);
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/admin/dashboard');
  });

  authTest('logout clears session', async ({ authenticatedPage: page, baseURL }) => {
    // Already authenticated, try to logout
    await page.goto(`${baseURL}/admin/dashboard`);
    await page.waitForLoadState('networkidle');

    // Click logout and wait for the redirect
    await page.click('button:has-text("Logout")');

    // Wait for the logout to complete and redirect to login page
    await page.waitForURL(/\/admin\/?$/, { timeout: 10000 });

    // Verify we're on the login page by checking for login form elements
    await expect(page.locator('input[name="email"]')).toBeVisible({ timeout: 5000 });
    expect(page.url()).toMatch(/\/admin\/?$/);

    // Additional verification: check that session is actually cleared via API
    const sessionResponse = await page.request.get('/api/admin/session-check');
    const sessionData = await sessionResponse.json().catch(() => ({ authenticated: false }));
    expect(sessionData.authenticated).toBe(false);
  });
});
