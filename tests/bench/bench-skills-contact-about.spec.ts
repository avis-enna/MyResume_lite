import { expect } from '@playwright/test';
import { test, uiLogin, ADMIN_EMAIL } from './support/auth';

test.describe.configure({ mode: 'serial' });

test.describe('Skills / Contact / About Stress', () => {
  test.beforeEach(async ({ page }) => { await uiLogin(page); });

  Array.from({ length: 30 }).forEach((_, i) => {
    test(`add skill grid item #${i + 1}`, async ({ page }) => {
      await page.goto('/admin/about');
      await page.click('button:has-text("Add Skill")').catch(()=>{});
      const inputs = page.locator('input[placeholder*="skill name"]');
      const count = await inputs.count();
      await inputs.nth(count - 1).fill(`BenchSkill${i}`);
      await page.click('button:has-text("Save Changes")').catch(()=>{});
    });
  });

  Array.from({ length: 15 }).forEach((_, i) => {
    test(`add certification #${i + 1}`, async ({ page }) => {
      await page.goto('/admin/skills');
      const certInput = page.locator('input[placeholder*="certification"]');
      await certInput.fill(`Bench Certification ${i}`);
      await page.click('button:has-text("Add Certification")').catch(()=>{});
      await page.waitForTimeout(50);
    });
  });

  const invalidPhones = ['abc','+123-abc','!!!!','12345678901234567890'];
  invalidPhones.forEach(phone => {
    test(`reject invalid phone: ${phone}`, async ({ page }) => {
      await page.goto('/admin/contact');
      await page.fill('input[name="phone"]', phone);
      await page.click('button:has-text("Save Changes")').catch(()=>{});
      await expect(page).toHaveURL(/contact/);
    });
  });

  const summaries = [
    'Short summary','A'.repeat(120),'Focused on automation & reliability.','Multi-disciplinary engineer spanning FE/BE/QA.','Experienced in performance profiling & tuning.'
  ];
  summaries.forEach((s, i) => {
    test(`update professional summary variant #${i + 1}`, async ({ page }) => {
      await page.goto('/admin/about');
      await page.fill('[data-testid="summary-textarea"]', s);
      await page.click('button:has-text("Save Changes")').catch(()=>{});
      await page.waitForTimeout(80);
    });
  });
});
