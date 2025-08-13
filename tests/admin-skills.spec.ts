import { test, expect } from '@playwright/test';

test.describe('Admin Skills Management', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to admin login
    await page.goto('/admin');

    // Verify we're on the login page
    await expect(page.locator('h1')).toContainText('Portfolio Admin');

    // Login with admin credentials
    await page.fill('input[name="email"]', 'admin@admin.com');
    await page.fill('input[name="password"]', 'admin@admin.com');
    await page.click('button[type="submit"]');

    // Wait for redirect to admin dashboard
    await page.waitForURL('/admin/dashboard');
    await expect(page.locator('h1')).toContainText('Admin Dashboard');
  });

  test('should navigate to skills management page', async ({ page }) => {
    // Navigate to skills management
    await page.goto('/admin/skills');
    
    // Verify page loads correctly
    await expect(page.locator('h1')).toContainText('Skills Management');
    await expect(page.locator('.bg-white')).toBeVisible();
  });

  test('should load existing skills data', async ({ page }) => {
    await page.goto('/admin/skills');
    
    // Wait for data to load
    await page.waitForSelector('.bg-white');
    
    // Verify skill categories are displayed
    await expect(page.locator('h2:has-text("Skill Categories")')).toBeVisible();
    await expect(page.locator('h2:has-text("Certifications")')).toBeVisible();
    await expect(page.locator('h2:has-text("Technical Expertise")')).toBeVisible();
    
    // Check that skill categories contain data
    const skillCategories = page.locator('[class*="grid"] > div');
    await expect(skillCategories.first()).toBeVisible();
  });

  test('should update technical expertise', async ({ page }) => {
    await page.goto('/admin/skills');
    
    // Wait for form to load
    await page.waitForSelector('input[value*="Technical Expertise"], input[placeholder*="title"]');
    
    // Update technical expertise
    const testTitle = 'Advanced Technical Expertise';
    const testDescription = 'Updated description showcasing comprehensive technical skills and experience in modern software development practices.';
    
    const titleField = page.locator('input[value*="Technical"], input[placeholder*="title"]').first();
    const descriptionField = page.locator('textarea').first();
    
    await titleField.fill(testTitle);
    await descriptionField.fill(testDescription);
    
    // The form auto-saves, so wait for success message
    await expect(page.locator('.bg-green-50')).toBeVisible();
    await expect(page.locator('.bg-green-50')).toContainText('Skills updated successfully');
    
    // Verify data persists after reload
    await page.reload();
    await page.waitForSelector('input[value*="Advanced"], input[placeholder*="title"]');
    await expect(titleField).toHaveValue(testTitle);
    await expect(descriptionField).toHaveValue(testDescription);
  });

  test('should add new skill to category', async ({ page }) => {
    await page.goto('/admin/skills');
    
    // Wait for skills to load
    await page.waitForSelector('h2:has-text("Skill Categories")');
    
    // Find the first skill category and add a skill
    const addSkillButton = page.locator('button:has-text("Add Skill")').first();
    await addSkillButton.click();
    
    // Enter new skill
    const newSkillInput = page.locator('input[placeholder*="Enter new skill"]');
    await expect(newSkillInput).toBeVisible();
    await newSkillInput.fill('Test Skill Technology');
    
    // Click add button
    const addButton = page.locator('button:has-text("Add")');
    await addButton.click();
    
    // Wait for success message
    await expect(page.locator('.bg-green-50')).toBeVisible();
    
    // Verify the skill was added
    await expect(page.locator('text=Test Skill Technology')).toBeVisible();
  });

  test('should remove skill from category', async ({ page }) => {
    await page.goto('/admin/skills');
    
    // Wait for skills to load
    await page.waitForSelector('h2:has-text("Skill Categories")');
    
    // First add a skill to remove
    const addSkillButton = page.locator('button:has-text("Add Skill")').first();
    await addSkillButton.click();
    
    const newSkillInput = page.locator('input[placeholder*="Enter new skill"]');
    await newSkillInput.fill('Temporary Skill');
    
    const addButton = page.locator('button:has-text("Add")');
    await addButton.click();
    
    // Wait for success message
    await expect(page.locator('.bg-green-50')).toBeVisible();
    
    // Now remove the skill
    const removeButton = page.locator('button:has-text("Remove")').last();
    await removeButton.click();
    
    // Wait for success message
    await expect(page.locator('.bg-green-50')).toBeVisible();
    
    // Verify the skill was removed
    await expect(page.locator('text=Temporary Skill')).not.toBeVisible();
  });

  test('should add new certification', async ({ page }) => {
    await page.goto('/admin/skills');
    
    // Wait for certifications section to load
    await page.waitForSelector('h2:has-text("Certifications")');
    
    // Add new certification
    const certificationInput = page.locator('input[placeholder*="Enter new certification"]');
    await certificationInput.fill('Test Certification Authority (TCA)');
    
    const addCertButton = page.locator('button:has-text("Add Certification")');
    await addCertButton.click();
    
    // Wait for success message
    await expect(page.locator('.bg-green-50')).toBeVisible();
    
    // Verify the certification was added
    await expect(page.locator('text=Test Certification Authority (TCA)')).toBeVisible();
  });

  test('should remove certification', async ({ page }) => {
    await page.goto('/admin/skills');
    
    // Wait for certifications section to load
    await page.waitForSelector('h2:has-text("Certifications")');
    
    // First add a certification to remove
    const certificationInput = page.locator('input[placeholder*="Enter new certification"]');
    await certificationInput.fill('Temporary Certification');
    
    const addCertButton = page.locator('button:has-text("Add Certification")');
    await addCertButton.click();
    
    // Wait for success message
    await expect(page.locator('.bg-green-50')).toBeVisible();
    
    // Now remove the certification
    const removeButton = page.locator('button:has-text("Remove")').last();
    await removeButton.click();
    
    // Wait for success message
    await expect(page.locator('.bg-green-50')).toBeVisible();
    
    // Verify the certification was removed
    await expect(page.locator('text=Temporary Certification')).not.toBeVisible();
  });

  test('should handle empty skill input validation', async ({ page }) => {
    await page.goto('/admin/skills');
    
    // Wait for skills to load
    await page.waitForSelector('h2:has-text("Skill Categories")');
    
    // Try to add empty skill
    const addSkillButton = page.locator('button:has-text("Add Skill")').first();
    await addSkillButton.click();
    
    // Don't enter anything, just click add
    const addButton = page.locator('button:has-text("Add")');
    await expect(addButton).toBeDisabled();
    
    // Enter whitespace only
    const newSkillInput = page.locator('input[placeholder*="Enter new skill"]');
    await newSkillInput.fill('   ');
    await expect(addButton).toBeDisabled();
  });

  test('should handle empty certification input validation', async ({ page }) => {
    await page.goto('/admin/skills');
    
    // Wait for certifications section to load
    await page.waitForSelector('h2:has-text("Certifications")');
    
    // Try to add empty certification
    const addCertButton = page.locator('button:has-text("Add Certification")');
    await expect(addCertButton).toBeDisabled();
    
    // Enter whitespace only
    const certificationInput = page.locator('input[placeholder*="Enter new certification"]');
    await certificationInput.fill('   ');
    await expect(addCertButton).toBeDisabled();
  });

  test('should cancel skill addition', async ({ page }) => {
    await page.goto('/admin/skills');
    
    // Wait for skills to load
    await page.waitForSelector('h2:has-text("Skill Categories")');
    
    // Start adding a skill
    const addSkillButton = page.locator('button:has-text("Add Skill")').first();
    await addSkillButton.click();
    
    // Enter some text
    const newSkillInput = page.locator('input[placeholder*="Enter new skill"]');
    await newSkillInput.fill('Cancelled Skill');
    
    // Click cancel
    const cancelButton = page.locator('button:has-text("Cancel")');
    await cancelButton.click();
    
    // Verify input is hidden and skill wasn't added
    await expect(newSkillInput).not.toBeVisible();
    await expect(page.locator('text=Cancelled Skill')).not.toBeVisible();
  });

  test('should handle network errors gracefully', async ({ page }) => {
    await page.goto('/admin/skills');
    
    // Wait for skills to load
    await page.waitForSelector('h2:has-text("Skill Categories")');
    
    // Intercept the API call and make it fail
    await page.route('/api/admin/skills', route => {
      if (route.request().method() === 'PUT') {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Internal server error' })
        });
      } else {
        route.continue();
      }
    });
    
    // Try to add a skill
    const addSkillButton = page.locator('button:has-text("Add Skill")').first();
    await addSkillButton.click();
    
    const newSkillInput = page.locator('input[placeholder*="Enter new skill"]');
    await newSkillInput.fill('Error Test Skill');
    
    const addButton = page.locator('button:has-text("Add")');
    await addButton.click();
    
    // Check for error message
    await expect(page.locator('.bg-red-50')).toBeVisible();
    await expect(page.locator('.bg-red-50')).toContainText('Failed to update skills');
  });

  test('should show loading state during operations', async ({ page }) => {
    await page.goto('/admin/skills');
    
    // Wait for skills to load
    await page.waitForSelector('h2:has-text("Skill Categories")');
    
    // Intercept the API call to add delay
    await page.route('/api/admin/skills', async route => {
      if (route.request().method() === 'PUT') {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      route.continue();
    });
    
    // Try to add a skill
    const addSkillButton = page.locator('button:has-text("Add Skill")').first();
    await addSkillButton.click();
    
    const newSkillInput = page.locator('input[placeholder*="Enter new skill"]');
    await newSkillInput.fill('Loading Test Skill');
    
    const addButton = page.locator('button:has-text("Add")');
    await addButton.click();
    
    // Check for disabled state during loading
    await expect(addButton).toBeDisabled();
  });

  test('should navigate back to dashboard', async ({ page }) => {
    await page.goto('/admin/skills');
    
    // Find and click back button
    const backButton = page.locator('a[href="/admin"], button:has-text("Back")').first();
    if (await backButton.isVisible()) {
      await backButton.click();
      await expect(page).toHaveURL('/admin');
    }
  });

  test('should persist all changes across page reloads', async ({ page }) => {
    await page.goto('/admin/skills');
    
    // Wait for skills to load
    await page.waitForSelector('h2:has-text("Skill Categories")');
    
    // Add a skill
    const addSkillButton = page.locator('button:has-text("Add Skill")').first();
    await addSkillButton.click();
    
    const newSkillInput = page.locator('input[placeholder*="Enter new skill"]');
    await newSkillInput.fill('Persistent Test Skill');
    
    const addButton = page.locator('button:has-text("Add")');
    await addButton.click();
    
    // Wait for success
    await expect(page.locator('.bg-green-50')).toBeVisible();
    
    // Add a certification
    const certificationInput = page.locator('input[placeholder*="Enter new certification"]');
    await certificationInput.fill('Persistent Test Certification');
    
    const addCertButton = page.locator('button:has-text("Add Certification")');
    await addCertButton.click();
    
    // Wait for success
    await expect(page.locator('.bg-green-50')).toBeVisible();
    
    // Reload page and verify persistence
    await page.reload();
    await page.waitForSelector('h2:has-text("Skill Categories")');
    
    await expect(page.locator('text=Persistent Test Skill')).toBeVisible();
    await expect(page.locator('text=Persistent Test Certification')).toBeVisible();
  });
});
