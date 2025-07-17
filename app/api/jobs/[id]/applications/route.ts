import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, handleApiError } from '@/lib/middleware';

export const GET = withAuth(async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const user = (req as any).user;
    const { id: jobId } = params;

    // Check if user owns the startup that posted this job
    const job = await prisma.job.findFirst({
      where: {
        id: jobId,
        startup: {
          userId: user.id,
        },
      },
    });

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found or access denied' },
        { status: 404 }
      );
    }

    const applications = await prisma.application.findMany({
      where: {
        jobId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            resume: {
              include: {
                experience: {
                  orderBy: {
                    order: 'asc',
                  },
                },
                education: {
                  orderBy: {
                    order: 'asc',
                  },
                },
                customSections: {
                  orderBy: {
                    order: 'asc',
                  },
                },
              },
            },
          },
        },
        job: {
          include: {
            startup: {
              select: {
                name: true,
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