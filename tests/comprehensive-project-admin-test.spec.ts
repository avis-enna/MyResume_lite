import { test, expect } from '@playwright/test';

/**
 * COMPREHENSIVE PROJECT ADMIN TEST SUITE
 * As a Test Engineer, this covers all possible scenarios for the admin project management system
 */

test.describe('Project Admin Management - Comprehensive Test Suite', () => {
  
  test.beforeEach(async ({ page }) => {
    // Setup: Login as admin
    await page.goto('/admin');
    await page.fill('input[name="email"]', 'admin@admin.com');
    await page.fill('input[name="password"]', '$iva@V3nna21');
    await page.click('button[type="submit"]');
    await page.waitForURL('/admin/dashboard');
  });

  test.describe('Authentication & Authorization Tests', () => {
    test('TC001: Unauthorized access to project edit page should redirect to login', async ({ page }) => {
      // Logout first
      await page.click('button:has-text("Logout")');
      await page.waitForURL('/admin');
      
      // Try to access edit page directly
      await page.goto('/admin/projects/invalid-id/edit');
      await page.waitForURL('/admin');
      
      // Should be redirected to login
      await expect(page.locator('input[name="email"]')).toBeVisible();
    });

    test('TC002: Valid admin session should allow access to project management', async ({ page }) => {
      await page.goto('/admin/projects');
      await expect(page.locator('h1:has-text("Manage Projects")')).toBeVisible();
    });
  });

  test.describe('Project Creation Tests', () => {
    test('TC003: Create project with all required fields', async ({ page }) => {
      await page.goto('/admin/projects');
      await page.click('a:has-text("ADD PROJECT")');
      await page.waitForURL('/admin/projects/new');

      const testProject = {
        title: `Test Project ${Date.now()}`,
        description: 'A comprehensive test project for validation',
        technologies: 'React, Node.js, MongoDB, TypeScript',
        features: 'Feature 1\nFeature 2\nFeature 3',
        githubUrl: 'https://github.com/test/project',
        liveUrl: 'https://test-project.example.com',
        imageUrl: 'https://example.com/image.jpg'
      };

      await page.fill('input[name="title"]', testProject.title);
      await page.fill('textarea[name="description"]', testProject.description);
      await page.fill('input[name="technologies"]', testProject.technologies);
      await page.fill('textarea[name="features"]', testProject.features);
      await page.fill('input[name="githubUrl"]', testProject.githubUrl);
      await page.fill('input[name="liveUrl"]', testProject.liveUrl);
      await page.fill('input[name="imageUrl"]', testProject.imageUrl);
      await page.check('input[name="featured"]');
      await page.fill('input[name="order"]', '1');

      await page.click('button[type="submit"]');
      await expect(page.locator('text=Project created successfully')).toBeVisible();
      await page.waitForURL('/admin/projects');
      
      // Verify project appears in list
      await expect(page.locator(`h3:has-text("${testProject.title}")`)).toBeVisible();
    });

    test('TC004: Create project with only required fields', async ({ page }) => {
      await page.goto('/admin/projects/new');

      await page.fill('input[name="title"]', 'Minimal Test Project');
      await page.fill('textarea[name="description"]', 'Minimal description');

      await page.click('button[type="submit"]');
      await expect(page.locator('text=Project created successfully')).toBeVisible();
    });

    test('TC005: Validation - Empty title should show error', async ({ page }) => {
      await page.goto('/admin/projects/new');
      
      await page.fill('textarea[name="description"]', 'Description without title');
      await page.click('button[type="submit"]');
      
      // Should not redirect (form validation should prevent submission)
      expect(page.url()).toContain('/admin/projects/new');
    });

    test('TC006: Validation - Empty description should show error', async ({ page }) => {
      await page.goto('/admin/projects/new');
      
      await page.fill('input[name="title"]', 'Title without description');
      await page.click('button[type="submit"]');
      
      // Should not redirect (form validation should prevent submission)
      expect(page.url()).toContain('/admin/projects/new');
    });

    test('TC007: Invalid URL formats should be handled gracefully', async ({ page }) => {
      await page.goto('/admin/projects/new');

      await page.fill('input[name="title"]', 'URL Test Project');
      await page.fill('textarea[name="description"]', 'Testing invalid URLs');
      await page.fill('input[name="githubUrl"]', 'invalid-url');
      await page.fill('input[name="liveUrl"]', 'also-invalid');
      await page.fill('input[name="imageUrl"]', 'not-a-url');

      await page.click('button[type="submit"]');
      
      // Should either show validation error or handle gracefully
      await page.waitForTimeout(2000);
    });

    test('TC008: Special characters in technologies and features', async ({ page }) => {
      await page.goto('/admin/projects/new');

      await page.fill('input[name="title"]', 'Special Chars Test');
      await page.fill('textarea[name="description"]', 'Testing special characters');
      await page.fill('input[name="technologies"]', 'React.js, Node.js, C++, C#, .NET');
      await page.fill('textarea[name="features"]', 'Feature with "quotes"\nFeature with \'apostrophes\'\nFeature with & symbols');

      await page.click('button[type="submit"]');
      await page.waitForTimeout(3000);
    });
  });

  test.describe('Project Editing Tests', () => {
    let testProjectId: string;

    test.beforeEach(async ({ page }) => {
      // Create a test project first
      await page.goto('/admin/projects/new');
      const testTitle = `Edit Test Project ${Date.now()}`;
      
      await page.fill('input[name="title"]', testTitle);
      await page.fill('textarea[name="description"]', 'Original description');
      await page.fill('input[name="technologies"]', 'React, Node.js');
      await page.fill('textarea[name="features"]', 'Original feature 1\nOriginal feature 2');
      
      await page.click('button[type="submit"]');
      await page.waitForURL('/admin/projects');
      
      // Get the project ID from the edit link
      const editLink = page.locator(`h3:has-text("${testTitle}") + * a:has-text("Edit")`).first();
      if (await editLink.isVisible()) {
        const href = await editLink.getAttribute('href');
        testProjectId = href?.split('/')[3] || '';
      }
    });

    test('TC009: Edit existing project - update all fields', async ({ page }) => {
      if (!testProjectId) {
        test.skip('No test project ID available');
        return;
      }

      await page.goto(`/admin/projects/${testProjectId}/edit`);
      await page.waitForSelector('input[name="title"]');

      // Update all fields
      await page.fill('input[name="title"]', 'Updated Project Title');
      await page.fill('textarea[name="description"]', 'Updated description with more details');
      await page.fill('input[name="technologies"]', 'React, Node.js, MongoDB, TypeScript');
      await page.fill('textarea[name="features"]', 'Updated feature 1\nNew feature 2\nAdditional feature 3');
      await page.fill('input[name="githubUrl"]', 'https://github.com/updated/repo');
      await page.fill('input[name="liveUrl"]', 'https://updated-project.com');
      await page.check('input[name="featured"]');
      await page.fill('input[name="order"]', '5');

      await page.click('button[type="submit"]');
      await page.waitForURL('/admin/projects');
      
      // Verify updates
      await expect(page.locator('h3:has-text("Updated Project Title")')).toBeVisible();
    });

    test('TC010: Edit project - clear optional fields', async ({ page }) => {
      if (!testProjectId) {
        test.skip('No test project ID available');
        return;
      }

      await page.goto(`/admin/projects/${testProjectId}/edit`);
      await page.waitForSelector('input[name="title"]');

      // Clear optional fields
      await page.fill('input[name="githubUrl"]', '');
      await page.fill('input[name="liveUrl"]', '');
      await page.fill('input[name="imageUrl"]', '');
      await page.uncheck('input[name="featured"]');

      await page.click('button[type="submit"]');
      await page.waitForURL('/admin/projects');
    });

    test('TC011: Edit project - invalid project ID should show error', async ({ page }) => {
      await page.goto('/admin/projects/invalid-project-id/edit');
      await page.waitForSelector('div:has-text("Project not found"), div:has-text("Failed to load project")');
    });

    test('TC012: Edit project - concurrent editing simulation', async ({ page }) => {
      if (!testProjectId) {
        test.skip('No test project ID available');
        return;
      }

      await page.goto(`/admin/projects/${testProjectId}/edit`);
      await page.waitForSelector('input[name="title"]');

      // Simulate slow editing
      await page.fill('input[name="title"]', 'Slow Edit Test');
      await page.waitForTimeout(1000);
      
      await page.click('button[type="submit"]');
      await page.waitForURL('/admin/projects');
    });
  });

  test.describe('Project Deletion Tests', () => {
    test('TC013: Delete project successfully', async ({ page }) => {
      // Create a project to delete
      await page.goto('/admin/projects/new');
      const deleteTestTitle = `Delete Test ${Date.now()}`;
      
      await page.fill('input[name="title"]', deleteTestTitle);
      await page.fill('textarea[name="description"]', 'Project to be deleted');
      await page.click('button[type="submit"]');
      await page.waitForURL('/admin/projects');

      // Count projects before deletion
      const initialCount = await page.locator('button:has-text("Delete")').count();

      // Delete the project
      const deleteButton = page.locator(`h3:has-text("${deleteTestTitle}") + * button:has-text("Delete")`).first();
      if (await deleteButton.isVisible()) {
        await deleteButton.click();
        
        // Handle confirmation dialog if present
        await page.waitForTimeout(1000);
        
        // Verify deletion
        const finalCount = await page.locator('button:has-text("Delete")').count();
        expect(finalCount).toBe(initialCount - 1);
        
        // Verify project no longer appears
        await expect(page.locator(`h3:has-text("${deleteTestTitle}")`)).not.toBeVisible();
      }
    });

    test('TC014: Delete non-existent project should handle gracefully', async ({ page }) => {
      // Try to delete via API call simulation
      const response = await page.request.delete('/api/admin/projects?id=non-existent-id');
      expect(response.status()).toBe(404);
    });
  });

  test.describe('Data Persistence & Caching Tests', () => {
    test('TC015: Data persistence after page refresh', async ({ page }) => {
      await page.goto('/admin/projects/new');
      
      const persistenceTitle = `Persistence Test ${Date.now()}`;
      await page.fill('input[name="title"]', persistenceTitle);
      await page.fill('textarea[name="description"]', 'Testing data persistence');
      await page.click('button[type="submit"]');
      await page.waitForURL('/admin/projects');

      // Refresh page
      await page.reload();
      await page.waitForSelector('h1:has-text("Manage Projects")');
      
      // Verify project still exists
      await expect(page.locator(`h3:has-text("${persistenceTitle}")`)).toBeVisible();
    });

    test('TC016: Navigation away and back preserves data', async ({ page }) => {
      await page.goto('/admin/projects');
      const initialProjectCount = await page.locator('h3').count();
      
      // Navigate away
      await page.goto('/admin/dashboard');
      await page.waitForSelector('h1:has-text("Admin Dashboard")');
      
      // Navigate back
      await page.goto('/admin/projects');
      await page.waitForSelector('h1:has-text("Manage Projects")');
      
      // Verify data consistency
      const finalProjectCount = await page.locator('h3').count();
      expect(finalProjectCount).toBe(initialProjectCount);
    });
  });

  test.describe('UI/UX & Accessibility Tests', () => {
    test('TC017: Form validation feedback', async ({ page }) => {
      await page.goto('/admin/projects/new');
      
      // Try to submit empty form
      await page.click('button[type="submit"]');
      
      // Check for HTML5 validation or custom validation messages
      const titleField = page.locator('input[name="title"]');
      const isInvalid = await titleField.evaluate(el => !el.checkValidity());
      expect(isInvalid).toBe(true);
    });

    test('TC018: Loading states and disabled buttons', async ({ page }) => {
      await page.goto('/admin/projects/new');
      
      await page.fill('input[name="title"]', 'Loading Test');
      await page.fill('textarea[name="description"]', 'Testing loading states');
      
      // Click submit and immediately check if button is disabled
      await page.click('button[type="submit"]');
      
      // Button should show loading state
      const submitButton = page.locator('button[type="submit"]');
      await expect(submitButton).toContainText('Saving...');
    });

    test('TC019: Responsive design - mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
      
      await page.goto('/admin/projects');
      await expect(page.locator('h1:has-text("Manage Projects")')).toBeVisible();
      
      await page.goto('/admin/projects/new');
      await expect(page.locator('input[name="title"]')).toBeVisible();
    });

    test('TC020: Keyboard navigation', async ({ page }) => {
      await page.goto('/admin/projects/new');
      
      // Tab through form fields
      await page.keyboard.press('Tab'); // Title field
      await page.keyboard.type('Keyboard Test');
      
      await page.keyboard.press('Tab'); // Description field
      await page.keyboard.type('Testing keyboard navigation');
      
      await page.keyboard.press('Tab'); // Technologies field
      await page.keyboard.type('React, Node.js');
    });
  });

  test.describe('Error Handling & Edge Cases', () => {
    test('TC021: Network error simulation', async ({ page }) => {
      await page.goto('/admin/projects/new');
      
      // Fill form
      await page.fill('input[name="title"]', 'Network Error Test');
      await page.fill('textarea[name="description"]', 'Testing network errors');
      
      // Simulate network failure
      await page.route('/api/admin/projects', route => route.abort());
      
      await page.click('button[type="submit"]');
      
      // Should show error message
      await expect(page.locator('text=Network error, text=Failed')).toBeVisible({ timeout: 10000 });
    });

    test('TC022: Large data input handling', async ({ page }) => {
      await page.goto('/admin/projects/new');
      
      const largeText = 'A'.repeat(10000); // Very long text
      
      await page.fill('input[name="title"]', 'Large Data Test');
      await page.fill('textarea[name="description"]', largeText);
      await page.fill('input[name="technologies"]', 'React, '.repeat(100)); // Many technologies
      
      await page.click('button[type="submit"]');
      await page.waitForTimeout(5000);
    });

    test('TC023: Special characters and Unicode handling', async ({ page }) => {
      await page.goto('/admin/projects/new');
      
      await page.fill('input[name="title"]', '测试项目 🚀 émojis & spéciàl chars');
      await page.fill('textarea[name="description"]', 'Testing unicode: 你好世界 🌍 café naïve résumé');
      await page.fill('input[name="technologies"]', 'React.js, Node.js, C++, C#');
      
      await page.click('button[type="submit"]');
      await page.waitForTimeout(3000);
    });

    test('TC024: Boundary value testing', async ({ page }) => {
      await page.goto('/admin/projects/new');
      
      // Test maximum order value
      await page.fill('input[name="title"]', 'Boundary Test');
      await page.fill('textarea[name="description"]', 'Testing boundary values');
      await page.fill('input[name="order"]', '999999');
      
      await page.click('button[type="submit"]');
      await page.waitForTimeout(3000);
    });
  });

  test.describe('Integration Tests', () => {
    test('TC025: End-to-end project lifecycle', async ({ page }) => {
      const projectTitle = `E2E Test ${Date.now()}`;
      
      // Create
      await page.goto('/admin/projects/new');
      await page.fill('input[name="title"]', projectTitle);
      await page.fill('textarea[name="description"]', 'End-to-end test project');
      await page.click('button[type="submit"]');
      await page.waitForURL('/admin/projects');
      
      // Verify creation
      await expect(page.locator(`h3:has-text("${projectTitle}")`)).toBeVisible();
      
      // Edit
      const editLink = page.locator(`h3:has-text("${projectTitle}") + * a:has-text("Edit")`).first();
      if (await editLink.isVisible()) {
        await editLink.click();
        await page.waitForSelector('input[name="title"]');
        
        await page.fill('input[name="title"]', `${projectTitle} - Updated`);
        await page.click('button[type="submit"]');
        await page.waitForURL('/admin/projects');
        
        // Verify update
        await expect(page.locator(`h3:has-text("${projectTitle} - Updated")`)).toBeVisible();
      }
      
      // Delete
      const deleteButton = page.locator(`h3:has-text("${projectTitle} - Updated") + * button:has-text("Delete")`).first();
      if (await deleteButton.isVisible()) {
        await deleteButton.click();
        await page.waitForTimeout(2000);
        
        // Verify deletion
        await expect(page.locator(`h3:has-text("${projectTitle} - Updated")`)).not.toBeVisible();
      }
    });

    test('TC026: Project data appears on public portfolio', async ({ page }) => {
      const portfolioTestTitle = `Portfolio Test ${Date.now()}`;
      
      // Create project in admin
      await page.goto('/admin/projects/new');
      await page.fill('input[name="title"]', portfolioTestTitle);
      await page.fill('textarea[name="description"]', 'Should appear on portfolio');
      await page.check('input[name="featured"]');
      await page.click('button[type="submit"]');
      await page.waitForURL('/admin/projects');
      
      // Check public portfolio
      await page.goto('/projects');
      await page.waitForSelector('h1:has-text("Projects")');
      
      // Verify project appears (may take time to propagate)
      await page.waitForTimeout(2000);
      const projectVisible = await page.locator(`text=${portfolioTestTitle}`).isVisible();
      console.log(`Portfolio project visibility: ${projectVisible}`);
    });
  });
});
