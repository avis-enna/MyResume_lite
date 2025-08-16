import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = NextResponse.json({ 
      message: 'Cookies cleared successfully',
      cleared: ['admin_token', 'auth-token', 'admin-session']
    });

    // Clear all admin-related cookies
    response.cookies.set('admin_token', '', { 
      httpOnly: true, 
      path: '/', 
      maxAge: 0,
      expires: new Date(0)
    });
    
    response.cookies.set('auth-token', '', { 
      httpOnly: true, 
      path: '/', 
      maxAge: 0,
      expires: new Date(0)
    });
    
    response.cookies.set('admin-session', '', { 
      httpOnly: true, 
      path: '/', 
      maxAge: 0,
      expires: new Date(0)
    });

    return response;
  } catch (error) {
    console.error('Clear cookies error:', error);
    return NextResponse.json({ error: 'Failed to clear cookies' }, { status: 500 });
  }
}
