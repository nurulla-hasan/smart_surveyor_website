import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';

/**
 * Next.js 16 Proxy Function
 * Replaces the deprecated 'middleware' convention.
 * Runs on the Node.js runtime by default.
 */
export async function proxy(request: NextRequest) {
  const { pathname, search, origin } = request.nextUrl;

  // 1. API PROXY (Backend For Frontend)
  // Rewriting /api requests to the actual backend server
  if (pathname.startsWith('/api')) {
    const backendBase = process.env.NEXT_PUBLIC_BASE_API || 'http://localhost:5000/api/v1';
    
    // Construct the new URL by stripping '/api' and prepending the backend base
    const targetPath = pathname.replace(/^\/api/, '');
    const backendUrl = new URL(`${backendBase}${targetPath}${search}`);

    return NextResponse.rewrite(backendUrl);
  }

  // 2. AUTHENTICATION & REDIRECTS
  let accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;
  
  // Define protected & auth-only routes
  const protectedPaths = ['/dashboard', '/bookings', '/clients', '/reports', '/calculator', '/maps', '/settings'];
  const isProtectedRoute = protectedPaths.some(path => pathname.startsWith(path));
  const isAuthPage = pathname === '/auth/login' || pathname === '/auth/register';

  let response = NextResponse.next();

  // --- TOKEN REFRESH LOGIC ---
  if (accessToken) {
    try {
      const decoded: { exp: number } = jwtDecode(accessToken);
      const currentTime = Math.floor(Date.now() / 1000);
      
      // If token is expired or about to expire in 30 seconds
      if (decoded.exp < currentTime + 30) {
        if (refreshToken) {
          const backendBase = process.env.NEXT_PUBLIC_BASE_API || 'http://localhost:5000/api/v1';
          const refreshRes = await fetch(`${backendBase}/auth/refresh-token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
          });

          if (refreshRes.ok) {
            const data = await refreshRes.json();
            const newAccessToken = data?.data?.accessToken;
            
            if (newAccessToken) {
              accessToken = newAccessToken;
              // Set the new access token in cookies for the response
              response.cookies.set('accessToken', newAccessToken, {
                httpOnly: false, // Accessible by client if needed
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
              });
            }
          } else {
            // Refresh token failed, clear cookies and redirect to login
            response = NextResponse.redirect(new URL('/auth/login', origin));
            response.cookies.delete('accessToken');
            response.cookies.delete('refreshToken');
            return response;
          }
        } else {
          // No refresh token but access token expired
          accessToken = undefined;
        }
      }
    } catch {
      accessToken = undefined;
    }
  }

  // Redirect to login if accessing protected route without valid token
  if (isProtectedRoute && !accessToken) {
    const loginUrl = new URL('/auth/login', origin);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to dashboard if logged-in user tries to access auth pages
  if (isAuthPage && accessToken) {
    try {
      // Additional verification for accessToken if needed
      const decoded = jwtDecode<{ exp: number }>(accessToken);
      if (decoded && decoded.exp * 1000 > Date.now()) {
        return NextResponse.redirect(new URL('/dashboard', origin));
      }
    } catch {
      // If token is invalid, let them access the auth page but maybe clear the cookie
      const loginResponse = NextResponse.next();
      loginResponse.cookies.delete('accessToken');
      return loginResponse;
    }
  }

  return response;
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
