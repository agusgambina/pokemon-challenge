import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRATION } from '@/lib/config';
import { findUserByUsername, verifyPassword } from '@/lib/services/userService';

// Set runtime to Node.js to support the crypto module used by jsonwebtoken
export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json();
    const { username, password } = body;

    // Validate required fields
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Find user in database
    const user = await findUserByUsername(username);

    // Check if user exists
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }
    
    // Verify password
    const isValidPassword = await verifyPassword(password, user.password);

    console.log('isValidPassword', isValidPassword);
    
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        username: user.username,
        userId: user.id
        // Add any additional user data you want in the token
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRATION }
    );

    // Return success response with token
    return NextResponse.json(
      { 
        success: true,
        token,
        user: { 
          username: user.username,
          id: user.id 
        }
      },
      { 
        status: 200,
        headers: {
          'Set-Cookie': `token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${60 * 60 * 24}` // 24 hours
        }
      }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 