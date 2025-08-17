import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/app/lib/mongodb';
import User from '@/app/models/User';
import { getSignSecret } from '@/app/lib/admin-auth';
import { MetricsTracker } from '@/app/lib/metrics';

// Rate limiting storage (in production, use Redis)
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes

// Test environment detection
const isTestEnvironment = process.env.NODE_ENV === 'test' ||
                         process.env.PLAYWRIGHT_TEST === '1' ||
                         process.env.CI === 'true';

function isRateLimited(ip: string): boolean {
  // Skip rate limiting in test environment
  if (isTestEnvironment) {
    return false;
  }

  const attempts = loginAttempts.get(ip);
  if (!attempts) return false;

  if (Date.now() - attempts.lastAttempt > LOCKOUT_TIME) {
    loginAttempts.delete(ip);
    return false;
  }

  return attempts.count >= MAX_ATTEMPTS;
}

function recordLoginAttempt(ip: string, success: boolean) {
  // Skip recording in test environment
  if (isTestEnvironment) {
    return;
  }

  if (success) {
    loginAttempts.delete(ip);
    return;
  }

  const attempts = loginAttempts.get(ip) || { count: 0, lastAttempt: 0 };
  attempts.count++;
  attempts.lastAttempt = Date.now();
  loginAttempts.set(ip, attempts);
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

  try {
    // Rate limiting check
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      );
    }

    const { email, username, password } = await request.json();
    const userIdentifier = (email || username || '').toString().trim().toLowerCase();

    // Input validation
    if (!userIdentifier || !password) {
      recordLoginAttempt(ip, false);
      return NextResponse.json(
        { error: 'Email/Username and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      recordLoginAttempt(ip, false);
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Connect to database
    await connectDB();

    // Find user by email
    const user = await User.findOne({
      email: userIdentifier,
      role: 'admin'
    });

    if (!user) {
      if (isTestEnvironment) {
        console.log(`[TEST] Admin user not found: ${userIdentifier}`);
        console.log(`[TEST] Available users:`, await User.find({}).select('email role'));
      }
      recordLoginAttempt(ip, false);
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check if account is locked
    if (user.isLocked) {
      recordLoginAttempt(ip, false);
      return NextResponse.json(
        { error: 'Account is temporarily locked. Please try again later.' },
        { status: 423 }
      );
    }

    // Verify password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      // Increment failed login attempts
      user.loginAttempts++;
      if (user.loginAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
      }
      await user.save();

      recordLoginAttempt(ip, false);
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Successful login - reset attempts and update last login
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    user.lastLogin = new Date();
    await user.save();

    recordLoginAttempt(ip, true);

    // Get JWT secret
    let secret: string;
    try {
      secret = getSignSecret();
    } catch (error) {
      console.error('Failed to get signing secret:', error);
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        sub: user._id.toString(),
        userId: user._id.toString(),
        username: user.name,
        role: user.role,
        email: user.email,
        iat: Math.floor(Date.now() / 1000)
      },
      secret,
      { expiresIn: '7d' }
    );

    const response = NextResponse.json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin
      }
    });
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    // Clear legacy cookie if present
    response.cookies.set('auth-token', '', { httpOnly: true, path: '/', maxAge: 0 });

    // Track metrics
    await MetricsTracker.adminLogin(request);

    return response;
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
