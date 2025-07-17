import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, handleApiError } from '@/lib/middleware';

export const GET = withAuth(async (req: NextRequest, { params }: { params: { startupId: string } }) => {
  try {
    const user = (req as any).user;
    const { startupId } = params;

    // Verify startup ownership
    const startup = await prisma.startup.findFirst({
      where: {
        id: startupId,
        userId: user.id,
      },
    });

    if (!startup) {
      return NextResponse.json(
        { error: 'Startup not found or access denied' },
        { status: 404 }
      );
    }

    const jobs = await prisma.job.findMany({
      where: {
        startupId,
      },
      include: {
        startup: {
          select: {
            id: true,
            name: true,
            logo: true,
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
        savedJobs: {
          select: {
            id: true,
            userId: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform data to match frontend expectations
    const transformedJobs = jobs.map(job => ({
      ...job,
      startupName: job.startup.name,
      applications: job.applications.length,
    }));

    return NextResponse.json({ data: transformedJobs });
  } catch (error) {
    return handleApiError(error);
  }
});