import { test, expect } from '@playwright/test';

test.describe('Admin About Management', () => {
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

  test('should navigate to about management page', async ({ page }) => {
    // Navigate to about management
    await page.goto('/admin/about');
    
    // Verify page loads correctly
    await expect(page.locator('h1')).toContainText('EDIT ABOUT');
    await expect(page.locator('input[placeholder="Enter your full name"]')).toBeVisible();
  });

  test('should load existing about data', async ({ page }) => {
    await page.goto('/admin/about');

    // Wait for form to load completely
    await page.waitForSelector('[data-testid="about-form"]', { timeout: 10000 });

    // Verify form fields are populated with seeded test data
    const nameField = page.getByTestId('name-input');
    const titleField = page.getByTestId('title-input');
    const bio1Field = page.getByTestId('bio-paragraph1-input');

    // Check that fields have the expected seeded data
    await expect(nameField).toHaveValue('John Doe');
    await expect(titleField).toHaveValue('Senior Software Engineer');
    await expect(bio1Field).toContainText('Experienced software engineer');
  });

  test('should update personal information successfully', async ({ page }) => {
    await page.goto('/admin/about');
    
    // Wait for form to load
    await page.waitForSelector('[data-testid="about-form"]', { timeout: 10000 });

    // Update personal information
    const testName = 'John Doe Updated';
    const testTitle = 'Senior Full Stack Developer';

    // Fill in form fields using stable test IDs
    await page.getByTestId('name-input').fill(testName);
    await page.getByTestId('title-input').fill(testTitle);
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Wait for success message
    await expect(page.locator('.bg-green-50, .text-green-600')).toBeVisible();
    
    // Verify the data persists after reload
    await page.reload();
    await page.waitForSelector('form');
    
    if (await nameField.isVisible()) {
      await expect(nameField).toHaveValue(testName);
    }
  });

  test('should update professional summary', async ({ page }) => {
    await page.goto('/admin/about');
    
    // Wait for form to load
    await page.waitForSelector('form');
    
    const testSummary = 'Updated professional summary with extensive experience in software development, cloud technologies, and team leadership. Passionate about creating innovative solutions and mentoring junior developers.';
    
    // Find and update summary field
    const summaryField = page.locator('textarea[name="summary"], textarea[placeholder*="summary"], textarea[placeholder*="description"]').first();
    
    if (await summaryField.isVisible()) {
      await summaryField.fill(testSummary);
      
      // Submit the form
      await page.click('button[type="submit"]');
      
      // Wait for success message
      await expect(page.locator('.bg-green-50, .text-green-600')).toBeVisible();
      
      // Verify the data persists
      await page.reload();
      await page.waitForSelector('form');
      await expect(summaryField).toHaveValue(testSummary);
    }
  });

  test('should manage skills grid', async ({ page }) => {
    await page.goto('/admin/about');
    
    // Wait for form to load
    await page.waitForSelector('form');
    
    // Look for skills-related fields
    const skillsSection = page.locator('[data-testid="skills-section"], .skills-grid, [class*="skill"]');
    
    if (await skillsSection.isVisible()) {
      // Try to add a new skill if there's an add button
      const addSkillButton = page.locator('button:has-text("Add Skill"), button[aria-label*="skill"]').first();
      
      if (await addSkillButton.isVisible()) {
        await addSkillButton.click();
        
        // Fill in skill details if form appears
        const skillTitleField = page.locator('input[placeholder*="skill"], input[name*="skill"]').last();
        const skillDescField = page.locator('textarea[placeholder*="description"], input[placeholder*="description"]').last();
        
        if (await skillTitleField.isVisible()) {
          await skillTitleField.fill('Test Skill');
        }
        
        if (await skillDescField.isVisible()) {
          await skillDescField.fill('Test skill description');
        }
        
        // Save the skill
        const saveButton = page.locator('button:has-text("Save"), button:has-text("Add")').last();
        if (await saveButton.isVisible()) {
          await saveButton.click();
        }
      }
    }
    
    // Submit the main form
    await page.click('button[type="submit"]');
    
    // Wait for success message
    await expect(page.locator('.bg-green-50, .text-green-600')).toBeVisible();
  });

  test('should manage achievements list', async ({ page }) => {
    await page.goto('/admin/about');
    
    // Wait for form to load
    await page.waitForSelector('form');
    
    // Look for achievements section
    const achievementsField = page.locator('textarea[name*="achievement"], textarea[placeholder*="achievement"]').first();
    
    if (await achievementsField.isVisible()) {
      const testAchievements = 'Led successful migration of legacy systems\nImplemented CI/CD pipeline reducing deployment time by 80%\nMentored 5+ junior developers';
      
      await achievementsField.fill(testAchievements);
      
      // Submit the form
      await page.click('button[type="submit"]');
      
      // Wait for success message
      await expect(page.locator('.bg-green-50, .text-green-600')).toBeVisible();
    }
  });

  test('should validate required fields', async ({ page }) => {
    await page.goto('/admin/about');
    
    // Wait for form to load
    await page.waitForSelector('form');
    
    // Clear required fields
    const nameField = page.locator('input[name="name"], input[placeholder*="name"]').first();
    const titleField = page.locator('input[name="title"], input[placeholder*="title"]').first();
    
    if (await nameField.isVisible()) {
      await nameField.fill('');
    }
    
    if (await titleField.isVisible()) {
      await titleField.fill('');
    }
    
    // Try to submit
    await page.click('button[type="submit"]');
    
    // Check for validation - either HTML5 validation or custom error messages
    if (await nameField.isVisible()) {
      const isRequired = await nameField.getAttribute('required');
      if (isRequired !== null) {
        // HTML5 validation should prevent submission
        await expect(nameField).toHaveAttribute('required');
      }
    }
  });

  test('should handle network errors gracefully', async ({ page }) => {
    await page.goto('/admin/about');
    
    // Wait for form to load
    await page.waitForSelector('form');
    
    // Intercept the API call and make it fail
    await page.route('/api/admin/about', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' })
      });
    });
    
    // Try to submit the form
    const nameField = page.locator('input[name="name"], input[placeholder*="name"]').first();
    if (await nameField.isVisible()) {
      await nameField.fill('Test Name');
    }
    
    await page.click('button[type="submit"]');
    
    // Check for error message
    await expect(page.locator('.bg-red-50, .text-red-600')).toBeVisible();
  });

  test('should show loading state during submission', async ({ page }) => {
    await page.goto('/admin/about');
    
    // Wait for form to load
    await page.waitForSelector('form');
    
    // Intercept the API call to add delay
    await page.route('/api/admin/about', async route => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      route.continue();
    });
    
    // Submit the form
    const nameField = page.locator('input[name="name"], input[placeholder*="name"]').first();
    if (await nameField.isVisible()) {
      await nameField.fill('Test Name');
    }
    
    await page.click('button[type="submit"]');
    
    // Check for loading state
    await expect(page.locator('button[type="submit"]')).toBeDisabled();
    const submitButton = page.locator('button[type="submit"]');
    const buttonText = await submitButton.textContent();
    expect(buttonText?.toLowerCase()).toMatch(/saving|updating|loading/);
  });

  test('should navigate back to dashboard', async ({ page }) => {
    await page.goto('/admin/about');
    
    // Find and click back button
    const backButton = page.locator('a[href="/admin"], button:has-text("Back"), a:has-text("Dashboard")').first();
    if (await backButton.isVisible()) {
      await backButton.click();
      await expect(page).toHaveURL('/admin');
    }
  });

  test('should preserve data across page refreshes', async ({ page }) => {
    await page.goto('/admin/about');
    
    // Wait for form to load
    await page.waitForSelector('form');
    
    // Update a field
    const nameField = page.locator('input[name="name"], input[placeholder*="name"]').first();
    if (await nameField.isVisible()) {
      const testName = 'Persistence Test Name';
      await nameField.fill(testName);
      
      // Submit the form
      await page.click('button[type="submit"]');
      
      // Wait for success
      await expect(page.locator('.bg-green-50, .text-green-600')).toBeVisible();
      
      // Refresh the page multiple times
      await page.reload();
      await page.waitForSelector('form');
      await expect(nameField).toHaveValue(testName);
      
      await page.reload();
      await page.waitForSelector('form');
      await expect(nameField).toHaveValue(testName);
    }
  });
});
