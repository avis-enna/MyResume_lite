import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

function getSignSecret(): string {
  return (
    process.env.AUTH_SECRET ||
    process.env.JWT_SECRET ||
    process.env.ADMIN_SECRET_KEY ||
    (process.env.NODE_ENV !== 'production' ? 'dev-temp-secret-please-set-AUTH_SECRET' : '')
  );
}

export async function POST(request: NextRequest) {
  try {
    const { email, username, password } = await request.json();

    const adminUser = process.env.ADMIN_USERNAME || 'admin@admin.com';
    const adminPass = process.env.ADMIN_PASSWORD || 'admin@admin.com';

    const userId = (email || username || '').toString().trim();

    if (!userId || !password) {
      return NextResponse.json({ error: 'Email/Username and password are required' }, { status: 400 });
    }

    if (userId !== adminUser || password !== adminPass) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const secret = getSignSecret();
    if (!secret) {
      return NextResponse.json({ error: 'Server misconfiguration: missing AUTH secret' }, { status: 500 });
    }

    const token = jwt.sign(
      {
        sub: 'admin',
        username: adminUser,
        role: 'admin',
        email: adminUser,
      },
      secret,
      { expiresIn: '7d' }
    );

    const response = NextResponse.json({ message: 'Login successful', user: { username: adminUser, role: 'admin' } });
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    // Clear legacy cookie if present
    response.cookies.set('auth-token', '', { httpOnly: true, path: '/', maxAge: 0 });

    return response;
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
