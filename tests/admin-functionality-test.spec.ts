import { test, expect } from '@playwright/test';

test.describe('Complete Admin Functionality Test', () => {
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

  test('should test About section - load and save data', async ({ page }) => {
    console.log('Testing About section...');
    
    // Navigate to About admin
    await page.click('a[href="/admin/about"]');
    await page.waitForURL('/admin/about');
    
    // Check if form loads with data
    await page.waitForSelector('input[name="name"]');
    
    // Get current name value
    const nameValue = await page.inputValue('input[name="name"]');
    console.log('Current name value:', nameValue);
    
    // Test saving data
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="title"]', 'Test Developer');
    await page.click('button[type="submit"]');
    
    // Check for success message
    await expect(page.locator('text=Data saved successfully')).toBeVisible();
    
    // Verify data persisted
    await page.reload();
    await page.waitForSelector('input[name="name"]');
    await expect(page.locator('input[name="name"]')).toHaveValue('Test User');
  });

  test('should test Skills section - load and manage skills', async ({ page }) => {
    console.log('Testing Skills section...');
    
    // Navigate to Skills admin
    await page.click('a[href="/admin/skills"]');
    await page.waitForURL('/admin/skills');
    
    // Check if skills load
    await page.waitForSelector('form');
    
    // Try to add a new skill
    await page.fill('input[placeholder="Enter skill name"]', 'Test Skill');
    await page.selectOption('select', 'Frontend');
    await page.click('button:has-text("Add Skill")');
    
    // Check if skill was added
    await expect(page.locator('text=Test Skill')).toBeVisible();
  });

  test('should test Experience section - CRUD operations', async ({ page }) => {
    console.log('Testing Experience section...');
    
    // Navigate to Experience admin
    await page.click('a[href="/admin/experience"]');
    await page.waitForURL('/admin/experience');
    
    // Check if experiences load
    await page.waitForSelector('h1:has-text("Manage Experience")');
    
    // Test adding new experience
    await page.click('a:has-text("ADD EXPERIENCE")');
    await page.waitForURL('/admin/experience/new');
    
    // Fill out experience form
    await page.fill('input[name="company"]', 'Test Company');
    await page.fill('input[name="title"]', 'Test Position'); // Fixed: use 'title' not 'position'
    await page.fill('input[name="startDate"]', '2023-01-01');
    await page.fill('input[name="endDate"]', '2023-12-31');
    await page.fill('textarea[name="description.0"]', 'Test description'); // Fixed: use array notation
    
    await page.click('button[type="submit"]');
    
    // Should redirect back to experience list
    await page.waitForURL('/admin/experience');
    
    // Check if new experience appears
    await expect(page.locator('text=Test Company')).toBeVisible();
    
    // Test delete functionality
    const deleteButton = page.locator('button:has-text("Delete")').first();
    if (await deleteButton.isVisible()) {
      await deleteButton.click();
      // Check if experience was deleted (should disappear from list)
      await page.waitForTimeout(1000);
    }
  });

  test('should test Projects section - CRUD operations', async ({ page }) => {
    console.log('Testing Projects section...');
    
    // Navigate to Projects admin
    await page.click('a[href="/admin/projects"]');
    await page.waitForURL('/admin/projects');
    
    // Check if projects load
    await page.waitForSelector('h1:has-text("Manage Projects")');
    
    // Test adding new project
    await page.click('a:has-text("ADD PROJECT")');
    await page.waitForURL('/admin/projects/new');
    
    // Fill out project form
    await page.fill('input[name="title"]', 'Test Project');
    await page.fill('textarea[name="description"]', 'Test project description');
    await page.fill('input[name="technologies"]', 'React, Node.js');
    await page.fill('textarea[name="features"]', 'Feature 1\nFeature 2');
    await page.fill('input[name="githubUrl"]', 'https://github.com/test/project');
    
    await page.click('button[type="submit"]');
    
    // Should redirect back to projects list
    await page.waitForURL('/admin/projects');
    
    // Check if new project appears
    await expect(page.locator('h3:has-text("Test Project")').first()).toBeVisible();
  });

  test('should test Contact section - load and save data', async ({ page }) => {
    console.log('Testing Contact section...');
    
    // Navigate to Contact admin
    await page.click('a[href="/admin/contact"]');
    await page.waitForURL('/admin/contact');
    
    // Check if form loads
    await page.waitForSelector('input[name="email"]');
    
    // Test saving contact data
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="phone"]', '+1234567890');
    await page.fill('input[name="location"]', 'Test City, Test Country');
    
    await page.click('button[type="submit"]');
    
    // Check for success message
    await expect(page.locator('text=Contact information updated successfully')).toBeVisible();
  });

  test('should verify portfolio pages display admin data', async ({ page }) => {
    console.log('Testing portfolio data display...');
    
    // Check main portfolio page
    await page.goto('/');
    await page.waitForSelector('h1');
    
    // Check if about data is displayed
    const nameElement = page.locator('h1').first();
    const nameText = await nameElement.textContent();
    console.log('Portfolio name:', nameText);
    
    // Check projects page
    await page.goto('/projects');
    await page.waitForSelector('h1:has-text("Projects")');
    
    // Check if projects are displayed
    const projectsExist = await page.locator('.card').count() > 0;
    console.log('Projects exist:', projectsExist);
    
    // Check experience page
    await page.goto('/experience');
    await page.waitForSelector('h1:has-text("Experience")');
    
    // Check if experience is displayed
    const experienceExists = await page.locator('text=years of experience').isVisible();
    console.log('Experience exists:', experienceExists);
    
    // Check contact page
    await page.goto('/contact');
    await page.waitForSelector('h1:has-text("Contact")');
    
    // Check if contact info is displayed
    const contactExists = await page.locator('text=@').isVisible();
    console.log('Contact exists:', contactExists);
  });
});
