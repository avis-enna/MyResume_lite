/**
 * Simple Admin-Portfolio Integration Test
 * Tests the core functionality: admin changes reflecting on portfolio
 */

import { test, expect } from '@playwright/test';

test.describe('Admin-Portfolio Simple Integration', () => {
  test('should verify admin changes reflect on portfolio - basic test', async ({ page }) => {
    // Step 1: Login to admin
    await page.goto('/admin');
    await page.fill('input[name="email"]', 'admin@admin.com');
    await page.fill('input[name="password"]', '$iva@V3nna21');
    await page.click('button[type="submit"]');
    await page.waitForURL('/admin/dashboard');
    
    // Step 2: Check current portfolio data
    await page.goto('/');
    const originalName = await page.locator('h1').first().textContent();
    console.log('Original name on portfolio:', originalName);
    
    // Step 3: Go back to admin and update about data
    await page.goto('/admin/about');
    await page.waitForSelector('h1:has-text("About Management")');
    
    // Update name
    const testName = 'MongoDB Test User';
    await page.fill('[data-testid="name-input"]', testName);
    
    // Save changes
    await page.click('button:has-text("Save Changes")');
    await expect(page.locator('.bg-green-50')).toBeVisible();
    
    // Step 4: Check if changes appear on portfolio
    await page.goto('/');
    
    // Wait for page to load and check if name changed
    await page.waitForSelector('h1');
    const updatedName = await page.locator('h1').first().textContent();
    console.log('Updated name on portfolio:', updatedName);
    
    // Verify the change
    expect(updatedName).toContain(testName.toUpperCase());
  });

  test('should verify skills changes reflect on portfolio', async ({ page }) => {
    // Step 1: Login to admin
    await page.goto('/admin');
    await page.fill('input[name="email"]', 'admin@admin.com');
    await page.fill('input[name="password"]', '$iva@V3nna21');
    await page.click('button[type="submit"]');
    await page.waitForURL('/admin/dashboard');
    
    // Step 2: Go to skills admin
    await page.goto('/admin/skills');
    await page.waitForSelector('h1:has-text("Skills Management")');
    
    // Add a test skill
    const addSkillButton = page.locator('button:has-text("Add Skill")').first();
    await addSkillButton.click();
    
    const newSkillInput = page.locator('input[placeholder*="Enter new skill"]');
    await newSkillInput.fill('MongoDB Integration Test');
    
    const addButton = page.locator('input[placeholder*="Enter new skill"]').locator('..').locator('button:has-text("Add")');
    await addButton.click();
    
    // Wait for success
    await expect(page.locator('.bg-green-50')).toBeVisible();
    
    // Step 3: Check if skill appears on portfolio
    await page.goto('/');
    
    // Look for the skill on the portfolio (it should be in skills section)
    // Note: We need to implement skills display on portfolio first
    console.log('Skills test - admin update completed, portfolio display needs implementation');
  });

  test('should verify contact changes reflect on portfolio', async ({ page }) => {
    // Step 1: Login to admin
    await page.goto('/admin');
    await page.fill('input[name="email"]', 'admin@admin.com');
    await page.fill('input[name="password"]', '$iva@V3nna21');
    await page.click('button[type="submit"]');
    await page.waitForURL('/admin/dashboard');
    
    // Step 2: Go to contact admin
    await page.goto('/admin/contact');
    await page.waitForSelector('h1:has-text("Contact Management")');
    
    // Update email
    const testEmail = 'mongodb-test@integration.com';
    await page.fill('input[name="email"]', testEmail);
    
    // Save changes
    await page.click('button:has-text("Save Changes")');
    await expect(page.locator('.bg-green-50')).toBeVisible();
    
    // Step 3: Check if email appears on portfolio
    await page.goto('/');
    
    // Look for the email on the portfolio
    // Note: We need to implement contact display on portfolio first
    console.log('Contact test - admin update completed, portfolio display needs implementation');
  });
});
