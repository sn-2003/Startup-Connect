import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-options';
import { RateLimiterMemory } from 'rate-limiter-flexible';

export function withAuth(handler: Function) {
  return async (req: NextRequest, ...args: any[]) => {
    try {
      // Use NextAuth's getServerSession to check authentication
      const session = await getServerSession(authOptions);
      if (!session || !session.user) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }
      // Attach user to request for downstream handlers
      (req as any).user = session.user;
      return handler(req, ...args);
    } catch (error) {
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      );
    }
  };
}

export function handleApiError(error: any) {
  console.error('API Error:', error);
  
  if (error.code === 'P2002') {
    return NextResponse.json(
      { error: 'A record with this information already exists' },
      { status: 409 }
    );
  }
  
  if (error.code === 'P2025') {
    return NextResponse.json(
      { error: 'Record not found' },
      { status: 404 }
    );
  }
  
  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
}

// --- Rate Limiter Utility ---
// 5 requests per minute per IP (customize as needed)
export const apiRateLimiter = new RateLimiterMemory({
  points: 5, // Number of points
  duration: 60, // Per 60 seconds
});

// Helper to use in API routes
export async function rateLimit(request: NextRequest, limiter = apiRateLimiter) {
  const ip = request.headers.get('x-forwarded-for') || request.ip || 'unknown';
  try {
    await limiter.consume(ip);
    return null; // No error, proceed
  } catch {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }
}