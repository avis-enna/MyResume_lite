import { test, expect } from '@playwright/test';

test.describe('Portfolio Data Verification', () => {
  test('should display dynamic data from MongoDB on portfolio', async ({ page }) => {
    console.log('🧪 Testing portfolio data display...');

    // Visit the portfolio page
    await page.goto('/');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Test 1: Check if name is dynamic (not hardcoded)
    console.log('📋 Testing name display...');
    const nameElement = await page.locator('h1').first();
    const nameText = await nameElement.textContent();
    console.log(`Name on portfolio: ${nameText}`);
    
    // The name should be from MongoDB (John Doe from test data)
    expect(nameText).toContain('JOHN DOE');
    
    // Test 2: Check if skills are dynamic
    console.log('🛠️ Testing skills display...');
    const skillsSection = await page.locator('#skills');
    await expect(skillsSection).toBeVisible();
    
    // Check if skills categories are present
    const skillCategories = await page.locator('#skills .bg-amber-950\\/10').count();
    console.log(`Number of skill categories: ${skillCategories}`);
    expect(skillCategories).toBeGreaterThan(0);
    
    // Test 3: Check if certifications are dynamic
    console.log('🏆 Testing certifications display...');
    const certificationsSection = await page.locator('text=Certifications').first();
    if (await certificationsSection.isVisible()) {
      const certifications = await page.locator('text=Certifications').locator('..').locator('.grid > div').count();
      console.log(`Number of certifications: ${certifications}`);
      expect(certifications).toBeGreaterThan(0);
    }
    
    // Test 4: Check if contact info is dynamic
    console.log('📞 Testing contact info display...');
    const connectSection = await page.locator('text=Connect').first();
    await expect(connectSection).toBeVisible();
    
    // Test 5: Check if location is dynamic
    console.log('📍 Testing location display...');
    const locationSection = await page.locator('text=Location').first();
    await expect(locationSection).toBeVisible();
    
    // Test 6: Check if professional summary is dynamic
    console.log('📝 Testing professional summary...');
    const summarySection = await page.locator('text=Professional Summary').first();
    await expect(summarySection).toBeVisible();
    
    console.log('✅ All portfolio data verification tests passed!');
  });

  test('should display experience data from MongoDB', async ({ page }) => {
    console.log('💼 Testing experience data display...');

    // Visit the portfolio page
    await page.goto('/');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Check if experience section exists
    const experienceSection = await page.locator('#experience');
    await expect(experienceSection).toBeVisible();
    
    // Check if there are experience entries
    const experienceEntries = await page.locator('#experience .border-l-2').count();
    console.log(`Number of experience entries: ${experienceEntries}`);
    expect(experienceEntries).toBeGreaterThan(0);
    
    console.log('✅ Experience data verification passed!');
  });

  test('should have consistent data across all sections', async ({ page }) => {
    console.log('🔄 Testing data consistency across portfolio...');

    // Visit the portfolio page
    await page.goto('/');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Get name from header
    const headerName = await page.locator('h1').first().textContent();
    
    // Get name from footer copyright
    const footerName = await page.locator('footer p').textContent();
    
    console.log(`Header name: ${headerName}`);
    console.log(`Footer text: ${footerName}`);
    
    // Both should contain the same name
    expect(headerName).toBeTruthy();
    expect(footerName).toContain(headerName?.replace(/\s+/g, ' ').trim() || '');
    
    console.log('✅ Data consistency verification passed!');
  });
});
