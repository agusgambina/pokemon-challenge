import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@/lib/config';

// Set runtime to Node.js to support the crypto module used by jsonwebtoken
export const runtime = 'nodejs';

export async function GET() {
  try {
    // Get the token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { user: null },
        { status: 401 }
      );
    }

    try {
      // Verify and decode the JWT token
      const decoded = jwt.verify(token, JWT_SECRET) as { username: string };
      
      // Return the user data
      return NextResponse.json(
        { 
          user: { 
            username: decoded.username
          } 
        },
        { status: 200 }
      );
    } catch (jwtError) {
      // Invalid token
      console.error('JWT verification error:', jwtError);
      return NextResponse.json(
        { user: null },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 