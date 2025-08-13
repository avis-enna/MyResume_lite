import { NextResponse } from 'next/server';
import { getSessionUser } from '@/app/lib/admin-auth';

export async function GET() {
  try {
    const user = await getSessionUser();
    if (user && user.role === 'admin') {
      return NextResponse.json({ authenticated: true, user });
    }
    return NextResponse.json({ authenticated: false }, { status: 401 });
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json({ authenticated: false, error: 'Internal error' }, { status: 500 });
  }
}
