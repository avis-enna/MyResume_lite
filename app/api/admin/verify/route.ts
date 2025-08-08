import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getCollection } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    console.log('MongoDB Verify: Starting authentication check');
    
    const cookieStore = await cookies();
    
    // Try JWT token first
    const authToken = cookieStore.get('auth-token');
    if (authToken) {
      console.log('MongoDB Verify: Found JWT token, verifying...');
      
      const decoded = verifyToken(authToken.value);
      if (decoded) {
        console.log('MongoDB Verify: JWT token valid for user:', decoded.username);
        
        // Verify user still exists and is active in MongoDB
        try {
          const usersCollection = await getCollection('users');
          const user = await usersCollection.findOne({ 
            _id: { $oid: decoded.userId }
          });
          
          if (user && user.isActive) {
            console.log('MongoDB Verify: User verified in database');
            return NextResponse.json({
              authenticated: true,
              user: {
                id: user._id,
                username: user.username,
                email: user.email,
                name: user.name,
                role: user.role
              }
            });
          }
        } catch (dbError) {
          console.log('MongoDB Verify: Database check failed, but JWT is valid');
          return NextResponse.json({
            authenticated: true,
            user: {
              username: decoded.username,
              role: decoded.role
            }
          });
        }
      }
    }
    
    // Fallback to session token
    const sessionToken = cookieStore.get('admin-session');
    if (sessionToken) {
      console.log('MongoDB Verify: Found session token, verifying...');
      
      try {
        const decoded = Buffer.from(sessionToken.value, 'base64').toString();
        const [username, timestamp] = decoded.split(':');
        
        // Check if session is not too old (7 days)
        const sessionAge = Date.now() - parseInt(timestamp);
        const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
        
        if (sessionAge < maxAge) {
          console.log('MongoDB Verify: Session token valid for user:', username);
          return NextResponse.json({
            authenticated: true,
            user: { username }
          });
        } else {
          console.log('MongoDB Verify: Session token expired');
        }
      } catch (sessionError) {
        console.log('MongoDB Verify: Invalid session token');
      }
    }

    console.log('MongoDB Verify: No valid authentication found');
    return NextResponse.json({
      authenticated: false
    });

  } catch (error) {
    console.error('MongoDB Verify: Verification error:', error);
    return NextResponse.json({
      authenticated: false
    });
  }
}
