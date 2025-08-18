import { test, expect } from '@playwright/test';

test.describe('Name Display Debug', () => {
  test('Check name display on main site vs admin panel', async ({ page }) => {
    // Test main site
    console.log('Testing main site...');
    await page.goto('/');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Take a screenshot of the main page
    await page.screenshot({ path: 'debug-main-site.png', fullPage: true });
    
    // Try to find the name in various places on the main site
    const heroSection = page.locator('h1').first();
    const heroText = await heroSection.textContent();
    console.log('Main site hero text:', heroText);
    
    // Check if there's any text containing "integration" or your actual name
    const pageContent = await page.textContent('body');
    console.log('Main site contains "integration":', pageContent?.includes('integration'));
    console.log('Main site contains "VENNA":', pageContent?.includes('VENNA'));
    console.log('Main site contains "Test User":', pageContent?.includes('Test User'));
    
    // Test admin panel
    console.log('Testing admin panel...');
    await page.goto('/admin');
    
    // Wait for admin page to load
    await page.waitForLoadState('networkidle');
    
    // Take a screenshot of the admin page
    await page.screenshot({ path: 'debug-admin-panel.png', fullPage: true });
    
    // Check admin panel content
    const adminContent = await page.textContent('body');
    console.log('Admin panel contains "integration":', adminContent?.includes('integration'));
    console.log('Admin panel contains "VENNA":', adminContent?.includes('VENNA'));
    console.log('Admin panel contains "Test User":', adminContent?.includes('Test User'));
    
    // Try to find specific elements that might contain the name
    const adminNameElements = await page.locator('text=/integration|VENNA|Test User/i').all();
    for (let i = 0; i < adminNameElements.length; i++) {
      const text = await adminNameElements[i].textContent();
      console.log(`Admin name element ${i}:`, text);
    }
    
    // Check the about API endpoint directly
    console.log('Testing API endpoints...');
    const aboutResponse = await page.request.get('/api/about');
    const aboutData = await aboutResponse.json();
    console.log('About API response:', JSON.stringify(aboutData, null, 2));
    
    const contactResponse = await page.request.get('/api/contact');
    const contactData = await contactResponse.json();
    console.log('Contact API response:', JSON.stringify(contactData, null, 2));
    
    const experienceResponse = await page.request.get('/api/experience');
    const experienceData = await experienceResponse.json();
    console.log('Experience API response:', JSON.stringify(experienceData, null, 2));
  });
});
