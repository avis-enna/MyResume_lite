// Simple test script to check metrics API
const fetch = require('node-fetch');

async function testMetricsAPI() {
  try {
    console.log('Testing metrics API...');
    
    // First, let's test if we can reach the API
    const response = await fetch('http://localhost:3001/api/admin/metrics?type=summary&days=7', {
      headers: {
        'Cookie': 'admin_token=test' // This will fail auth but we can see if the endpoint exists
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers.raw());
    
    const text = await response.text();
    console.log('Response body:', text);
    
  } catch (error) {
    console.error('Error testing metrics API:', error);
  }
}

testMetricsAPI();
