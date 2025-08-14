import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/app/lib/admin-auth';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    // Debug: Log all cookies
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    console.log('[SESSION-CHECK] All cookies:', allCookies.map(c => ({ name: c.name, hasValue: !!c.value })));

    const user = await getSessionUser();
    console.log('[SESSION-CHECK] User from session:', user ? { role: user.role, username: user.username } : 'null');

    if (user && user.role === 'admin') {
      return NextResponse.json({ authenticated: true, user });
    }

    console.log('[SESSION-CHECK] Authentication failed - no valid admin user');
    return NextResponse.json({ authenticated: false }, { status: 401 });
  } catch (error) {
    console.error('[SESSION-CHECK] Session check error:', error);
    return NextResponse.json({ authenticated: false, error: 'Internal error' }, { status: 500 });
  }
}
