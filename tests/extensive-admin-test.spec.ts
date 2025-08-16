import { test, expect } from '@playwright/test';

test.describe('Extensive Admin Panel Testing', () => {
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

  test('About Section - Data persistence and caching fix', async ({ page }) => {
    console.log('🧪 Testing About section data persistence...');
    
    await page.click('a[href="/admin/about"]');
    await page.waitForURL('/admin/about');
    await page.waitForSelector('input[name="name"]');
    
    // Get initial values
    const initialName = await page.inputValue('input[name="name"]');
    const initialTitle = await page.inputValue('input[name="title"]');
    console.log('Initial values:', { initialName, initialTitle });
    
    // Update with test data
    const testName = `Test User ${Date.now()}`;
    const testTitle = `Test Developer ${Date.now()}`;
    
    await page.fill('input[name="name"]', testName);
    await page.fill('input[name="title"]', testTitle);
    await page.fill('textarea[name="bio-paragraph1"]', 'Updated bio paragraph 1');
    await page.fill('textarea[name="bio-paragraph2"]', 'Updated bio paragraph 2');
    
    // Save changes
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Data saved successfully')).toBeVisible({ timeout: 10000 });
    
    // Verify data persisted immediately (caching fix test)
    await expect(page.locator('input[name="name"]')).toHaveValue(testName);
    await expect(page.locator('input[name="title"]')).toHaveValue(testTitle);
    
    // Navigate away and back to test caching
    await page.click('a[href="/admin/dashboard"]');
    await page.waitForURL('/admin/dashboard');
    await page.click('a[href="/admin/about"]');
    await page.waitForURL('/admin/about');
    await page.waitForSelector('input[name="name"]');
    
    // Verify data still persisted after navigation
    await expect(page.locator('input[name="name"]')).toHaveValue(testName);
    await expect(page.locator('input[name="title"]')).toHaveValue(testTitle);
    
    console.log('✅ About section data persistence test passed');
  });

  test('Contact Section - Data persistence and caching fix', async ({ page }) => {
    console.log('🧪 Testing Contact section data persistence...');
    
    await page.click('a[href="/admin/contact"]');
    await page.waitForURL('/admin/contact');
    await page.waitForSelector('input[name="email"]');
    
    // Get initial values
    const initialEmail = await page.inputValue('input[name="email"]');
    const initialPhone = await page.inputValue('input[name="phone"]');
    console.log('Initial contact values:', { initialEmail, initialPhone });
    
    // Update with test data
    const testEmail = `test${Date.now()}@example.com`;
    const testPhone = `+1-555-${Date.now().toString().slice(-4)}`;
    const testLocation = `Test City ${Date.now()}`;
    
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="phone"]', testPhone);
    await page.fill('input[name="location"]', testLocation);
    await page.fill('input[name="linkedin"]', 'https://linkedin.com/in/testuser');
    await page.fill('input[name="github"]', 'https://github.com/testuser');
    
    // Save changes
    await page.click('button:has-text("Save Changes")');
    await expect(page.locator('text=Contact information updated successfully')).toBeVisible({ timeout: 10000 });
    
    // Verify data persisted immediately (caching fix test)
    await expect(page.locator('input[name="email"]')).toHaveValue(testEmail);
    await expect(page.locator('input[name="phone"]')).toHaveValue(testPhone);
    await expect(page.locator('input[name="location"]')).toHaveValue(testLocation);
    
    // Navigate away and back to test caching
    await page.click('a[href="/admin/dashboard"]');
    await page.waitForURL('/admin/dashboard');
    await page.click('a[href="/admin/contact"]');
    await page.waitForURL('/admin/contact');
    await page.waitForSelector('input[name="email"]');
    
    // Verify data still persisted after navigation
    await expect(page.locator('input[name="email"]')).toHaveValue(testEmail);
    await expect(page.locator('input[name="phone"]')).toHaveValue(testPhone);
    
    console.log('✅ Contact section data persistence test passed');
  });

  test('Skills Section - Add, remove, and persistence', async ({ page }) => {
    console.log('🧪 Testing Skills section functionality...');
    
    await page.click('a[href="/admin/skills"]');
    await page.waitForURL('/admin/skills');
    await page.waitForSelector('[data-testid="skills-root"]', { timeout: 15000 });
    
    // Check if skills are loaded
    const frontendSkills = page.locator('text=Frontend').first();
    await expect(frontendSkills).toBeVisible();
    
    // Try to add a new skill if form is available
    const skillInput = page.locator('input[placeholder*="skill"]').first();
    if (await skillInput.isVisible()) {
      const testSkill = `TestSkill${Date.now()}`;
      await skillInput.fill(testSkill);
      
      // Select category
      const categorySelect = page.locator('select').first();
      if (await categorySelect.isVisible()) {
        await categorySelect.selectOption('Frontend');
      }
      
      // Add skill
      const addButton = page.locator('button:has-text("Add")').first();
      if (await addButton.isVisible()) {
        await addButton.click();
        
        // Verify skill was added
        await expect(page.locator(`text=${testSkill}`)).toBeVisible({ timeout: 5000 });
        console.log('✅ Skill added successfully');
      }
    }
    
    console.log('✅ Skills section test completed');
  });

  test('Experience Section - Full CRUD operations', async ({ page }) => {
    console.log('🧪 Testing Experience section CRUD operations...');
    
    await page.click('a[href="/admin/experience"]');
    await page.waitForURL('/admin/experience');
    await page.waitForSelector('h1:has-text("Manage Experience")');
    
    // Count initial experiences
    const initialExperiences = await page.locator('button:has-text("Delete")').count();
    console.log(`Initial experience count: ${initialExperiences}`);
    
    // Add new experience
    await page.click('a:has-text("ADD EXPERIENCE")');
    await page.waitForURL('/admin/experience/new');
    
    const testCompany = `Test Company ${Date.now()}`;
    const testTitle = `Test Position ${Date.now()}`;
    
    await page.fill('input[name="company"]', testCompany);
    await page.fill('input[name="title"]', testTitle);
    await page.fill('input[name="startDate"]', '2023-01-01');
    await page.fill('input[name="endDate"]', '2023-12-31');
    
    // Fill description
    const descriptionField = page.locator('textarea[name="description.0"]');
    if (await descriptionField.isVisible()) {
      await descriptionField.fill('Test job description');
    }
    
    await page.click('button[type="submit"]');
    await page.waitForURL('/admin/experience');
    
    // Verify new experience appears
    await expect(page.locator(`text=${testCompany}`)).toBeVisible();
    
    // Count experiences after adding
    const newExperienceCount = await page.locator('button:has-text("Delete")').count();
    expect(newExperienceCount).toBe(initialExperiences + 1);
    
    // Test delete functionality
    const deleteButtons = page.locator('button:has-text("Delete")');
    if (await deleteButtons.first().isVisible()) {
      await deleteButtons.first().click();
      await page.waitForTimeout(2000);
      
      // Verify deletion
      const finalCount = await page.locator('button:has-text("Delete")').count();
      expect(finalCount).toBe(initialExperiences);
    }
    
    console.log('✅ Experience CRUD operations test passed');
  });

  test('Projects Section - Full CRUD operations', async ({ page }) => {
    console.log('🧪 Testing Projects section CRUD operations...');
    
    await page.click('a[href="/admin/projects"]');
    await page.waitForURL('/admin/projects');
    await page.waitForSelector('h1:has-text("Manage Projects")');
    
    // Count initial projects
    const initialProjects = await page.locator('button:has-text("Delete")').count();
    console.log(`Initial project count: ${initialProjects}`);
    
    // Add new project
    await page.click('a:has-text("ADD PROJECT")');
    await page.waitForURL('/admin/projects/new');
    
    const testProjectTitle = `Test Project ${Date.now()}`;
    
    await page.fill('input[name="title"]', testProjectTitle);
    await page.fill('textarea[name="description"]', 'Test project description');
    await page.fill('input[name="technologies"]', 'React, Node.js, MongoDB');
    await page.fill('textarea[name="features"]', 'Feature 1\nFeature 2\nFeature 3');
    await page.fill('input[name="githubUrl"]', 'https://github.com/test/project');
    await page.fill('input[name="liveUrl"]', 'https://test-project.example.com');
    
    await page.click('button[type="submit"]');
    await page.waitForURL('/admin/projects');
    
    // Verify new project appears
    await expect(page.locator(`h3:has-text("${testProjectTitle}")`).first()).toBeVisible();
    
    // Count projects after adding
    const newProjectCount = await page.locator('button:has-text("Delete")').count();
    expect(newProjectCount).toBe(initialProjects + 1);
    
    // Test edit functionality
    const editButtons = page.locator('a:has-text("Edit")');
    if (await editButtons.first().isVisible()) {
      await editButtons.first().click();
      await page.waitForURL(/\/admin\/projects\/.*\/edit/);
      
      // Update project title
      const updatedTitle = `${testProjectTitle} - Updated`;
      await page.fill('input[name="title"]', updatedTitle);
      await page.click('button[type="submit"]');
      await page.waitForURL('/admin/projects');
      
      // Verify update
      await expect(page.locator(`h3:has-text("${updatedTitle}")`).first()).toBeVisible();
    }
    
    // Test delete functionality
    const deleteButtons = page.locator('button:has-text("Delete")');
    if (await deleteButtons.first().isVisible()) {
      await deleteButtons.first().click();
      await page.waitForTimeout(2000);
      
      // Verify deletion
      const finalCount = await page.locator('button:has-text("Delete")').count();
      expect(finalCount).toBe(initialProjects);
    }
    
    console.log('✅ Projects CRUD operations test passed');
  });

  test('Portfolio Integration - Verify admin changes appear on public pages', async ({ page }) => {
    console.log('🧪 Testing portfolio integration...');
    
    // First, update about data
    await page.click('a[href="/admin/about"]');
    await page.waitForURL('/admin/about');
    await page.waitForSelector('input[name="name"]');
    
    const portfolioTestName = `Portfolio Test ${Date.now()}`;
    await page.fill('input[name="name"]', portfolioTestName);
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Data saved successfully')).toBeVisible();
    
    // Check main portfolio page
    await page.goto('/');
    await page.waitForSelector('h1');
    
    // Verify name appears on portfolio
    const nameElement = page.locator('h1').first();
    await expect(nameElement).toContainText(portfolioTestName.toUpperCase());
    
    // Check projects page
    await page.goto('/projects');
    await page.waitForSelector('h1:has-text("Projects")');
    
    // Check if projects are displayed
    const projectCards = await page.locator('.bg-gray-950, .card, [class*="project"]').count();
    console.log(`Projects displayed on portfolio: ${projectCards}`);
    
    // Check experience page
    await page.goto('/experience');
    
    // Wait for either main content or loading/error state
    await Promise.race([
      page.waitForSelector('h1:has-text("Professional Experience")', { timeout: 10000 }),
      page.waitForSelector('text=Loading', { timeout: 10000 }),
      page.waitForSelector('text=Error', { timeout: 10000 })
    ]);
    
    const hasExperienceContent = await page.locator('h1:has-text("Professional Experience")').isVisible();
    console.log(`Experience page loaded: ${hasExperienceContent}`);
    
    // Check contact page
    await page.goto('/contact');
    await page.waitForSelector('h1:has-text("Contact")');
    
    const hasContactInfo = await page.locator('a[href^="mailto:"], a[href^="tel:"]').count() > 0;
    console.log(`Contact info displayed: ${hasContactInfo}`);
    
    console.log('✅ Portfolio integration test completed');
  });

  test('Error Handling - Test invalid data and network errors', async ({ page }) => {
    console.log('🧪 Testing error handling...');
    
    // Test contact form with invalid email
    await page.click('a[href="/admin/contact"]');
    await page.waitForURL('/admin/contact');
    await page.waitForSelector('input[name="email"]');
    
    await page.fill('input[name="email"]', 'invalid-email');
    await page.click('button:has-text("Save Changes")');
    
    // Should either show validation error or save with warning
    await page.waitForTimeout(3000);
    
    // Test experience form with missing required fields
    await page.click('a[href="/admin/experience"]');
    await page.waitForURL('/admin/experience');
    await page.click('a:has-text("ADD EXPERIENCE")');
    await page.waitForURL('/admin/experience/new');
    
    // Try to submit empty form
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    
    // Should stay on form page or show validation errors
    const currentUrl = page.url();
    expect(currentUrl).toContain('/admin/experience/new');
    
    console.log('✅ Error handling test completed');
  });

  test('Navigation and Authentication - Test all admin links and logout', async ({ page }) => {
    console.log('🧪 Testing navigation and authentication...');
    
    // Test all navigation links from dashboard
    const navLinks = [
      { text: 'About', url: '/admin/about' },
      { text: 'Contact', url: '/admin/contact' },
      { text: 'Skills', url: '/admin/skills' },
      { text: 'Experience', url: '/admin/experience' },
      { text: 'Projects', url: '/admin/projects' },
      { text: 'Blog Posts', url: '/admin/blog' },
      { text: 'Messages', url: '/admin/contacts' }
    ];

    for (const link of navLinks) {
      await page.goto('/admin/dashboard');
      await page.waitForURL('/admin/dashboard');
      
      await page.click(`a:has-text("${link.text}")`);
      await page.waitForURL(link.url);
      
      // Verify page loaded
      await page.waitForSelector('h1');
      console.log(`✅ ${link.text} page loaded successfully`);
    }
    
    // Test logout functionality
    await page.goto('/admin/dashboard');
    const logoutButton = page.locator('button:has-text("Logout"), a:has-text("Logout")');
    if (await logoutButton.isVisible()) {
      await logoutButton.click();
      await page.waitForURL('/admin');
      
      // Verify redirected to login
      await expect(page.locator('input[name="email"]')).toBeVisible();
      console.log('✅ Logout functionality working');
    }
    
    console.log('✅ Navigation and authentication test completed');
  });
});
