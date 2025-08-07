import { cookies } from 'next/headers';

// Failsafe authentication with multiple fallbacks
export async function checkAdminAuth(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('admin-session');

    if (!sessionToken) {
      console.log('No session token found');
      return false;
    }

    // Decode and validate token
    const decoded = Buffer.from(sessionToken.value, 'base64').toString();
    const [username, timestamp] = decoded.split(':');

    // Check if token is valid and not expired (30 days for better UX)
    const tokenAge = Date.now() - parseInt(timestamp);
    const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

    const isValid = username === 'admin' && tokenAge < maxAge;
    console.log('Auth check:', { username, tokenAge: tokenAge / (1000 * 60 * 60), maxAgeHours: maxAge / (1000 * 60 * 60), isValid });

    return isValid;
  } catch (error) {
    console.error('Auth check error:', error);
    return false;
  }
}

// Simplified auth for development - can be disabled in production
export async function checkAdminAuthSimple(): Promise<boolean> {
  // For development, allow bypass if no session exists but credentials are correct
  if (process.env.NODE_ENV === 'development') {
    console.log('Development mode: simplified auth check');
    return true; // Allow all requests in development
  }
  return checkAdminAuth();
}

export async function requireAuth() {
  const isAuthenticated = await checkAdminAuth();
  if (!isAuthenticated) {
    console.error('Authentication failed in requireAuth');
    throw new Error('Unauthorized');
  }
}

export async function requireAuthSimple() {
  const isAuthenticated = await checkAdminAuthSimple();
  if (!isAuthenticated) {
    console.error('Authentication failed in requireAuthSimple');
    throw new Error('Unauthorized');
  }
}
