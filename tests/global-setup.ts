/**
 * Global test setup for Playwright
 * Sets environment variables and ensures test environment is ready
 */

// Removed direct seeding import - using API instead

async function globalSetup() {
  // Set environment variables for test detection
  process.env.PLAYWRIGHT_TEST = '1';
  if (!process.env.NODE_ENV) {
    (process.env as any).NODE_ENV = 'test';
  }

  console.log('🧪 Global test setup: Environment variables set');
  console.log('   - PLAYWRIGHT_TEST=1');
  console.log('   - NODE_ENV=test');

  // Wait a bit for the dev server to start
  console.log('⏳ Waiting for development server to be ready...');
  await new Promise(resolve => setTimeout(resolve, 5000));

  // Try to setup admin user via API
  try {
    const response = await fetch('http://localhost:3001/api/test/setup-admin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Admin user setup:', result.message);
    } else {
      console.log('⚠️  Admin user setup via API failed, will be handled during tests');
    }
  } catch (error) {
    console.log('⚠️  Admin user setup via API failed, will be handled during tests');
  }

  // Seed deterministic test data via API
  try {
    console.log('🌱 Seeding test data via API...');
    const response = await fetch('http://localhost:3001/api/test/seed-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Test data seeded successfully:', result.counts);
    } else {
      console.log('⚠️  Test data seeding failed via API');
    }
  } catch (error) {
    console.log('⚠️  Test data seeding failed:', error);
  }

  return async () => {
    // Global teardown
    console.log('🧹 Global test teardown completed');
  };
}

export default globalSetup;
