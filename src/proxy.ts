import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js 16 Proxy Function
 * Replaces the deprecated 'middleware' convention.
 * Runs on the Node.js runtime by default.
 */
export function proxy(request: NextRequest) {
  const { pathname, search, origin } = request.nextUrl;

  // 1. API PROXY (Backend For Frontend)
  // Rewriting /api requests to the actual backend server
  if (pathname.startsWith('/api')) {
    const backendBase = process.env.NEXT_PUBLIC_BASE_API || 'http://localhost:5000/api/V1';
    
    // Construct the new URL by stripping '/api' and prepending the backend base
    const targetPath = pathname.replace(/^\/api/, '');
    const backendUrl = new URL(`${backendBase}${targetPath}${search}`);

    return NextResponse.rewrite(backendUrl);
  }

  // 2. AUTHENTICATION & REDIRECTS
  const accessToken = request.cookies.get('accessToken')?.value;
  
  // Define protected & auth-only routes
  const protectedPaths = ['/dashboard', '/bookings', '/clients', '/reports', '/calculator'];
  const isProtectedRoute = protectedPaths.some(path => pathname.startsWith(path));
  const isAuthPage = pathname === '/auth/login' || pathname === '/auth/register';

  // Redirect to login if accessing protected route without token
  if (isProtectedRoute && !accessToken) {
    const loginUrl = new URL('/auth/login', origin);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to dashboard if logged-in user tries to access auth pages
  if (isAuthPage && accessToken) {
    return NextResponse.redirect(new URL('/dashboard', origin));
  }

  return NextResponse.next();
}

/**
 * Proxy Configuration
 * Matcher defines which paths should trigger the proxy function.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder assets
     */
    '/((?!_next/static|_next/image|favicon.ico|public|assets).*)',
  ],
};
