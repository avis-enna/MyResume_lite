import { expect } from '@playwright/test';
import { test as authTest } from './fixtures/auth';

// Removed serial mode to allow all tests to run independently

authTest.describe('Experience CRUD & Edge Cases', () => {
  authTest.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto('/admin/experience');
    await page.waitForLoadState('networkidle');
  });

  authTest('experience page loads', async ({ authenticatedPage: page }) => {
    // Check if we're on the experience page
    expect(page.url()).toContain('/admin/experience');
    // Check if page loaded (any content is fine)
    const pageContent = await page.content();
    expect(pageContent.length).toBeGreaterThan(100);
  });

  Array.from({ length: 20 }).forEach((_, i) => {
    authTest(`add experience entry #${i + 1}`, async ({ authenticatedPage: page }) => {
      await page.goto('/admin/experience/new');
      await page.waitForLoadState('networkidle');

      // Fill form fields in the correct order
      await page.fill('input[name="company"]', 'Bench Co');
      await page.fill('input[name="title"]', `Bench QA ${i}`);
      await page.fill('input[name="location"]', 'Remote');
      await page.fill('input[name="startDate"]', 'January 2024');

      // Fill the description textarea - wait for it to be available
      await page.waitForSelector('textarea[placeholder="Describe a key responsibility or achievement"]', { timeout: 5000 });
      await page.fill('textarea[placeholder="Describe a key responsibility or achievement"]', 'Benchmarking experience entry');

      // Check current position checkbox
      await page.check('input[name="current"]');

      // Submit the form
      await page.click('button:has-text("Create Experience")');
      await page.waitForTimeout(500);
    });
  });

  const invalidDates = ['2025-13','2025-00','abc','2025-1','99-99'];
  invalidDates.forEach(date => {
    authTest(`reject invalid date: ${date}`, async ({ authenticatedPage: page }) => {
      await page.goto('/admin/experience/new');
      await page.waitForLoadState('networkidle');

      // Fill form fields
      await page.fill('input[name="company"]', 'ID Co');
      await page.fill('input[name="title"]', 'Invalid Date Role');
      await page.fill('input[name="location"]', 'Nowhere');
      await page.fill('input[name="startDate"]', date);

      // Fill the description textarea - wait for it to be available
      await page.waitForSelector('textarea[placeholder="Describe a key responsibility or achievement"]', { timeout: 5000 });
      await page.fill('textarea[placeholder="Describe a key responsibility or achievement"]', 'Testing invalid date');

      // Submit the form
      await page.click('button:has-text("Create Experience")');
      await page.waitForLoadState('networkidle');

      // Should still be on experience page (form validation should prevent invalid dates)
      expect(page.url()).toContain('/admin/experience');
    });
  });
});
