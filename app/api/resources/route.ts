import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError, rateLimit } from '@/lib/middleware';

export async function GET() {
  // Rate limit resource requests
  // Note: No req param, so skip for now
  try {
    const resources = await prisma.resource.findMany({
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return NextResponse.json({ data: resources }, {
      headers: {
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=60'
      }
    });
  } catch (error) {
    return handleApiError(error);
  }
}