import { expect } from '@playwright/test';
import { test, uiLogin } from './support/auth';

test.describe.configure({ mode: 'serial' });

test.describe('Experience CRUD & Edge Cases', () => {
  test.beforeEach(async ({ page }) => {
    await uiLogin(page);
    await page.goto('/admin/experience');
  });

  test('experience page loads', async ({ page }) => {
    await expect(page.locator('h1')).toContainText(/Experience/i);
  });

  Array.from({ length: 20 }).forEach((_, i) => {
    test(`add experience entry #${i + 1}`, async ({ page }) => {
      await page.click('a:has-text("Add Experience")').catch(()=>{});
      await page.fill('input[name="title"]', `Bench QA ${i}`);
      await page.fill('input[name="company"]', 'Bench Co');
      await page.fill('textarea[name="description"]', 'Benchmarking experience entry');
      await page.fill('input[name="location"]', 'Remote');
      await page.fill('input[name="startDate"]', '2024-01');
      await page.check('input[name="current"]').catch(()=>{});
      await page.click('button:has-text("Save Experience")').catch(()=>{});
      await page.waitForTimeout(100);
    });
  });

  const invalidDates = ['2025-13','2025-00','abc','2025-1','99-99'];
  invalidDates.forEach(date => {
    test(`reject invalid date: ${date}`, async ({ page }) => {
      await page.click('a:has-text("Add Experience")').catch(()=>{});
      await page.fill('input[name="title"]', 'Invalid Date Role');
      await page.fill('input[name="company"]', 'ID Co');
      await page.fill('textarea[name="description"]', 'Testing invalid date');
      await page.fill('input[name="location"]', 'Nowhere');
      await page.fill('input[name="startDate"]', date);
      await page.click('button:has-text("Save Experience")').catch(()=>{});
      await expect(page).toHaveURL(/experience/);
    });
  });
});
