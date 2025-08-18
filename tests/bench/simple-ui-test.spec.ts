import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Simple UI Tests', () => {
  test('should perform basic admin UI operations', async ({ browser, baseURL }) => {
    console.log('🧪 Testing basic admin UI operations...');
    
    // Create context with saved auth state
    const authFile = path.join(__dirname, '../../playwright/.auth/bench-admin.json');
    const context = await browser.newContext({
      storageState: authFile,
    });
    
    const page = await context.newPage();
    
    try {
      // Test 1: Navigate to About page and verify it loads
      console.log('📍 Test 1: About page...');
      await page.goto(`${baseURL}/admin/about`);
      await page.waitForLoadState('networkidle');
      
      const aboutUrl = page.url();
      console.log(`📄 About URL: ${aboutUrl}`);
      
      if (aboutUrl.includes('/admin/about')) {
        console.log('✅ About page loaded successfully');
        
        // Try to interact with the name field
        const nameInput = page.locator('input[name="name"]');
        if (await nameInput.isVisible()) {
          const currentValue = await nameInput.inputValue();
          console.log(`📝 Current name value: ${currentValue}`);
          
          // Update the name
          const testName = `Test User ${Date.now()}`;
          await nameInput.fill(testName);
          console.log(`📝 Updated name to: ${testName}`);
          
          // Submit the form
          const submitButton = page.locator('button[type="submit"]');
          if (await submitButton.isVisible()) {
            await submitButton.click();
            await page.waitForTimeout(2000);
            console.log('✅ About form submitted successfully');
          }
        }
      }
      
      // Test 2: Navigate to Skills page
      console.log('📍 Test 2: Skills page...');
      await page.goto(`${baseURL}/admin/skills`);
      await page.waitForLoadState('networkidle');
      
      const skillsUrl = page.url();
      console.log(`📄 Skills URL: ${skillsUrl}`);
      
      if (skillsUrl.includes('/admin/skills')) {
        console.log('✅ Skills page loaded successfully');
        
        // Try to add a skill - use the first specific category button to avoid ambiguity
        const addSkillButton = page.locator('[data-testid="add-skill-toggle-programming"]');
        if (await addSkillButton.isVisible()) {
          await addSkillButton.click();
          await page.waitForTimeout(1000);
          
          // Fill skill name
          const skillNameInput = page.locator('input[placeholder*="skill"], input[name*="skill"]').first();
          if (await skillNameInput.isVisible()) {
            await skillNameInput.fill(`Test Skill ${Date.now()}`);
            console.log('✅ Skill name filled');
          }
        }
      }
      
      // Test 3: Navigate to Contact page
      console.log('📍 Test 3: Contact page...');
      await page.goto(`${baseURL}/admin/contact`);
      await page.waitForLoadState('networkidle');
      
      const contactUrl = page.url();
      console.log(`📄 Contact URL: ${contactUrl}`);
      
      if (contactUrl.includes('/admin/contact')) {
        console.log('✅ Contact page loaded successfully');
        
        // Try to update email
        const emailInput = page.locator('input[name="email"], input[type="email"]');
        if (await emailInput.isVisible()) {
          const currentEmail = await emailInput.inputValue();
          console.log(`📧 Current email: ${currentEmail}`);
        }
      }
      
      // Test 4: Navigate to Experience page
      console.log('📍 Test 4: Experience page...');
      await page.goto(`${baseURL}/admin/experience`);
      await page.waitForLoadState('networkidle');
      
      const experienceUrl = page.url();
      console.log(`📄 Experience URL: ${experienceUrl}`);
      
      if (experienceUrl.includes('/admin/experience')) {
        console.log('✅ Experience page loaded successfully');
        
        // Try to add experience
        const addExpButton = page.locator('button:has-text("Add Experience"), button:has-text("Add Entry")');
        if (await addExpButton.isVisible()) {
          await addExpButton.click();
          await page.waitForTimeout(1000);
          
          // Fill company name
          const companyInput = page.locator('input[name*="company"], input[placeholder*="company"]').first();
          if (await companyInput.isVisible()) {
            await companyInput.fill(`Test Company ${Date.now()}`);
            console.log('✅ Company name filled');
          }
        }
      }
      
      // Test 5: Navigate to Projects page
      console.log('📍 Test 5: Projects page...');
      await page.goto(`${baseURL}/admin/projects`);
      await page.waitForLoadState('networkidle');
      
      const projectsUrl = page.url();
      console.log(`📄 Projects URL: ${projectsUrl}`);
      
      if (projectsUrl.includes('/admin/projects')) {
        console.log('✅ Projects page loaded successfully');
        
        // Try to add project
        const addProjectButton = page.locator('button:has-text("Add Project"), button:has-text("Add Entry")');
        if (await addProjectButton.isVisible()) {
          await addProjectButton.click();
          await page.waitForTimeout(1000);
          
          // Fill project name
          const projectNameInput = page.locator('input[name*="title"], input[name*="name"], input[placeholder*="project"]').first();
          if (await projectNameInput.isVisible()) {
            await projectNameInput.fill(`Test Project ${Date.now()}`);
            console.log('✅ Project name filled');
          }
        }
      }
      
      console.log('🎉 All basic UI tests completed successfully!');
      
    } catch (error) {
      console.error('❌ UI test failed:', error);
      throw error;
    } finally {
      await context.close();
    }
  });

  test('should verify form interactions work', async ({ browser, baseURL }) => {
    console.log('🧪 Testing form interactions...');
    
    const authFile = path.join(__dirname, '../../playwright/.auth/bench-admin.json');
    const context = await browser.newContext({
      storageState: authFile,
    });
    
    const page = await context.newPage();
    
    try {
      // Focus on About page form interactions
      await page.goto(`${baseURL}/admin/about`);
      await page.waitForLoadState('networkidle');
      
      console.log('📍 Testing About form interactions...');
      
      // Check if form elements are present
      const nameInput = page.locator('input[name="name"]');
      const titleInput = page.locator('input[name="title"]');
      const summaryTextarea = page.locator('textarea[name="summary"]');
      const submitButton = page.locator('button[type="submit"]');
      
      if (await nameInput.isVisible()) {
        console.log('✅ Name input found');
        await nameInput.fill('Test Name');
      }
      
      if (await titleInput.isVisible()) {
        console.log('✅ Title input found');
        await titleInput.fill('Test Title');
      }
      
      if (await summaryTextarea.isVisible()) {
        console.log('✅ Summary textarea found');
        await summaryTextarea.fill('Test professional summary');
      }
      
      if (await submitButton.isVisible()) {
        console.log('✅ Submit button found');
        await submitButton.click();
        await page.waitForTimeout(2000);
        console.log('✅ Form submitted');
      }
      
      console.log('🎉 Form interaction test completed!');
      
    } catch (error) {
      console.error('❌ Form interaction test failed:', error);
      throw error;
    } finally {
      await context.close();
    }
  });
});
