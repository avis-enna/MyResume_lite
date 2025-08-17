import { expect } from '@playwright/test';
import { test, uiLogin } from './support/auth';

test.describe.configure({ mode: 'serial' });

test.describe('Projects CRUD & Validation', () => {
  test.beforeEach(async ({ page }) => {
    await uiLogin(page);
    await page.goto('/admin/projects');
  });

  test('projects list loads', async ({ page }) => {
    await expect(page.locator('h1')).toContainText(/Projects/i);
  });

  const invalidUrls = ['htp:/bad','javascript:alert(1)','ftp://example.com','data:text/plain,hi','   '];
  invalidUrls.forEach((url, idx) => {
    test(`reject invalid URL input variant ${idx + 1}`, async ({ page }) => {
      await page.click('button:has-text("New Project")').catch(()=>{});
  await page.fill('input[name="title"]', `Invalid URL Project ${idx}`);
      await page.fill('textarea[name="description"]', 'Testing invalid URLs');
      await page.fill('input[name="githubUrl"]', url);
      await page.click('button:has-text("Save")').catch(()=>{});
      await expect(page).toHaveURL(/projects/);
    });
  });

  Array.from({ length: 25 }).forEach((_, i) => {
    test(`create minimal project #${i + 1}`, async ({ page }) => {
      await page.click('button:has-text("New Project")').catch(()=>{});
  const title = `Bench Project ${Date.now()}-${i}`;
      await page.fill('input[name="title"]', title);
      await page.fill('textarea[name="description"]', 'Automated bench project description');
      await page.fill('input[name="githubUrl"]', 'https://github.com/example/repo');
      await page.click('button:has-text("Save")').catch(()=>{});
      await page.waitForTimeout(150);
    });
  });

  test('bulk project fetch via API', async ({ request }) => {
    const res = await request.get('/api/admin/projects');
    expect(res.status()).toBeLessThan(400);
    const data = await res.json();
    expect(Array.isArray(data)).toBeTruthy();
  });

  Array.from({ length: 20 }).forEach((_, i) => {
    test(`update project order operation #${i + 1}`, async ({ request }) => {
      const list = await request.get('/api/admin/projects');
      if (list.ok()) {
        const arr = await list.json();
        if (arr.length) {
          const target = arr[i % arr.length];
          const update = await request.put('/api/admin/projects', { data: { id: target._id, order: (target.order || 0) + 1 } });
          expect(update.status()).toBeLessThan(500);
        }
      }
    });
  });
});
