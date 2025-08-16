import { test, expect } from '@playwright/test';

test.describe('Projects Integration', () => {
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

  test('should seed projects and display them in admin', async ({ page }) => {
    // First, seed the projects
    const seedResponse = await page.request.post('/api/admin/projects/seed');
    expect(seedResponse.ok()).toBeTruthy();

    // Navigate to admin projects page
    await page.click('a[href="/admin/projects"]');
    await page.waitForURL('/admin/projects');
    
    // Check if projects are displayed
    await expect(page.locator('h1')).toContainText('Manage Projects');
    
    // Should show projects instead of "No projects"
    await expect(page.locator('text=No projects')).not.toBeVisible();
    
    // Should show at least one project
    const projectCards = page.locator('.card');
    await expect(projectCards).toHaveCount({ min: 1 });

    // Check for specific seeded projects
    await expect(page.locator('h3:has-text("IoT-Based Continuous Abiotic Factor Monitoring")')).toBeVisible();
    await expect(page.locator('h3:has-text("AI Chatbot Microservice")')).toBeVisible();
  });

  test('should display projects on portfolio page', async ({ page }) => {
    // Navigate to projects page
    await page.goto('/projects');
    
    // Check if projects are displayed
    await expect(page.locator('h1')).toContainText('Projects');
    
    // Should not show "No Projects Yet" message
    await expect(page.locator('text=No Projects Yet')).not.toBeVisible();
    
    // Should show project cards
    await expect(page.locator('h2:has-text("IoT-Based Continuous Abiotic Factor Monitoring")')).toBeVisible();
    await expect(page.locator('h2:has-text("AI Chatbot Microservice")')).toBeVisible();

    // Check for featured project badge (should have at least one)
    await expect(page.locator('text=Featured Project').first()).toBeVisible();
  });

  test('should show conditional GitHub and Live Demo links', async ({ page }) => {
    // Navigate to projects page
    await page.goto('/projects');
    
    // Check for GitHub links (should be visible for projects that have them)
    const githubLinks = page.locator('a:has-text("View Code")');
    const githubCount = await githubLinks.count();
    expect(githubCount).toBeGreaterThan(0);

    // Check for Live Demo links (should only be visible for projects that have them)
    const liveDemoLinks = page.locator('a:has-text("Live Demo")');
    // AI Chatbot has live demo, IoT project doesn't
    await expect(liveDemoLinks).toHaveCount(1);
    
    // Verify the links have proper attributes
    const firstGithubLink = githubLinks.first();
    await expect(firstGithubLink).toHaveAttribute('target', '_blank');
    await expect(firstGithubLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('should add new project through admin and see it on portfolio', async ({ page }) => {
    // Navigate to admin projects page
    await page.click('a[href="/admin/projects"]');
    await page.waitForURL('/admin/projects');
    
    // Click Add Project button
    await page.click('text=ADD PROJECT');
    await page.waitForURL('/admin/projects/new');
    
    // Fill out the project form
    const testProject = {
      title: 'Test Integration Project',
      description: 'This is a test project created through admin integration testing.',
      technologies: 'React, Node.js, MongoDB',
      features: 'Feature 1\nFeature 2\nFeature 3',
      githubUrl: 'https://github.com/test/integration-project',
      liveUrl: 'https://test-integration.example.com'
    };
    
    await page.fill('input[name="title"]', testProject.title);
    await page.fill('textarea[name="description"]', testProject.description);
    await page.fill('input[name="technologies"]', testProject.technologies);
    await page.fill('textarea[name="features"]', testProject.features);
    await page.fill('input[name="githubUrl"]', testProject.githubUrl);
    await page.fill('input[name="liveUrl"]', testProject.liveUrl);

    // Mark as featured
    await page.check('input[name="featured"]');
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Should redirect back to projects list
    await page.waitForURL('/admin/projects');
    
    // Verify the new project appears in admin
    await expect(page.locator(`text=${testProject.title}`)).toBeVisible();
    
    // Navigate to portfolio projects page
    await page.goto('/projects');
    
    // Verify the new project appears on portfolio
    await expect(page.locator(`text=${testProject.title}`)).toBeVisible();
    await expect(page.locator(`text=${testProject.description}`)).toBeVisible();
    
    // Verify the links are displayed
    await expect(page.locator(`a[href="${testProject.githubUrl}"]`)).toBeVisible();
    await expect(page.locator(`a[href="${testProject.liveUrl}"]`)).toBeVisible();
    
    // Verify featured badge
    await expect(page.locator('text=Featured Project')).toHaveCount({ min: 1 });
  });

  test('should not show broken links when URLs are empty', async ({ page }) => {
    // Navigate to admin projects page
    await page.click('a[href="/admin/projects"]');
    await page.waitForURL('/admin/projects');
    
    // Click Add Project button
    await page.click('text=ADD PROJECT');
    await page.waitForURL('/admin/projects/new');
    
    // Fill out project form WITHOUT GitHub and Live URLs
    await page.fill('input[name="title"]', 'Project Without Links');
    await page.fill('textarea[name="description"]', 'This project has no external links.');
    await page.fill('input[name="technologies"]', 'JavaScript');
    await page.fill('textarea[name="features"]', 'Basic functionality');
    
    // Leave githubUrl and liveUrl empty
    
    // Submit the form
    await page.click('button[type="submit"]');
    await page.waitForURL('/admin/projects');
    
    // Navigate to portfolio projects page
    await page.goto('/projects');
    
    // Verify the project appears
    await expect(page.locator('text=Project Without Links')).toBeVisible();
    
    // Verify NO broken links are shown for this project
    const projectCard = page.locator('div:has-text("Project Without Links")').first();
    await expect(projectCard.locator('a:has-text("View Code")')).not.toBeVisible();
    await expect(projectCard.locator('a:has-text("Live Demo")')).not.toBeVisible();
  });
});
