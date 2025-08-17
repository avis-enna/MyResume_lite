import { chromium, FullConfig } from '@playwright/test';
import path from 'path';
import fs from 'fs';

async function globalSetup(config: FullConfig) {
  console.log('🔧 Bench Global Setup: Starting authentication setup...');
  
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Navigate to login page
    await page.goto('/admin');
    
    // Perform login
    await page.fill('input[name="email"]', 'admin@admin.com');
    await page.fill('input[name="password"]', '$iva@V3nna21');
    await page.click('button[type="submit"]');
    
    // Wait for successful login (redirect to dashboard)
    await page.waitForURL('/admin/dashboard', { timeout: 10000 });
    
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
    const adminSession = cookies.find(c => c.name === 'admin-session');
    
    if (adminSession) {
      console.log('🍪 Admin session cookie found and saved');
      console.log(`   Domain: ${adminSession.domain}`);
      console.log(`   Path: ${adminSession.path}`);
      console.log(`   Secure: ${adminSession.secure}`);
      console.log(`   HttpOnly: ${adminSession.httpOnly}`);
    } else {
      console.warn('⚠️  Warning: No admin-session cookie found');
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
