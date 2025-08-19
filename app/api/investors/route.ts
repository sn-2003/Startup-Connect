import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/middleware';

export async function GET() {
  try {
    const investors = await prisma.investor.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ data: investors }, {
      headers: {
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=60'
      }
    });
  } catch (error) {
    return handleApiError(error);
  }
}