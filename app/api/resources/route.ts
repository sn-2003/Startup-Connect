import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/middleware';

export async function GET() {
  try {
    const resources = await prisma.resource.findMany({
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return NextResponse.json({ data: resources });
  } catch (error) {
    return handleApiError(error);
  }
}