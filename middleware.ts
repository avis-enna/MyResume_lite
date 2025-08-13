import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Admin routes that require authentication
const ADMIN_ROUTES = [
  '/admin/dashboard',
  '/admin/about',
  '/admin/contact',
  '/admin/skills',
  '/admin/experience',
  '/admin/projects',
  '/admin/blog',
  '/admin/contacts',
];

// API routes that require authentication
const ADMIN_API_ROUTES = [
  '/api/admin/about',
  '/api/admin/contact',
  '/api/admin/skills',
  '/api/admin/experience',
  '/api/admin/projects',
  '/api/admin/blog',
  '/api/admin/contacts',
];

// Routes that should redirect to dashboard if already authenticated
const AUTH_ROUTES = ['/admin'];

// Simple token verification without JWT (edge runtime compatible)
function verifyToken(token: string): boolean {
  // For edge runtime compatibility, we'll use a simple token format
  // In production, this should be replaced with a proper JWT verification
  // that doesn't rely on Node.js APIs

  try {
    // Simple base64 encoded token format: base64(role:timestamp:signature)
    const decoded = Buffer.from(token, 'base64').toString();
    const [role, timestamp, signature] = decoded.split(':');

    if (role !== 'admin') return false;

    // Check if token is not expired (24 hours)
    const tokenAge = Date.now() - Number(timestamp);
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours

    if (tokenAge > maxAge) return false;

    // Simple signature verification (in production, use proper HMAC)
    const expectedSignature = Buffer.from(`${role}:${timestamp}:admin-secret`).toString('base64');
    return signature === expectedSignature;
  } catch {
    return false;
  }
}

function isAuthenticated(request: NextRequest): boolean {
  // Check for JWT token in cookies
  const adminToken = request.cookies.get('admin_token')?.value;
  if (adminToken && verifyToken(adminToken)) {
    return true;
  }

  // Check for legacy auth token
  const legacyToken = request.cookies.get('auth-token')?.value;
  if (legacyToken && verifyToken(legacyToken)) {
    return true;
  }

  // Check for dev session (only in development)
  if (process.env.NODE_ENV !== 'production') {
    const devSession = request.cookies.get('admin-session')?.value;
    if (devSession) {
      try {
        const decoded = Buffer.from(devSession, 'base64').toString();
        const [username, timestamp] = decoded.split(':');
        const tokenAge = Date.now() - Number(timestamp);
        const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
        
        if (username === 'admin' && tokenAge < maxAge) {
          return true;
        }
      } catch {
        // Invalid dev session
      }
    }
  }

  return false;
}

function isAdminRoute(pathname: string): boolean {
  return ADMIN_ROUTES.some(route => pathname.startsWith(route)) ||
         !!pathname.match(/^\/admin\/[^\/]+\/[^\/]+/) || // Dynamic admin routes like /admin/projects/[id]
         !!pathname.match(/^\/admin\/[^\/]+\/new/) ||    // New item routes
         !!pathname.match(/^\/admin\/[^\/]+\/\d+\/edit/); // Edit routes
}

function isAdminApiRoute(pathname: string): boolean {
  return ADMIN_API_ROUTES.some(route => pathname.startsWith(route)) ||
         !!pathname.match(/^\/api\/admin\/[^\/]+\/[^\/]+/); // Dynamic API routes
}

function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.includes(pathname);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuth = isAuthenticated(request);

  // Handle admin routes
  if (isAdminRoute(pathname)) {
    if (!isAuth) {
      // Redirect to admin login
      const loginUrl = new URL('/admin', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    // Allow access to admin routes
    return NextResponse.next();
  }

  // Handle admin API routes
  if (isAdminApiRoute(pathname)) {
    if (!isAuth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    // Allow access to admin API routes
    return NextResponse.next();
  }

  // Handle auth routes (redirect if already authenticated)
  if (isAuthRoute(pathname) && isAuth) {
    const redirectTo = request.nextUrl.searchParams.get('redirect') || '/admin/dashboard';
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  // Allow all other routes
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (authentication endpoints)
     * - api/contact (public contact form)
     * - api/experience (public experience data)
     * - api/version (public version info)
     * - api/network (public network tools)
     * - api/system (public system info)
     * - api/ping (public ping)
     * - api/projects-data (public projects)
     * - api/github-data (public github data)
     * - api/analytics (public analytics)
     * - api/directory-listing (public directory)
     * - api/file-content (public file content)
     * - api/project-tree (public project tree)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api/auth|api/contact|api/experience|api/version|api/network|api/system|api/ping|api/projects-data|api/github-data|api/analytics|api/directory-listing|api/file-content|api/project-tree|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
