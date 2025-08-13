/**
 * Database initialization script to create secure admin user
 * Run this once to set up the admin account with secure credentials
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../app/models/User';
import connectDB from '../app/lib/mongodb';

// Load environment variables
dotenv.config({ path: '.env.local' });

const ADMIN_CREDENTIALS = {
  email: 'admin@admin.com',
  password: '$iva@V3nna21', // This will be hashed automatically
  name: 'System Administrator',
  role: 'admin' as const
};

async function initializeAdmin() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    console.log('📍 MongoDB URI:', process.env.MONGODB_URI ? 'Loaded from env' : 'Not found');
    await connectDB();
    
    // Check if admin user already exists
    const existingAdmin = await User.findOne({ 
      email: ADMIN_CREDENTIALS.email,
      role: 'admin' 
    });

    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      console.log(`📧 Email: ${existingAdmin.email}`);
      console.log(`👤 Name: ${existingAdmin.name}`);
      console.log(`📅 Created: ${existingAdmin.createdAt}`);
      
      // Update password if needed (for password changes)
      if (process.argv.includes('--update-password')) {
        existingAdmin.password = ADMIN_CREDENTIALS.password;
        await existingAdmin.save();
        console.log('🔐 Admin password updated successfully');
      }
      
      return;
    }

    // Create new admin user
    console.log('🔄 Creating admin user...');
    const adminUser = new User(ADMIN_CREDENTIALS);
    await adminUser.save();

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', ADMIN_CREDENTIALS.email);
    console.log('👤 Name:', ADMIN_CREDENTIALS.name);
    console.log('🔐 Password: [SECURED - Hashed with bcrypt]');
    console.log('🛡️ Role: admin');
    
    // Verify the user was created
    const verifyUser = await User.findOne({ email: ADMIN_CREDENTIALS.email });
    if (verifyUser) {
      console.log('✅ Verification successful - Admin user is ready');
    } else {
      console.error('❌ Verification failed - Admin user not found');
    }

  } catch (error) {
    console.error('❌ Error initializing admin user:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

async function removeAdmin() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await connectDB();
    
    const result = await User.deleteOne({ 
      email: ADMIN_CREDENTIALS.email,
      role: 'admin' 
    });

    if (result.deletedCount > 0) {
      console.log('✅ Admin user removed successfully');
    } else {
      console.log('ℹ️ No admin user found to remove');
    }

  } catch (error) {
    console.error('❌ Error removing admin user:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

async function listAdmins() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await connectDB();
    
    const admins = await User.find({ role: 'admin' }).select('-password');
    
    if (admins.length === 0) {
      console.log('ℹ️ No admin users found');
      return;
    }

    console.log(`📋 Found ${admins.length} admin user(s):`);
    admins.forEach((admin, index) => {
      console.log(`\n${index + 1}. ${admin.name}`);
      console.log(`   📧 Email: ${admin.email}`);
      console.log(`   📅 Created: ${admin.createdAt}`);
      console.log(`   🔐 Last Login: ${admin.lastLogin || 'Never'}`);
    });

  } catch (error) {
    console.error('❌ Error listing admin users:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Command line interface
const command = process.argv[2];

switch (command) {
  case 'create':
  case 'init':
    initializeAdmin();
    break;
  case 'remove':
  case 'delete':
    removeAdmin();
    break;
  case 'list':
    listAdmins();
    break;
  case 'update-password':
    process.argv.push('--update-password');
    initializeAdmin();
    break;
  default:
    console.log(`
🔐 Admin User Management Script

Usage:
  npm run init-admin create        - Create admin user
  npm run init-admin list          - List all admin users  
  npm run init-admin remove        - Remove admin user
  npm run init-admin update-password - Update admin password

Credentials:
  Email: ${ADMIN_CREDENTIALS.email}
  Password: [SECURED]
  Role: admin
`);
    break;
}

export { initializeAdmin, removeAdmin, listAdmins };
