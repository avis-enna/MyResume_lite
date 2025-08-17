/**
 * Admin-Portfolio Integration Tests
 * 
 * These tests verify that changes made in the admin panel
 * are properly reflected on the public portfolio site.
 */

import { test, expect } from '@playwright/test';

test.describe('Admin-Portfolio Integration', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to admin login
    await page.goto('/admin');
    
    // Login with admin credentials
    await page.fill('input[name="email"]', 'admin@admin.com');
    await page.fill('input[name="password"]', '$iva@V3nna21');
    await page.click('button[type="submit"]');
    
    // Wait for redirect to admin dashboard
    await page.waitForURL('/admin/dashboard');
    await expect(page.locator('h1')).toContainText('Admin Dashboard');
  });

  test('should reflect about page changes on portfolio', async ({ page }) => {
    // Navigate to admin about page
    await page.click('a[href="/admin/about"]');
    await page.waitForSelector('h1:has-text("EDIT ABOUT")');

    // Wait for form to load
    await page.waitForSelector('[data-testid="about-form"]');

    // Update personal information
    const testName = 'Integration Test User';
    const testTitle = 'Senior Integration Engineer';
    const testBio = 'This is a test bio for integration testing purposes.';

    await page.fill('[data-testid="name-input"]', testName);
    await page.fill('[data-testid="title-input"]', testTitle);
    await page.fill('[data-testid="bio-paragraph1-input"]', testBio);

    // Save changes
    await page.click('button:has-text("Save Changes")');
    await expect(page.locator('[data-testid="success-alert"]')).toBeVisible();

    // Navigate to public portfolio
    await page.goto('/');

    // Verify changes are reflected on portfolio
    await expect(page.locator('h1').first()).toContainText(testName.toUpperCase());

    // Check if title appears anywhere on the page (it might be in a different element)
    await expect(page.locator('body')).toContainText(testTitle);

    // Check if bio appears anywhere on the page
    await expect(page.locator('body')).toContainText(testBio);
  });

  test('should reflect contact information changes on portfolio', async ({ page }) => {
    // Navigate to admin contact page
    await page.click('a[href="/admin/contact"]');
    await page.waitForSelector('h1:has-text("Edit Contact Section")');
    
    // Update contact information
    const testEmail = 'integration@test.com';
    const testPhone = '+1-555-INTEGRATION';
    const testLocation = 'Integration City, IC';
    const testLinkedIn = 'https://linkedin.com/in/integration-test';
    const testGitHub = 'https://github.com/integration-test';
    
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="phone"]', testPhone);
    await page.fill('input[name="location"]', testLocation);
    await page.fill('input[name="linkedin"]', testLinkedIn);
    await page.fill('input[name="github"]', testGitHub);
    
    // Save changes
    await page.click('button:has-text("Save Changes")');
    await expect(page.locator('.bg-green-50')).toBeVisible();
    
    // Navigate to public portfolio
    await page.goto('/');
    
    // Verify contact information is reflected
    await expect(page.locator('text=' + testEmail)).toBeVisible();
    await expect(page.locator('text=' + testPhone)).toBeVisible();
    await expect(page.locator('text=' + testLocation)).toBeVisible();
    
    // Check social links
    await expect(page.locator(`a[href="${testLinkedIn}"]`)).toBeVisible();
    await expect(page.locator(`a[href="${testGitHub}"]`)).toBeVisible();
  });

  test('should reflect skills changes on portfolio', async ({ page }) => {
    // Navigate to admin skills page
    await page.click('a[href="/admin/skills"]');
    await page.waitForSelector('h1:has-text("Skills Management")');
    
    // Add a new skill to test integration
    const addSkillToggle = page.locator('button:has-text("+ Add Skill")').first();
    await addSkillToggle.click();

    const newSkillInput = page.locator('input[placeholder*="Enter new skill"]');
    await newSkillInput.fill('Integration Testing');

    const addSkillSubmitButton = page.locator('button:has-text("Add")').first();
    await addSkillSubmitButton.click();
    
    // Wait for success message
    await expect(page.locator('.bg-green-50')).toBeVisible();
    
    // Add a new certification
    const newCertInput = page.locator('input[placeholder*="Enter new certification"]');
    await newCertInput.fill('Certified Integration Specialist');

    const addCertButton = page.locator('button:has-text("Add Certification")');
    await addCertButton.click();
    
    // Wait for success message
    await expect(page.locator('.bg-green-50')).toBeVisible();
    
    // Update technical expertise
    const titleField = page.locator('input[data-testid="expertise-title-input"]');
    const descField = page.locator('textarea[data-testid="expertise-textarea"]');
    
    await titleField.fill('Integration Technical Expertise');
    await descField.fill('Comprehensive integration testing and automation expertise.');
    
    // Wait for auto-save
    await page.waitForTimeout(2000);
    
    // Navigate to public portfolio
    await page.goto('/');
    
    // Verify skills section reflects changes
    await expect(page.locator('text=Integration Testing')).toBeVisible();
    await expect(page.locator('text=Certified Integration Specialist')).toBeVisible();
    await expect(page.locator('text=Integration Technical Expertise')).toBeVisible();
    await expect(page.locator('text=Comprehensive integration testing and automation expertise')).toBeVisible();
  });

  test('should reflect experience changes on portfolio', async ({ page }) => {
    // Navigate to admin experience page
    await page.click('a[href="/admin/experience"]');
    await page.waitForSelector('h1:has-text("Experience Management")');
    
    // Navigate to add experience page
    await page.click('a[href="/admin/experience/new"]');
    await page.waitForSelector('h1:has-text("Add Experience")');
    
    // Fill out new experience
    const testTitle = 'Integration Test Engineer';
    const testCompany = 'Integration Corp';
    const testDescription = 'Leading integration testing initiatives and automation frameworks.';
    const testLocation = 'Remote, Worldwide';
    
    await page.fill('input[name="title"]', testTitle);
    await page.fill('input[name="company"]', testCompany);
    await page.fill('textarea[name="description"]', testDescription);
    await page.fill('input[name="location"]', testLocation);
    await page.fill('input[name="startDate"]', '2024-01');
    
    // Mark as current position
    await page.check('input[name="current"]');
    
    // Add responsibilities
    const addRespButton = page.locator('button:has-text("Add Responsibility")');
    await addRespButton.click();
    
    const respInput = page.locator('input[placeholder*="responsibility"]').last();
    await respInput.fill('Develop comprehensive integration test suites');
    
    // Add achievements
    const addAchievementButton = page.locator('button:has-text("Add Achievement")');
    await addAchievementButton.click();
    
    const achievementInput = page.locator('input[placeholder*="achievement"]').last();
    await achievementInput.fill('Improved test coverage by 95%');
    
    // Add technologies
    const addTechButton = page.locator('button:has-text("Add Technology")');
    await addTechButton.click();
    
    const techInput = page.locator('input[placeholder*="technology"]').last();
    await techInput.fill('Playwright');
    
    // Save experience
    await page.click('button:has-text("Save Experience")');
    await expect(page.locator('.bg-green-50')).toBeVisible();
    
    // Navigate to public portfolio
    await page.goto('/');
    
    // Verify experience is reflected on portfolio
    await expect(page.locator('text=' + testTitle)).toBeVisible();
    await expect(page.locator('text=' + testCompany)).toBeVisible();
    await expect(page.locator('text=' + testDescription)).toBeVisible();
    await expect(page.locator('text=' + testLocation)).toBeVisible();
    await expect(page.locator('text=Develop comprehensive integration test suites')).toBeVisible();
    await expect(page.locator('text=Improved test coverage by 95%')).toBeVisible();
    await expect(page.locator('text=Playwright')).toBeVisible();
    await expect(page.locator('text=Current')).toBeVisible();
  });

  test('should reflect professional summary changes on portfolio', async ({ page }) => {
    // Navigate to admin about page
    await page.click('a[href="/admin/about"]');
    await page.waitForSelector('h1:has-text("About Management")');
    
    // Update professional summary
    const testSummary = 'Experienced integration specialist with expertise in automated testing, continuous integration, and quality assurance processes.';
    
    await page.fill('[data-testid="summary-textarea"]', testSummary);
    
    // Save changes
    await page.click('button:has-text("Save Changes")');
    await expect(page.locator('.bg-green-50')).toBeVisible();
    
    // Navigate to public portfolio
    await page.goto('/');
    
    // Verify professional summary is reflected
    await expect(page.locator('text=' + testSummary)).toBeVisible();
  });

  test('should reflect skills grid changes on portfolio', async ({ page }) => {
    // Navigate to admin about page
    await page.click('a[href="/admin/about"]');
    await page.waitForSelector('h1:has-text("About Management")');
    
    // Add a new skill to the skills grid
    const addSkillButton = page.locator('button:has-text("Add Skill")').first();
    await addSkillButton.click();
    
    const skillInput = page.locator('input[placeholder*="skill name"]').last();
    await skillInput.fill('Integration Automation');
    
    // Save changes
    await page.click('button:has-text("Save Changes")');
    await expect(page.locator('.bg-green-50')).toBeVisible();
    
    // Navigate to public portfolio
    await page.goto('/');
    
    // Verify skill is reflected in the skills grid
    await expect(page.locator('text=Integration Automation')).toBeVisible();
  });

  test('should reflect achievements changes on portfolio', async ({ page }) => {
    // Navigate to admin about page
    await page.click('a[href="/admin/about"]');
    await page.waitForSelector('h1:has-text("About Management")');
    
    // Add a new achievement
    const addAchievementButton = page.locator('button:has-text("Add Achievement")').first();
    await addAchievementButton.click();
    
    const achievementInput = page.locator('input[placeholder*="achievement"]').last();
    await achievementInput.fill('Implemented comprehensive integration testing framework');
    
    // Save changes
    await page.click('button:has-text("Save Changes")');
    await expect(page.locator('.bg-green-50')).toBeVisible();
    
    // Navigate to public portfolio
    await page.goto('/');
    
    // Verify achievement is reflected
    await expect(page.locator('text=Implemented comprehensive integration testing framework')).toBeVisible();
  });

  test('should maintain data consistency across multiple admin-portfolio cycles', async ({ page }) => {
    // Test multiple round trips between admin and portfolio
    const testData = {
      name: 'Consistency Test User',
      title: 'Data Consistency Engineer',
      email: 'consistency@test.com',
      skill: 'Data Consistency Testing'
    };
    
    // Update about information
    await page.click('a[href="/admin/about"]');
    await page.waitForSelector('h1:has-text("About Management")');
    
    await page.fill('[data-testid="name-input"]', testData.name);
    await page.fill('[data-testid="title-input"]', testData.title);
    await page.click('button:has-text("Save Changes")');
    await expect(page.locator('.bg-green-50')).toBeVisible();
    
    // Update contact information
    await page.click('a[href="/admin/contact"]');
    await page.waitForSelector('h1:has-text("Contact Management")');
    
    await page.fill('input[name="email"]', testData.email);
    await page.click('button:has-text("Save Changes")');
    await expect(page.locator('.bg-green-50')).toBeVisible();
    
    // Add skill
    await page.click('a[href="/admin/skills"]');
    await page.waitForSelector('h1:has-text("Skills Management")');
    
    const addSkillButton = page.locator('button:has-text("Add Skill")').first();
    await addSkillButton.click();
    
    const newSkillInput = page.locator('input[placeholder*="Enter new skill"]');
    await newSkillInput.fill(testData.skill);
    
    const addButton = page.locator('input[placeholder*="Enter new skill"]').locator('..').locator('button:has-text("Add")');
    await addButton.click();
    await expect(page.locator('.bg-green-50')).toBeVisible();
    
    // Verify all changes on portfolio
    await page.goto('/');
    
    await expect(page.locator('text=' + testData.name)).toBeVisible();
    await expect(page.locator('text=' + testData.title)).toBeVisible();
    await expect(page.locator('text=' + testData.email)).toBeVisible();
    await expect(page.locator('text=' + testData.skill)).toBeVisible();
    
    // Go back to admin and verify data persistence
    await page.goto('/admin/about');
    await expect(page.locator('[data-testid="name-input"]')).toHaveValue(testData.name);
    await expect(page.locator('[data-testid="title-input"]')).toHaveValue(testData.title);
    
    await page.goto('/admin/contact');
    await expect(page.locator('input[name="email"]')).toHaveValue(testData.email);
    
    await page.goto('/admin/skills');
    await expect(page.locator('text=' + testData.skill)).toBeVisible();
  });
});
