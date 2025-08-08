import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'portfolio-admin-super-secret-jwt-key-2024';

export interface UserPayload {
  userId: string;
  email: string;
  role: string;
  name: string;
  username: string;
}

export function generateToken(payload: UserPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): UserPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as UserPayload;
    return decoded;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    console.error('Password verification failed:', error);
    return false;
  }
}
