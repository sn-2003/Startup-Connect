import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, handleApiError } from '@/lib/middleware';

export const GET = withAuth(async (req: NextRequest) => {
  try {
    const user = (req as any).user;

    const savedJobs = await prisma.savedJob.findMany({
      where: {
        userId: user.id,
        job: {
          listed: true, // Only return saved jobs that are still listed
        },
      },
      include: {
        job: {
          include: {
            startup: {
              select: {
                id: true,
                name: true,
                logo: true,
                linkedinUrl: true,
                instagramUrl: true,
                xUrl: true,
              },
            },
            customQuestions: {
              orderBy: {
                order: 'asc',
              },
            },
            applications: {
              select: {
                id: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform data to match frontend expectations
    const transformedJobs = savedJobs.map(savedJob => ({
      ...savedJob.job,
      startupName: savedJob.job.startup.name,
      applications: savedJob.job.applications.length,
    }));

    return NextResponse.json({ data: transformedJobs });
  } catch (error) {
    return handleApiError(error);
  }
});