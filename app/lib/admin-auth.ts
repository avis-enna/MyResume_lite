import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

// Primary and legacy cookie names
const COOKIE_NAME = 'admin_token';
const LEGACY_USER_COOKIE = 'auth-token'; // used by some legacy routes
const DEV_COOKIE = 'admin-session'; // dev-only fallback (base64)

export interface AdminTokenPayload {
  sub?: string;
  username?: string;
  role?: string;
  name?: string;
  // legacy fields
  userId?: string;
  email?: string;
  iat?: number;
  exp?: number;
}

function getSecrets(): string[] {
  const secrets: string[] = [];
  if (process.env.AUTH_SECRET) secrets.push(process.env.AUTH_SECRET);
  if (process.env.JWT_SECRET) secrets.push(process.env.JWT_SECRET);
  if (process.env.ADMIN_SECRET_KEY) secrets.push(process.env.ADMIN_SECRET_KEY);
  // Dev fallback last
  if (process.env.NODE_ENV !== 'production') {
    secrets.push('dev-temp-secret-please-set-AUTH_SECRET');
  }
  return secrets;
}

function verifyWithSecrets(token: string): AdminTokenPayload | null {
  const secrets = getSecrets();
  for (const s of secrets) {
    try {
      return jwt.verify(token, s) as AdminTokenPayload;
    } catch {
      // try next
    }
  }
  return null;
}

function normalizeUser(p: AdminTokenPayload | null): AdminTokenPayload | null {
  if (!p) return null;
  // Ensure role and username have sane values
  const role = p.role || (p.email === 'admin@admin.com' ? 'admin' : undefined);
  const username = p.username || p.email || 'admin';
  return { ...p, role, username };
}

export async function getSessionUser(): Promise<AdminTokenPayload | null> {
  try {
    const cookieStore = await cookies();

    // 1) Preferred: admin_token (JWT)
    const adminJwt = cookieStore.get(COOKIE_NAME)?.value;
    if (adminJwt) {
      const decoded = verifyWithSecrets(adminJwt);
      return normalizeUser(decoded);
    }

    // 2) Legacy: auth-token (JWT used by older routes)
    const legacyJwt = cookieStore.get(LEGACY_USER_COOKIE)?.value;
    if (legacyJwt) {
      const decoded = verifyWithSecrets(legacyJwt);
      return normalizeUser(decoded);
    }

    // 3) Dev-only fallback: admin-session (base64 "username:timestamp")
    const devCookie = cookieStore.get(DEV_COOKIE)?.value;
    if (devCookie && process.env.NODE_ENV !== 'production') {
      try {
        const decoded = Buffer.from(devCookie, 'base64').toString();
        const [username, ts] = decoded.split(':');
        const tokenAge = Date.now() - Number(ts);
        const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
        if (username === 'admin' && tokenAge < maxAge) {
          return { username: 'admin', role: 'admin', sub: 'admin' };
        }
      } catch {
        // ignore
      }
    }

    return null;
  } catch (error) {
    console.error('[admin-auth] getSessionUser error:', error);
    return null;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const user = await getSessionUser();
  return !!(user && user.role === 'admin');
}

export async function requireAuth() {
  const user = await getSessionUser();
  if (!user || user.role !== 'admin') {
    throw new Error('Unauthorized');
  }
}

export function getSignSecret(): string {
  const secrets = getSecrets();
  if (secrets.length === 0) {
    throw new Error('No signing secret available');
  }
  return secrets[0];
}

export const AdminAuth = {
  COOKIE_NAME,
  LEGACY_USER_COOKIE,
  DEV_COOKIE,
  getSessionUser,
  isAuthenticated,
  requireAuth,
  getSignSecret,
};
