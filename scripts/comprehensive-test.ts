/**
 * Comprehensive testing script for admin panel, data compression, and storage monitoring
 * Includes stress testing with MongoDB free tier considerations
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../app/lib/mongodb';
import User from '../app/models/User';
import { compressData, decompressData, getCompressionStats } from '../app/lib/compression';

// Load environment variables
dotenv.config({ path: '.env.local' });

interface TestResults {
  adminAuth: boolean;
  dataCompression: boolean;
  storageUsage: any;
  stressTest: boolean;
  errors: string[];
}

const TEST_CREDENTIALS = {
  email: 'admin@admin.com',
  password: '$iva@V3nna21'
};

async function testAdminAuthentication(): Promise<boolean> {
  console.log('🔐 Testing Admin Authentication...');

  try {
    // First, clear any existing cookies
    console.log('🧹 Clearing existing cookies...');
    await fetch('http://localhost:3001/api/admin/logout', {
      method: 'POST'
    });

    // Test login
    const response = await fetch('http://localhost:3001/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(TEST_CREDENTIALS),
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Admin login successful:', result.user.email);

      // Extract cookies from response
      const setCookieHeader = response.headers.get('set-cookie');
      console.log('🍪 Login set cookies:', setCookieHeader ? 'yes' : 'no');

      return true;
    } else {
      const error = await response.json();
      console.error('❌ Admin login failed:', error.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Admin login error:', error);
    return false;
  }
}

async function testDataCompression(): Promise<boolean> {
  console.log('🗜️ Testing Data Compression...');
  
  try {
    // Create test data of various sizes
    const smallData = { message: 'Small test data' };
    const mediumData = {
      title: 'Medium Test Blog Post',
      content: 'Lorem ipsum '.repeat(100), // ~1.1KB
      tags: ['test', 'compression', 'medium'],
      metadata: { author: 'Test User', date: new Date() }
    };
    const largeData = {
      title: 'Large Test Blog Post',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(500), // ~27KB
      tags: ['test', 'compression', 'large'],
      metadata: { author: 'Test User', date: new Date() },
      sections: Array.from({ length: 10 }, (_, i) => ({
        title: `Section ${i + 1}`,
        content: 'Detailed section content. '.repeat(50)
      }))
    };

    // Test compression on different data sizes
    console.log('📊 Testing compression on different data sizes...');
    
    const smallCompressed = await compressData(smallData);
    const mediumCompressed = await compressData(mediumData);
    const largeCompressed = await compressData(largeData);

    console.log('Small data:', getCompressionStats(smallCompressed));
    console.log('Medium data:', getCompressionStats(mediumCompressed));
    console.log('Large data:', getCompressionStats(largeCompressed));

    // Test decompression
    const smallDecompressed = await decompressData(smallCompressed);
    const mediumDecompressed = await decompressData(mediumCompressed);
    const largeDecompressed = await decompressData(largeCompressed);

    // Verify data integrity
    const smallMatch = JSON.stringify(smallData) === JSON.stringify(smallDecompressed);
    const mediumMatch = JSON.stringify(mediumData) === JSON.stringify(mediumDecompressed);
    const largeMatch = JSON.stringify(largeData) === JSON.stringify(largeDecompressed);

    console.log('✅ Data integrity checks:');
    console.log('  Small data:', smallMatch ? '✅' : '❌');
    console.log('  Medium data:', mediumMatch ? '✅' : '❌');
    console.log('  Large data:', largeMatch ? '✅' : '❌');

    return smallMatch && mediumMatch && largeMatch;
  } catch (error) {
    console.error('❌ Data compression test failed:', error);
    return false;
  }
}

async function monitorStorageUsage(): Promise<any> {
  console.log('📊 Monitoring Storage Usage...');
  
  try {
    await connectDB();
    
    // Get database stats
    if (!mongoose.connection.db) {
      throw new Error('Database connection not established');
    }
    const admin = mongoose.connection.db.admin();
    const dbStats = await mongoose.connection.db.stats();
    
    const storageInfo = {
      dataSize: dbStats.dataSize,
      storageSize: dbStats.storageSize,
      indexSize: dbStats.indexSize,
      totalSize: dbStats.dataSize + dbStats.indexSize,
      collections: dbStats.collections,
      objects: dbStats.objects,
      avgObjSize: dbStats.avgObjSize,
      freeStorageSize: dbStats.freeStorageSize || 0,
      usagePercentage: ((dbStats.dataSize + dbStats.indexSize) / (512 * 1024 * 1024)) * 100 // 512MB limit
    };

    console.log('📈 Storage Statistics:');
    console.log(`  Data Size: ${(storageInfo.dataSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  Storage Size: ${(storageInfo.storageSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  Index Size: ${(storageInfo.indexSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  Total Size: ${(storageInfo.totalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  Usage: ${storageInfo.usagePercentage.toFixed(2)}% of 512MB limit`);
    console.log(`  Collections: ${storageInfo.collections}`);
    console.log(`  Objects: ${storageInfo.objects}`);
    console.log(`  Avg Object Size: ${storageInfo.avgObjSize} bytes`);

    return storageInfo;
  } catch (error) {
    console.error('❌ Storage monitoring failed:', error);
    return null;
  }
}

async function createTestData(): Promise<void> {
  console.log('🌱 Creating test data for stress testing...');
  
  try {
    await connectDB();

    // Create test blog posts with compression
    const BlogPost = mongoose.models.BlogPost || mongoose.model('BlogPost', new mongoose.Schema({
      title: String,
      slug: String,
      excerpt: String,
      content: String,
      compressedContent: {
        data: String,
        compressed: Boolean,
        originalSize: Number,
        compressedSize: Number,
        compressionRatio: Number
      },
      tags: [String],
      published: Boolean,
      createdAt: { type: Date, default: Date.now }
    }));

    const testPosts = [];
    for (let i = 1; i <= 10; i++) {
      const largeContent = `This is test blog post ${i}. `.repeat(1000); // ~25KB each
      const compressedContent = await compressData(largeContent);
      
      testPosts.push({
        title: `Test Blog Post ${i}`,
        slug: `test-blog-post-${i}`,
        excerpt: `This is the excerpt for test blog post ${i}`,
        content: undefined, // Will be stored compressed
        compressedContent,
        tags: ['test', 'stress', 'compression'],
        published: true
      });
    }

    await BlogPost.insertMany(testPosts);
    console.log(`✅ Created ${testPosts.length} test blog posts with compression`);

    // Create test users (small data)
    const testUsers = [];
    for (let i = 1; i <= 5; i++) {
      testUsers.push({
        email: `testuser${i}@test.com`,
        password: 'testpassword123',
        name: `Test User ${i}`,
        role: 'user'
      });
    }

    await User.insertMany(testUsers);
    console.log(`✅ Created ${testUsers.length} test users`);

  } catch (error) {
    console.error('❌ Test data creation failed:', error);
    throw error;
  }
}

async function stressTest(): Promise<boolean> {
  console.log('⚡ Running Stress Test...');
  
  try {
    // Monitor initial storage
    const initialStorage = await monitorStorageUsage();
    
    // Create test data
    await createTestData();
    
    // Monitor storage after data creation
    const afterStorage = await monitorStorageUsage();
    
    // Test concurrent operations (limited for free tier)
    console.log('🔄 Testing concurrent operations...');
    const concurrentPromises = [];
    
    for (let i = 0; i < 5; i++) { // Limited concurrent operations for free tier
      concurrentPromises.push(testAdminAuthentication());
      concurrentPromises.push(testDataCompression());
    }
    
    const results = await Promise.all(concurrentPromises);
    const successRate = results.filter(r => r).length / results.length;
    
    console.log(`✅ Concurrent operations success rate: ${(successRate * 100).toFixed(1)}%`);
    
    // Calculate storage impact
    const storageIncrease = afterStorage.totalSize - initialStorage.totalSize;
    console.log(`📈 Storage increase: ${(storageIncrease / 1024 / 1024).toFixed(2)} MB`);
    
    return successRate > 0.8; // 80% success rate threshold
  } catch (error) {
    console.error('❌ Stress test failed:', error);
    return false;
  }
}

async function cleanupTestData(): Promise<void> {
  console.log('🧹 Cleaning up test data...');
  
  try {
    await connectDB();
    
    // Remove test blog posts
    const BlogPost = mongoose.models.BlogPost;
    if (BlogPost) {
      const deletedPosts = await BlogPost.deleteMany({ 
        tags: { $in: ['test', 'stress'] } 
      });
      console.log(`✅ Deleted ${deletedPosts.deletedCount} test blog posts`);
    }
    
    // Remove test users (keep admin)
    const deletedUsers = await User.deleteMany({ 
      email: { $regex: /^testuser\d+@test\.com$/ } 
    });
    console.log(`✅ Deleted ${deletedUsers.deletedCount} test users`);
    
    // Final storage check
    const finalStorage = await monitorStorageUsage();
    console.log('🎯 Final storage usage after cleanup:');
    console.log(`  Total Size: ${(finalStorage.totalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  Usage: ${finalStorage.usagePercentage.toFixed(2)}% of 512MB limit`);
    
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
  }
}

async function runComprehensiveTest(): Promise<TestResults> {
  const results: TestResults = {
    adminAuth: false,
    dataCompression: false,
    storageUsage: null,
    stressTest: false,
    errors: []
  };

  console.log('🚀 Starting Comprehensive Test Suite...');
  console.log('⚠️  MongoDB Free Tier - 512MB Storage Limit');
  console.log('=====================================\n');

  try {
    // Test 1: Admin Authentication
    results.adminAuth = await testAdminAuthentication();
    
    // Test 2: Data Compression
    results.dataCompression = await testDataCompression();
    
    // Test 3: Storage Monitoring
    results.storageUsage = await monitorStorageUsage();
    
    // Test 4: Stress Test
    results.stressTest = await stressTest();
    
    // Cleanup
    await cleanupTestData();
    
  } catch (error) {
    results.errors.push(error.message);
    console.error('❌ Test suite error:', error);
  } finally {
    await mongoose.connection.close();
  }

  // Print final results
  console.log('\n🎯 COMPREHENSIVE TEST RESULTS:');
  console.log('=====================================');
  console.log(`Admin Authentication: ${results.adminAuth ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Data Compression: ${results.dataCompression ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Storage Monitoring: ${results.storageUsage ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Stress Test: ${results.stressTest ? '✅ PASS' : '❌ FAIL'}`);
  
  if (results.errors.length > 0) {
    console.log('\n❌ ERRORS:');
    results.errors.forEach(error => console.log(`  - ${error}`));
  }

  const overallSuccess = results.adminAuth && results.dataCompression && results.storageUsage && results.stressTest;
  console.log(`\n🎉 OVERALL RESULT: ${overallSuccess ? '✅ SUCCESS' : '❌ NEEDS ATTENTION'}`);

  return results;
}

// Run the test if called directly
if (require.main === module) {
  runComprehensiveTest().catch(console.error);
}

export { runComprehensiveTest, testAdminAuthentication, testDataCompression, monitorStorageUsage };
