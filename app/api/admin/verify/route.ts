import { NextResponse } from 'next/server';
import { checkAdminAuth } from '@/app/lib/admin-auth';

export async function GET() {
  try {
    const isAuthenticated = checkAdminAuth();
    
    return NextResponse.json({ 
      authenticated: isAuthenticated 
    });
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json({ 
      authenticated: false 
    });
  }
}
