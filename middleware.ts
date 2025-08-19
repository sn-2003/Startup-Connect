import { NextResponse, type NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const ALLOWED_ORIGIN = process.env.NEXT_PUBLIC_ALLOWED_ORIGIN || 'http://localhost:3000';

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/login',
  '/register',
  '/hackathons',
  '/api/auth',
  '/api/brevo',
  '/api/discover-startups',
  '/discover-startups',
  '/api/startups',  
  '/api/jobs',
  '/jobs',
  '/api/news',
  '/news',
  '/api/reels/feed',
  '/_next',
  '/favicon.ico',
  '/forgot-password',
  '/reset-password',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/dashboard', // Allow access to dashboard for first-time login redirection
];

// Define the admin email (you might want to move this to an environment variable)
const ADMIN_EMAIL = 'nikhil.s@startupgram.in';

// Paths that are completely public
const isPublicPath = (path: string) => {
  return publicRoutes.some(route => 
    path === route || 
    path.startsWith(`${route}/`) ||
    path.startsWith('/_next') ||
    path.startsWith('/api/auth/') ||
    path.startsWith('/api/public/') ||
    path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)
  );
};

export async function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;
  
  // Handle CORS preflight requests
  if (request.method === 'OPTIONS') {
    return handleCorsPreflight(request);
  }
  
  // Skip middleware for public paths
  if (isPublicPath(pathname)) {
    return handlePublicPath(request);
  }

  // Get the session token
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  });

  // For admin routes, check admin access
  if (pathname.startsWith('/admin')) {
    // Redirect to login if not authenticated
    if (!token) {
      return redirectToLogin(pathname, origin);
    }

    // Check if user is admin
    if (token.email !== ADMIN_EMAIL) {
      return new NextResponse('Forbidden', { status: 403 });
    }
  }
  
  // For all other protected routes, just check authentication
  if (!token) {
    return redirectToLogin(pathname, origin);
  }

  // Continue with the request and add security headers
  return addSecurityHeaders(request, NextResponse.next());
}

// Helper function to handle CORS preflight requests
// Helper function to handle CORS preflight requests
function handleCorsPreflight(request: NextRequest) {
  const response = new NextResponse(null, { status: 204 });
  response.headers.set('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Max-Age', '86400'); // 24 hours
  return response;
}

// Helper function to handle public paths
// Helper function to handle public paths
function handlePublicPath(request: NextRequest) {
  // For public paths, we still want to apply security headers
  const response = addSecurityHeaders(request, NextResponse.next());
  return response;
}

// Helper function to redirect to login
function redirectToLogin(pathname: string, origin: string) {
  const loginUrl = new URL('/login', origin);
  loginUrl.searchParams.set('callbackUrl', pathname);
  return NextResponse.redirect(loginUrl);
}

// Helper function to add security headers
function addSecurityHeaders(request: NextRequest, response: NextResponse) {
  // Add CORS headers
  addCorsHeaders(request, response);

  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // CSP Header - adjust according to your needs
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.instagram.com https://*.instagram.com",
    "style-src 'self' 'unsafe-inline' https://*.instagram.com",
    "img-src * data: blob: https://*.fna.fbcdn.net",
    "font-src 'self' https://*.instagram.com",
    "connect-src 'self' https://*.instagram.com https://*.cdninstagram.com https://*.fna.fbcdn.net",
    "frame-src 'self' https://*.instagram.com https://*.cdninstagram.com https://www.instagram.com https://ieudhbmxouyclzkzecrw.supabase.co",
    "media-src 'self' https://*.instagram.com https://*.cdninstagram.com",
    "frame-ancestors 'self' https://*.instagram.com",
  ].join('; ');

  response.headers.set('Content-Security-Policy', csp);
  
  return response;
}

// Helper function to add CORS headers
function addCorsHeaders(request: NextRequest, response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  return response;
}

export const config = {
  matcher: [
    // Run on all routes except static files and public assets
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js|woff|woff2|ttf|eot)$).*)',
  ],
};