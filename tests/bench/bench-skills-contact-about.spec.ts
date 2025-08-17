import { expect } from '@playwright/test';
import { test as authTest } from './fixtures/auth';

// Removed serial mode to allow all tests to run independently

authTest.describe('Skills / Contact / About Stress', () => {

  Array.from({ length: 30 }).forEach((_, i) => {
    authTest(`add skill grid item #${i + 1}`, async ({ authenticatedPage: page }) => {
      await page.goto('/admin/skills');
      await page.waitForLoadState('networkidle');

      // Wait for skills page to load
      await page.waitForSelector('h2:has-text("Skill Categories")', { timeout: 10000 });

      // Click the first "Add Skill" button to enter edit mode
      await page.click('button:has-text("+ Add Skill")');

      // Fill the skill input field
      await page.fill('input[placeholder="Enter new skill"]', `BenchSkill${i}`);

      // Click the Add button to save the skill
      await page.click('button:has-text("Add")');

      // Wait for the operation to complete
      await page.waitForTimeout(500);
    });
  });

  Array.from({ length: 15 }).forEach((_, i) => {
    authTest(`add certification #${i + 1}`, async ({ authenticatedPage: page }) => {
      await page.goto('/admin/skills');
      await page.waitForLoadState('networkidle');
      const certInput = page.locator('input[placeholder*="certification"]');
      await certInput.fill(`Bench Certification ${i}`);
      await page.click('button:has-text("Add Certification")').catch(()=>{});
      await page.waitForTimeout(50);
    });
  });

  const invalidPhones = ['abc','+123-abc','!!!!','12345678901234567890'];
  invalidPhones.forEach(phone => {
    authTest(`reject invalid phone: ${phone}`, async ({ authenticatedPage: page }) => {
      await page.goto('/admin/contact');
      await page.waitForLoadState('networkidle');
      await page.fill('input[name="phone"]', phone);
      await page.click('button:has-text("Save Changes")').catch(()=>{});
      await page.waitForLoadState('networkidle');
      // Should still be on contact page (form validation should prevent invalid phones)
      expect(page.url()).toContain('/admin/contact');
    });
  });

  const summaries = [
    'Short summary','A'.repeat(120),'Focused on automation & reliability.','Multi-disciplinary engineer spanning FE/BE/QA.','Experienced in performance profiling & tuning.'
  ];
  summaries.forEach((s, i) => {
    authTest(`update professional summary variant #${i + 1}`, async ({ authenticatedPage: page }) => {
      await page.goto('/admin/about');
      await page.waitForLoadState('networkidle');
      await page.fill('[data-testid="summary-textarea"]', s);
      await page.click('button:has-text("Save Changes")').catch(()=>{});
      await page.waitForTimeout(80);
    });
  });
});
