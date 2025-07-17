import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, handleApiError } from '@/lib/middleware';

export const GET = withAuth(async (req: NextRequest) => {
  try {
    const user = (req as any).user;

    const applications = await prisma.application.findMany({
      where: {
        userId: user.id,
      },
      include: {
        job: {
          include: {
            startup: {
              select: {
                name: true,
                logo: true,
              },
            },
            customQuestions: {
              orderBy: {
                order: 'asc',
              },
            },
          },
        },
        customAnswers: {
          include: {
            question: true,
          },
          orderBy: {
            question: {
              order: 'asc',
            },
          },
        },
      },
      orderBy: {
        appliedAt: 'desc',
      },
    });

    return NextResponse.json({ data: applications });
  } catch (error) {
    return handleApiError(error);
  }
});