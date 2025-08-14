/**
 * Test-only API endpoint to create admin user
 * Only available in test environment
 */

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import User from '@/app/models/User';

const isTestEnvironment = process.env.NODE_ENV === 'test' ||
                         process.env.PLAYWRIGHT_TEST === '1' ||
                         process.env.CI === 'true' ||
                         process.env.NODE_ENV === 'development'; // Allow in development for setup

export async function POST(request: NextRequest) {
  // Only allow in test/development environment
  if (!isTestEnvironment) {
    return NextResponse.json(
      { error: 'This endpoint is only available in test environment' },
      { status: 403 }
    );
  }

  try {
    await connectDB();

    const TEST_ADMIN_CREDENTIALS = {
      email: 'admin@admin.com',
      password: '$iva@V3nna21',
      name: 'Test Administrator',
      role: 'admin' as const
    };

    // Check if admin user already exists
    let adminUser = await User.findOne({ 
      email: TEST_ADMIN_CREDENTIALS.email,
      role: 'admin' 
    });

    if (!adminUser) {
      // Create new admin user
      adminUser = new User(TEST_ADMIN_CREDENTIALS);
      await adminUser.save();
      
      return NextResponse.json({
        success: true,
        message: 'Test admin user created successfully',
        user: {
          email: adminUser.email,
          name: adminUser.name,
          role: adminUser.role
        }
      });
    } else {
      // Update existing user password and clear lockout
      adminUser.password = TEST_ADMIN_CREDENTIALS.password;
      adminUser.loginAttempts = 0;
      adminUser.lockUntil = undefined;
      await adminUser.save();
      
      return NextResponse.json({
        success: true,
        message: 'Test admin user already exists, password updated',
        user: {
          email: adminUser.email,
          name: adminUser.name,
          role: adminUser.role
        }
      });
    }

  } catch (error) {
    console.error('Error setting up test admin:', error);
    return NextResponse.json(
      { error: 'Failed to setup test admin user' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Only allow in test/development environment
  if (!isTestEnvironment) {
    return NextResponse.json(
      { error: 'This endpoint is only available in test environment' },
      { status: 403 }
    );
  }

  try {
    await connectDB();
    
    const adminUsers = await User.find({ role: 'admin' }).select('-password');
    
    return NextResponse.json({
      success: true,
      adminUsers: adminUsers.map(user => ({
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt
      }))
    });

  } catch (error) {
    console.error('Error fetching admin users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin users' },
      { status: 500 }
    );
  }
}
