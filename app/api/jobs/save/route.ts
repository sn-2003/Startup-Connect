import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, handleApiError } from '@/lib/middleware';

export const POST = withAuth(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { jobId } = body;
    const user = (req as any).user;

    // Check if job exists
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    // Check if already saved
    const existingSavedJob = await prisma.savedJob.findUnique({
      where: {
        userId_jobId: {
          userId: user.id,
          jobId,
        },
      },
    });

    if (existingSavedJob) {
      return NextResponse.json(
        { error: 'Job already saved' },
        { status: 409 }
      );
    }

    const savedJob = await prisma.savedJob.create({
      data: {
        userId: user.id,
        jobId,
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
            customQuestions: true,
          },
        },
      },
    });

    return NextResponse.json({ data: savedJob });
  } catch (error) {
    return handleApiError(error);
  }
});