import { NextRequest, NextResponse } from 'next/server';

// Set your production domain here
const ALLOWED_ORIGIN = 'https://startup-connect-omega.vercel.app'; // <-- CHANGE THIS TO YOUR DOMAIN

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // --- Security Headers ---
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('Content-Security-Policy',
    [
      "default-src 'self'",
      "img-src 'self' data: https://images.pexels.com",
      "script-src 'self' 'unsafe-inline'", // 'unsafe-eval' REMOVED for production
      "style-src 'self' 'unsafe-inline'",
      "font-src 'self' data:",
      "connect-src 'self'",
      "frame-ancestors 'self'",
    ].join('; ')
  );

  // --- CORS Protection ---
  const origin = request.headers.get('origin');
  if (origin === ALLOWED_ORIGIN) {
    response.headers.set('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
    response.headers.set('Vary', 'Origin');
    response.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }

  // --- HTTPS Enforcement ---
  const isLocalhost = request.nextUrl.hostname === 'localhost' || request.nextUrl.hostname === '127.0.0.1';
  if (
    !isLocalhost &&
    request.nextUrl.protocol === 'http:' &&
    request.headers.get('x-forwarded-proto') !== 'https'
  ) {
    const url = request.nextUrl.clone();
    url.protocol = 'https:';
    return NextResponse.redirect(url, 308);
  }

  // Handle preflight requests for CORS
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { status: 204, headers: response.headers });
  }

  return response;
}

export const config = {
  matcher: '/:path*',
}; 