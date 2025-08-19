import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, handleApiError } from '@/lib/middleware';

export const GET = withAuth(async (req: NextRequest) => {
  try {
    const user = (req as any).user;

    const startups = await prisma.startup.findMany({
      where: {
        userId: user.id,
      },
      include: {
        jobs: {
          select: {
            id: true,
            title: true,
            applications: {
              select: {
                id: true,
              },
            },
          },
        },
        votes: true,
        feedback: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ data: startups });
  } catch (error) {
    return handleApiError(error);
  }
});