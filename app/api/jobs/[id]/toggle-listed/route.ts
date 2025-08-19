import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, handleApiError } from '@/lib/middleware';

export const PUT = withAuth(async (req: NextRequest, { params }: { params: { id: string } }) => {
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
      include: {
        startup: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found or access denied' },
        { status: 404 }
      );
    }

    // Toggle the listed status
    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: {
        listed: !job.listed,
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
    });

    // Transform the response to match frontend expectations
    const transformedJob = {
      ...updatedJob,
      startupName: updatedJob.startup.name,
      applications: updatedJob.applications.length,
    };

    return NextResponse.json({ 
      data: transformedJob,
      message: updatedJob.listed ? 'Job listed successfully' : 'Job delisted successfully'
    });
  } catch (error) {
    return handleApiError(error);
  }
}); 