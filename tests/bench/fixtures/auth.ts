import { test as base, expect } from '@playwright/test';
import path from 'path';

// Extend the base test with authentication
export const test = base.extend<{
  authenticatedPage: any;
}>({
  authenticatedPage: async ({ browser, baseURL }, use) => {
    // Create a new context with the saved authentication state
    const authFile = path.join(__dirname, '../../../playwright/.auth/bench-admin.json');

    const context = await browser.newContext({
      storageState: authFile,
    });

    const page = await context.newPage();

    // Simple approach: just provide the authenticated page
    // The global setup already verified authentication works
    console.log('✅ Using authenticated page context');

    await use(page);
    await context.close();
  },
});

export { expect } from '@playwright/test';
