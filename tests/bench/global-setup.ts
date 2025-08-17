import { chromium, FullConfig } from '@playwright/test';
import path from 'path';
import fs from 'fs';

async function globalSetup(config: FullConfig) {
  console.log('🔧 Bench Global Setup: Starting authentication setup...');
  
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Get base URL from config
    const baseURL = config.projects[0]?.use?.baseURL || 'http://localhost:3001';

    // Navigate to login page
    await page.goto(`${baseURL}/admin`);
    
    // Perform login
    await page.fill('input[name="email"]', 'admin@admin.com');
    await page.fill('input[name="password"]', '$iva@V3nna21');
    await page.click('button[type="submit"]');
    
    // Wait for successful login (redirect to dashboard)
    await page.waitForURL(`${baseURL}/admin/dashboard`, { timeout: 10000 });
    
    // Verify we're authenticated
    await page.waitForSelector('h1:has-text("Admin Dashboard")', { timeout: 5000 });
    
    // Save authentication state
    const storageState = await context.storageState();
    const authFile = path.join(__dirname, '../../playwright/.auth/bench-admin.json');
    
    // Ensure directory exists
    const authDir = path.dirname(authFile);
    if (!fs.existsSync(authDir)) {
      fs.mkdirSync(authDir, { recursive: true });
    }
    
    // Save the authentication state
    fs.writeFileSync(authFile, JSON.stringify(storageState, null, 2));
    
    console.log('✅ Bench Global Setup: Authentication state saved successfully');
    console.log(`📁 Auth file saved to: ${authFile}`);
    
    // Verify cookies are present
    const cookies = storageState.cookies;
    const adminToken = cookies.find(c => c.name === 'admin_token');

    if (adminToken) {
      console.log('🍪 Admin token cookie found and saved');
      console.log(`   Domain: ${adminToken.domain}`);
      console.log(`   Path: ${adminToken.path}`);
      console.log(`   Secure: ${adminToken.secure}`);
      console.log(`   HttpOnly: ${adminToken.httpOnly}`);
      console.log(`   Expires: ${new Date(adminToken.expires * 1000).toISOString()}`);
    } else {
      console.warn('⚠️  Warning: No admin_token cookie found');
      console.log('Available cookies:', cookies.map(c => c.name));
    }
    
  } catch (error) {
    console.error('❌ Bench Global Setup: Authentication setup failed:', error);
    throw error;
  } finally {
    await context.close();
    await browser.close();
  }
}

export default globalSetup;
