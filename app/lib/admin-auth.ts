import { cookies } from 'next/headers';

export function checkAdminAuth(): boolean {
  try {
    const cookieStore = cookies();
    const sessionToken = cookieStore.get('admin-session');
    
    if (!sessionToken) {
      return false;
    }

    // Decode and validate token
    const decoded = Buffer.from(sessionToken.value, 'base64').toString();
    const [username, timestamp] = decoded.split(':');
    
    // Check if token is valid and not expired (7 days)
    const tokenAge = Date.now() - parseInt(timestamp);
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
    
    return username === 'admin' && tokenAge < maxAge;
  } catch (error) {
    console.error('Auth check error:', error);
    return false;
  }
}

export function requireAuth() {
  if (!checkAdminAuth()) {
    throw new Error('Unauthorized');
  }
}
