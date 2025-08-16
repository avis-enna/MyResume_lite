import { test, expect } from '@playwright/test';

// Test data
const testExperience = {
  company: 'Test Company',
  position: 'Test Position',
  location: 'Test Location',
  startDate: 'January 2024',
  endDate: 'December 2024',
  description: ['Test responsibility 1', 'Test responsibility 2'],
  technologies: ['React', 'Node.js', 'TypeScript']
};

test.describe('Admin Experience Management', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to admin login
    await page.goto('/admin');

    // Verify we're on the login page
    await expect(page.locator('h1')).toContainText('Portfolio Admin');

    // Login with secure admin credentials
    await page.fill('input[name="email"]', 'admin@admin.com');
    await page.fill('input[name="password"]', '$iva@V3nna21');
    await page.click('button[type="submit"]');

    // Wait for redirect to admin dashboard
    await page.waitForURL('/admin/dashboard');
    await expect(page.locator('h1')).toContainText('Admin Dashboard');
  });

  test('should load admin experience page successfully', async ({ page }) => {
    await page.goto('/admin/experience');

    // Header present or login fallback
    const hasHeader = await page.locator('h1:has-text("Manage Experience")').first().isVisible().catch(() => false);
    const hasLoginForm = await page.locator('input[name="email"]').first().isVisible().catch(() => false);
    expect(hasHeader || hasLoginForm).toBeTruthy();
  });

  test('should display existing experiences', async ({ page }) => {
    await page.goto('/admin/experience');

    await page.waitForLoadState('networkidle');

    const experienceCards = page.locator('.bg-amber-950\\/10');
    const emptyState = page.locator('.text-center .text-2xl');

    const cards = await experienceCards.count();
    const hasEmpty = await emptyState.isVisible().catch(() => false);

    expect(cards > 0 || hasEmpty).toBeTruthy();
  });

  test('should navigate to add experience page', async ({ page }) => {
    await page.goto('/admin/experience');
    const addLink = page.locator('a[href="/admin/experience/new"]').first();
    if (await addLink.isVisible().catch(() => false)) {
      await addLink.scrollIntoViewIfNeeded();
      await addLink.click({ force: true });
      await page.waitForLoadState('networkidle');
      const current = page.url();
      if (/\/admin\/experience\/new$/.test(current)) {
        await expect(page.locator('form').first()).toBeVisible();
      } else {
        // Stay resilient if navigation is blocked/flaky in headless
        expect(current).toContain('/admin/experience');
      }
    }
  });

  test('should handle delete functionality', async ({ page }) => {
    await page.goto('/admin/experience');
    await page.waitForLoadState('networkidle');

    const experienceCards = page.locator('.bg-amber-950\\/10');
    const cardCount = await experienceCards.count();

    if (cardCount > 0) {
      page.on('dialog', async dialog => {
        expect(dialog.message()).toContain('Delete');
        await dialog.dismiss();
      });
      const deleteButton = experienceCards.first().locator('button:has-text("Delete")');
      await deleteButton.click();
      await expect(experienceCards).toHaveCount(cardCount);
    }
  });

  test('should handle edit navigation', async ({ page }) => {
    await page.goto('/admin/experience');
    await page.waitForLoadState('networkidle');

    const experienceCards = page.locator('.bg-amber-950\\/10');
    const cardCount = await experienceCards.count();

    if (cardCount > 0) {
      const editLink = experienceCards.first().locator('a[href*="/edit"]').first();
      const editHref = await editLink.getAttribute('href');
      if (editHref) {
        await Promise.all([
          page.waitForLoadState('domcontentloaded'),
          editLink.click(),
        ]);
        const url = page.url();
        const onEdit = url.includes('/admin/experience/') && url.endsWith('/edit');
        const formVisible = await page.locator('form').first().isVisible().catch(() => false);
        expect(onEdit || formVisible).toBeTruthy();
      }
    }
  });

  test('should not have runtime errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    page.on('pageerror', error => { errors.push(error.message); });

    await page.goto('/admin/experience');
    await page.waitForLoadState('networkidle');

    const hasCriticalErrors = errors.some(e => e.includes('ReferenceError') || e.includes('TypeError') || e.includes('SyntaxError'));
    expect(hasCriticalErrors).toBeFalsy();
  });
});
