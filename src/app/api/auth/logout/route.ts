import { NextResponse } from 'next/server';

// Set runtime to Node.js for consistency with other auth routes
export const runtime = 'nodejs';

export async function POST() {
  try {
    // Clear the auth token by setting an expired cookie
    return NextResponse.json(
      { success: true },
      {
        status: 200,
        headers: {
          'Set-Cookie': `token=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`
        }
      }
    );
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 