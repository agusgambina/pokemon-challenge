import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { JWT_SECRET } from './lib/config';
import * as jose from 'jose';

export async function middleware(request: NextRequest) {
  // Skip middleware for login page, public assets, and API routes
  if (
    request.nextUrl.pathname.startsWith('/login') ||
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname.startsWith('/favicon.ico') ||
    request.nextUrl.pathname.endsWith('.svg') ||  // Allow SVG files
    request.nextUrl.pathname === '/pokemon_logo.svg'  // Specifically allow the Pokemon logo
  ) {
    return NextResponse.next();
  }

  try {
    // Get auth token from cookies
    const token = request.cookies.get('token')?.value;

    // If no token exists, redirect to login
    if (!token) {
      const url = new URL('/login', request.url);
      return NextResponse.redirect(url);
    }

    // For middleware, we'll need to use jose instead of jsonwebtoken
    // since middleware runs in the Edge Runtime which doesn't support
    // Node.js crypto module that jsonwebtoken depends on
    try {
      // We'll just check if the JWT is valid, not extracting the payload here
      // This is a simple verification that the token is properly signed
      // Convert string to Uint8Array for jose
      const secretKey = new TextEncoder().encode(JWT_SECRET);
      await jose.jwtVerify(token, secretKey);
      
      // Token is valid, continue
      return NextResponse.next();
    } catch (jwtError) {
      // Token is invalid, redirect to login
      console.error('Invalid token:', jwtError);
      const url = new URL('/login', request.url);
      return NextResponse.redirect(url);
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    // On error, redirect to login as a fallback
    const url = new URL('/login', request.url);
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public directory
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 