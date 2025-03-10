import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // This would normally check a JWT or session cookie
  // For this simple example, we'll redirect based on a client-side check
  // Note: In a production app, use server-side authentication instead
  
  // Skip middleware for login page and API routes
  if (request.nextUrl.pathname.startsWith('/login') || 
      request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // For demonstration purposes only - in real apps, check auth on the server
  // We'll redirect from the client side for this example
  return NextResponse.next();
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