/**
 * Test authentication flow end-to-end
 */

async function testAuthFlow() {
  console.log('🔐 Testing Authentication Flow...');
  
  const baseUrl = 'http://localhost:3001';
  
  try {
    // Step 1: Test login
    console.log('1️⃣ Testing login...');
    const loginResponse = await fetch(`${baseUrl}/api/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@admin.com',
        password: '$iva@V3nna21'
      }),
      credentials: 'include' // Important for cookies
    });

    if (!loginResponse.ok) {
      const error = await loginResponse.json();
      console.error('❌ Login failed:', error);
      return false;
    }

    const loginResult = await loginResponse.json();
    console.log('✅ Login successful:', loginResult.user.email);

    // Step 2: Test session check
    console.log('2️⃣ Testing session check...');
    const sessionResponse = await fetch(`${baseUrl}/api/admin/session-check`, {
      credentials: 'include' // Important for cookies
    });

    if (!sessionResponse.ok) {
      console.error('❌ Session check failed:', sessionResponse.status);
      return false;
    }

    const sessionResult = await sessionResponse.json();
    console.log('✅ Session check successful:', sessionResult.user.email);

    // Step 3: Test admin dashboard access
    console.log('3️⃣ Testing admin dashboard access...');
    const dashboardResponse = await fetch(`${baseUrl}/admin/dashboard`, {
      credentials: 'include'
    });

    if (!dashboardResponse.ok) {
      console.error('❌ Dashboard access failed:', dashboardResponse.status);
      return false;
    }

    console.log('✅ Dashboard access successful');

    // Step 4: Test API endpoints
    console.log('4️⃣ Testing admin API endpoints...');
    const aboutResponse = await fetch(`${baseUrl}/api/admin/about`, {
      credentials: 'include'
    });

    console.log('📊 About API status:', aboutResponse.status);

    console.log('🎉 Authentication flow test completed successfully!');
    return true;

  } catch (error) {
    console.error('❌ Authentication flow test failed:', error);
    return false;
  }
}

// Run the test
testAuthFlow().then(success => {
  console.log(`\n🎯 Overall result: ${success ? '✅ SUCCESS' : '❌ FAILED'}`);
  process.exit(success ? 0 : 1);
});
