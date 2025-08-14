import { test, expect } from '@playwright/test';

test.describe('Admin Contact Management', () => {
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

  test('should navigate to contact management page', async ({ page }) => {
    // Navigate to contact management
    await page.goto('/admin/contact');
    
    // Verify page loads correctly
    await expect(page.locator('h1')).toContainText('Edit Contact Section');
    await expect(page.getByTestId('contact-email-input')).toBeVisible();
  });

  test('should load existing contact data', async ({ page }) => {
    await page.goto('/admin/contact');
    
    // Wait for data to load
    await page.waitForSelector('input[name="email"]');
    
    // Verify form fields are populated
    const emailField = page.locator('input[name="email"]');
    const phoneField = page.locator('input[name="phone"]');
    const locationField = page.locator('input[name="location"]');
    
    await expect(emailField).not.toHaveValue('');
    await expect(phoneField).not.toHaveValue('');
    await expect(locationField).not.toHaveValue('');
  });

  test('should update contact information successfully', async ({ page }) => {
    await page.goto('/admin/contact');
    
    // Wait for form to load
    await page.waitForSelector('input[name="email"]');
    
    // Update contact information
    const testEmail = 'test@example.com';
    const testPhone = '+1 234 567 8900';
    const testLocation = 'Test City, Test Country';
    
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="phone"]', testPhone);
    await page.fill('input[name="location"]', testLocation);
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Wait for success message
    await expect(page.locator('.bg-green-50')).toBeVisible();
    await expect(page.locator('.bg-green-50')).toContainText('Contact information updated successfully');
    
    // Verify the data persists after reload
    await page.reload();
    await page.waitForSelector('input[name="email"]');
    
    await expect(page.locator('input[name="email"]')).toHaveValue(testEmail);
    await expect(page.locator('input[name="phone"]')).toHaveValue(testPhone);
    await expect(page.locator('input[name="location"]')).toHaveValue(testLocation);
  });

  test('should validate required fields', async ({ page }) => {
    await page.goto('/admin/contact');
    
    // Wait for form to load
    await page.waitForSelector('input[name="email"]');
    
    // Clear required fields
    await page.fill('input[name="email"]', '');
    await page.fill('input[name="phone"]', '');
    
    // Try to submit
    await page.click('button[type="submit"]');
    
    // Check for validation errors
    const emailField = page.locator('input[name="email"]');
    const phoneField = page.locator('input[name="phone"]');
    
    await expect(emailField).toHaveAttribute('required');
    await expect(phoneField).toHaveAttribute('required');
  });

  test('should update social links', async ({ page }) => {
    await page.goto('/admin/contact');
    
    // Wait for form to load
    await page.waitForSelector('input[name="email"]');
    
    // Find and update social links if they exist
    const linkedinInput = page.locator('input[placeholder*="LinkedIn"], input[value*="linkedin"]').first();
    const githubInput = page.locator('input[placeholder*="GitHub"], input[value*="github"]').first();
    
    if (await linkedinInput.isVisible()) {
      await linkedinInput.fill('https://linkedin.com/in/testuser');
    }
    
    if (await githubInput.isVisible()) {
      await githubInput.fill('https://github.com/testuser');
    }
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Wait for success message
    await expect(page.locator('.bg-green-50')).toBeVisible();
  });

  test('should update content sections', async ({ page }) => {
    await page.goto('/admin/contact');
    
    // Wait for form to load
    await page.waitForSelector('input[name="email"]');
    
    // Update content fields if they exist
    const titleField = page.locator('input[name="title"], input[placeholder*="title"]').first();
    const subtitleField = page.locator('input[name="subtitle"], input[placeholder*="subtitle"]').first();
    const descriptionField = page.locator('textarea[name="description"], textarea[placeholder*="description"]').first();
    
    if (await titleField.isVisible()) {
      await titleField.fill('Get In Touch');
    }
    
    if (await subtitleField.isVisible()) {
      await subtitleField.fill('Let\'s work together');
    }
    
    if (await descriptionField.isVisible()) {
      await descriptionField.fill('Updated description for contact section.');
    }
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Wait for success message
    await expect(page.locator('.bg-green-50')).toBeVisible();
  });

  test('should handle network errors gracefully', async ({ page }) => {
    await page.goto('/admin/contact');
    
    // Wait for form to load
    await page.waitForSelector('input[name="email"]');
    
    // Intercept the API call and make it fail
    await page.route('/api/admin/contact', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' })
      });
    });
    
    // Try to submit the form
    await page.fill('input[name="email"]', 'test@example.com');
    await page.click('button[type="submit"]');
    
    // Check for error message
    await expect(page.locator('.bg-red-50')).toBeVisible();
    await expect(page.locator('.bg-red-50')).toContainText('Failed to update contact information');
  });

  test('should show loading state during submission', async ({ page }) => {
    await page.goto('/admin/contact');
    
    // Wait for form to load
    await page.waitForSelector('input[name="email"]');
    
    // Intercept the API call to add delay
    await page.route('/api/admin/contact', async route => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      route.continue();
    });
    
    // Submit the form
    await page.fill('input[name="email"]', 'test@example.com');
    await page.click('button[type="submit"]');
    
    // Check for loading state
    await expect(page.locator('button[type="submit"]')).toBeDisabled();
    await expect(page.locator('button[type="submit"]')).toContainText('Saving');
  });

  test('should navigate back to dashboard', async ({ page }) => {
    await page.goto('/admin/contact');
    
    // Find and click back button
    const backButton = page.locator('a[href="/admin"], button:has-text("Back")').first();
    if (await backButton.isVisible()) {
      await backButton.click();
      await expect(page).toHaveURL('/admin');
    }
  });

  test('should maintain authentication throughout session', async ({ page }) => {
    await page.goto('/admin/contact');
    
    // Verify we're still authenticated
    await expect(page.locator('h1')).toContainText('Edit Contact Section');
    
    // Navigate to another admin page
    await page.goto('/admin/dashboard');
    await expect(page.locator('h1')).toContainText('Admin Dashboard');
    
    // Go back to contact page
    await page.goto('/admin/contact');
    await expect(page.locator('h1')).toContainText('Edit Contact Section');
  });
});
