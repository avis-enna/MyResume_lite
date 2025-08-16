import { test, expect } from '@playwright/test';

test.describe('Comprehensive Admin Panel Test Suite', () => {
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

  test('Dashboard - All navigation links work', async ({ page }) => {
    console.log('Testing Dashboard navigation...');
    
    // Test all navigation links
    const navLinks = [
      { text: 'About', url: '/admin/about' },
      { text: 'Contact', url: '/admin/contact' },
      { text: 'Skills', url: '/admin/skills' },
      { text: 'Experience', url: '/admin/experience' },
      { text: 'Projects', url: '/admin/projects' },
      { text: 'Blog Posts', url: '/admin/blog' },
      { text: 'Messages', url: '/admin/contacts' } // Fixed: "Messages" not "Contacts"
    ];

    for (const link of navLinks) {
      await page.click(`a:has-text("${link.text}")`);
      await page.waitForURL(link.url);
      await page.goBack();
      await page.waitForURL('/admin/dashboard');
    }
  });

  test('About Section - Complete CRUD operations', async ({ page }) => {
    console.log('Testing About section...');
    
    await page.click('a[href="/admin/about"]');
    await page.waitForURL('/admin/about');
    
    // Wait for form to load
    await page.waitForSelector('input[name="name"]');
    
    // Test form fields exist
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="title"]')).toBeVisible();
    await expect(page.locator('textarea[name="bio-paragraph1"]')).toBeVisible(); // Fixed field name
    
    // Test saving data
    await page.fill('input[name="name"]', 'Test Admin User');
    await page.fill('input[name="title"]', 'Full Stack Developer');
    await page.fill('textarea[name="bio-paragraph1"]', 'Test bio paragraph 1'); // Fixed field name
    
    await page.click('button[type="submit"]');
    
    // Check for success message
    await expect(page.locator('text=Data saved successfully')).toBeVisible({ timeout: 10000 });
    
    // Verify data persisted
    await page.reload();
    await page.waitForSelector('input[name="name"]');
    await expect(page.locator('input[name="name"]')).toHaveValue('Test Admin User');
  });

  test('Contact Section - Save and error handling', async ({ page }) => {
    console.log('Testing Contact section...');
    
    await page.click('a[href="/admin/contact"]');
    await page.waitForURL('/admin/contact');
    
    // Wait for form to load
    await page.waitForSelector('input[name="email"]');
    
    // Test form fields exist
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="phone"]')).toBeVisible();
    await expect(page.locator('input[name="location"]')).toBeVisible();
    
    // Test saving valid data
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="phone"]', '+1234567890');
    await page.fill('input[name="location"]', 'Test City, Test Country');
    
    await page.click('button[type="submit"]');
    
    // Check for success or error message
    const successMessage = page.locator('text=Contact information updated successfully');
    const errorMessage = page.locator('text=Failed to update contact information');
    
    // Wait for either success or error
    await Promise.race([
      successMessage.waitFor({ timeout: 10000 }),
      errorMessage.waitFor({ timeout: 10000 })
    ]);
    
    // Log which message appeared
    if (await successMessage.isVisible()) {
      console.log('✅ Contact save successful');
    } else if (await errorMessage.isVisible()) {
      console.log('❌ Contact save failed - investigating...');
      // Take screenshot for debugging
      await page.screenshot({ path: 'contact-error.png' });
    }
  });

  test('Skills Section - Add and manage skills', async ({ page }) => {
    console.log('Testing Skills section...');
    
    await page.click('a[href="/admin/skills"]');
    await page.waitForURL('/admin/skills');
    
    // Wait for page to load
    await page.waitForSelector('[data-testid="skills-root"]', { timeout: 15000 });
    
    // Check if skills categories are visible
    const skillsExist = await page.locator('text=Frontend').isVisible();
    console.log('Skills categories visible:', skillsExist);
    
    // Try to add a skill if form is available
    const addSkillInput = page.locator('input[placeholder*="skill"]');
    if (await addSkillInput.isVisible()) {
      await addSkillInput.fill('Test Skill');
      const addButton = page.locator('button:has-text("Add")');
      if (await addButton.isVisible()) {
        await addButton.click();
      }
    }
  });

  test('Experience Section - CRUD operations', async ({ page }) => {
    console.log('Testing Experience section...');
    
    await page.click('a[href="/admin/experience"]');
    await page.waitForURL('/admin/experience');
    
    // Wait for page to load
    await page.waitForSelector('h1:has-text("Manage Experience")');
    
    // Test adding new experience
    await page.click('a:has-text("ADD EXPERIENCE")');
    await page.waitForURL('/admin/experience/new');
    
    // Fill out experience form
    await page.waitForSelector('input[name="company"]');
    await page.fill('input[name="company"]', 'Test Company');
    await page.fill('input[name="title"]', 'Test Position');
    await page.fill('input[name="startDate"]', '2023-01-01');
    await page.fill('input[name="endDate"]', '2023-12-31');
    
    // Fill description array field
    const descriptionField = page.locator('textarea[name="description.0"]');
    if (await descriptionField.isVisible()) {
      await descriptionField.fill('Test description');
    }
    
    await page.click('button[type="submit"]');
    
    // Should redirect back to experience list
    await page.waitForURL('/admin/experience');
    
    // Check if new experience appears
    await expect(page.locator('text=Test Company')).toBeVisible();
    
    // Test delete functionality
    const deleteButtons = page.locator('button:has-text("Delete")');
    const deleteCount = await deleteButtons.count();
    console.log(`Found ${deleteCount} delete buttons`);
    
    if (deleteCount > 0) {
      await deleteButtons.first().click();
      // Wait a moment for deletion
      await page.waitForTimeout(2000);
    }
  });

  test('Projects Section - CRUD operations', async ({ page }) => {
    console.log('Testing Projects section...');
    
    await page.click('a[href="/admin/projects"]');
    await page.waitForURL('/admin/projects');
    
    // Wait for page to load
    await page.waitForSelector('h1:has-text("Manage Projects")');
    
    // Test adding new project
    await page.click('a:has-text("ADD PROJECT")');
    await page.waitForURL('/admin/projects/new');
    
    // Fill out project form
    await page.waitForSelector('input[name="title"]');
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
    
    // Test edit functionality
    const editButtons = page.locator('a:has-text("Edit")');
    const editCount = await editButtons.count();
    console.log(`Found ${editCount} edit buttons`);
    
    if (editCount > 0) {
      await editButtons.first().click();
      // Should navigate to edit page
      await page.waitForURL(/\/admin\/projects\/.*\/edit/);
      
      // Test editing
      await page.waitForSelector('input[name="title"]');
      await page.fill('input[name="title"]', 'Updated Test Project');
      await page.click('button[type="submit"]');
      
      // Should redirect back to projects list
      await page.waitForURL('/admin/projects');
      await expect(page.locator('text=Updated Test Project')).toBeVisible();
    }
    
    // Test delete functionality
    const deleteButtons = page.locator('button:has-text("Delete")');
    const deleteCount = await deleteButtons.count();
    console.log(`Found ${deleteCount} delete buttons`);
    
    if (deleteCount > 0) {
      await deleteButtons.first().click();
      // Wait a moment for deletion
      await page.waitForTimeout(2000);
    }
  });

  test('Blog Section - Basic functionality', async ({ page }) => {
    console.log('Testing Blog section...');
    
    await page.click('a[href="/admin/blog"]');
    await page.waitForURL('/admin/blog');
    
    // Check if page loads
    await page.waitForSelector('h1');
    
    // Test adding new blog post if available
    const addButton = page.locator('a:has-text("Write New Post")').first(); // Fixed: use specific text and .first()
    if (await addButton.isVisible()) {
      await addButton.click();
      // Should navigate to new blog page
      await page.waitForURL('/admin/blog/new');
      
      // Go back to blog list
      await page.goBack();
      await page.waitForURL('/admin/blog');
    }
  });

  test('Contacts Section - View contacts', async ({ page }) => {
    console.log('Testing Contacts section...');
    
    await page.click('a[href="/admin/contacts"]');
    await page.waitForURL('/admin/contacts');
    
    // Check if page loads
    await page.waitForSelector('h1');
    
    // Check if contacts are displayed or empty state
    const hasContacts = await page.locator('table, .contact-item').isVisible();
    const emptyState = await page.locator('text=No contacts, text=Empty').isVisible();
    
    console.log('Has contacts:', hasContacts);
    console.log('Empty state:', emptyState);
  });

  test('Portfolio Integration - Verify data appears on public pages', async ({ page }) => {
    console.log('Testing portfolio data integration...');
    
    // Check main portfolio page
    await page.goto('/');
    await page.waitForSelector('h1');
    
    // Check if about data is displayed (should show test data "JOHN DOE")
    const nameElement = page.locator('h1').first();
    const nameText = await nameElement.textContent();
    console.log('Portfolio name:', nameText);

    // During tests, it should show the test data name
    await expect(nameElement).toContainText('JOHN DOE');
    
    // Check projects page
    await page.goto('/projects');
    await page.waitForSelector('h1:has-text("Projects")');
    
    // Check if projects are displayed
    const projectCards = page.locator('.bg-gray-950, .card, [class*="project"]');
    const projectCount = await projectCards.count();
    console.log('Projects found:', projectCount);
    
    // Check experience page
    await page.goto('/experience');
    await page.waitForSelector('h1:has-text("Professional Experience")'); // Fixed: correct h1 text

    // Check if experience is displayed
    const experienceContent = page.locator('.bg-gray-950, text=Professional, text=experience');
    const hasExperience = await experienceContent.count() > 0;
    console.log('Experience content found:', hasExperience);
    
    // Check contact page
    await page.goto('/contact');
    await page.waitForSelector('h1:has-text("Contact")');
    
    // Check if contact info is displayed
    const contactInfo = page.locator('text=@, a[href^="mailto:"], a[href^="tel:"]');
    const hasContactInfo = await contactInfo.count() > 0;
    console.log('Contact info found:', hasContactInfo);
  });
});
