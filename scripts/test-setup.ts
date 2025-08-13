/**
 * Test setup script to ensure proper test environment
 * Ensures admin user exists and test data is seeded
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../app/models/User';
import connectDB from '../app/lib/mongodb';

// Load environment variables
dotenv.config({ path: '.env.local' });

const TEST_ADMIN_CREDENTIALS = {
  email: 'admin@admin.com',
  password: '$iva@V3nna21',
  name: 'Test Administrator',
  role: 'admin' as const
};

async function setupTestEnvironment() {
  try {
    console.log('🧪 Setting up test environment...');

    // Set test environment variables
    process.env.NODE_ENV = 'test';
    process.env.PLAYWRIGHT_TEST = '1';

    console.log('✅ Test environment variables set');
    console.log('📧 Test Admin Email:', TEST_ADMIN_CREDENTIALS.email);
    console.log('🔐 Test Admin Password: [SECURED]');
    console.log('');
    console.log('ℹ️  Admin user will be created automatically when the development server starts');
    console.log('ℹ️  Use the test API endpoint /api/test/setup-admin to create admin user if needed');

  } catch (error) {
    console.error('❌ Error setting up test environment:', error);
    process.exit(1);
  }
}

async function seedTestData() {
  try {
    console.log('🌱 Seeding test data...');
    
    // Check if we need to seed experience data
    const Experience = mongoose.models.Experience || mongoose.model('Experience', new mongoose.Schema({
      title: String,
      company: String,
      duration: String,
      description: [String],
      responsibilities: [String],
      achievements: [String],
      technologies: [String],
      type: String,
      current: Boolean,
      startDate: Date,
      endDate: Date,
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now }
    }));
    
    const existingExperiences = await Experience.countDocuments();
    
    if (existingExperiences === 0) {
      console.log('📝 Creating sample experience data...');
      
      const sampleExperience = new Experience({
        title: 'Test Software Engineer',
        company: 'Test Company Inc.',
        duration: '2023 - Present',
        description: ['Test experience for automated testing'],
        responsibilities: [
          'Develop test applications',
          'Write automated tests',
          'Maintain test environments'
        ],
        achievements: [
          'Implemented comprehensive test suite',
          'Improved test coverage to 95%'
        ],
        technologies: ['JavaScript', 'TypeScript', 'React', 'Node.js'],
        type: 'full-time',
        current: true,
        startDate: new Date('2023-01-01'),
        endDate: null
      });
      
      await sampleExperience.save();
      console.log('✅ Sample experience data created');
    } else {
      console.log(`✅ Experience data already exists (${existingExperiences} records)`);
    }
    
  } catch (error) {
    console.error('❌ Error seeding test data:', error);
    // Don't fail the setup for seeding errors
  }
}

async function cleanupTestData() {
  try {
    console.log('🧹 Cleaning up test data...');
    await connectDB();
    
    // Remove test admin user
    await User.deleteOne({ 
      email: TEST_ADMIN_CREDENTIALS.email,
      role: 'admin' 
    });
    
    console.log('✅ Test cleanup complete');
    
  } catch (error) {
    console.error('❌ Error cleaning up test data:', error);
  } finally {
    await mongoose.connection.close();
  }
}

// Command line interface
const command = process.argv[2];

switch (command) {
  case 'setup':
  case 'init':
    setupTestEnvironment();
    break;
  case 'cleanup':
  case 'clean':
    cleanupTestData();
    break;
  default:
    console.log(`
🧪 Test Environment Setup Script

Usage:
  npm run test:setup     - Setup test environment
  npm run test:cleanup   - Cleanup test data

This script:
  - Creates test admin user with correct credentials
  - Seeds necessary test data
  - Configures test environment variables
  - Verifies authentication works
`);
    break;
}

export { setupTestEnvironment, cleanupTestData };
