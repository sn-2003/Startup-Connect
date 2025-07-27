import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, handleApiError } from '@/lib/middleware';
import { jobSchema } from '@/lib/validations';

export const PUT = withAuth(async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const body = await req.json();
    const { customQuestions, ...jobData } = jobSchema.parse(body);
    const user = (req as any).user;
    const { id } = params;

    // Check if job exists and user owns the startup
    const existingJob = await prisma.job.findFirst({
      where: {
        id,
        startup: {
          userId: user.id,
        },
      },
    });

    if (!existingJob) {
      return NextResponse.json(
        { error: 'Job not found or access denied' },
        { status: 404 }
      );
    }

    // Update job with transaction
    const job = await prisma.$transaction(async (tx) => {
      // Delete existing custom questions
      await tx.customQuestion.deleteMany({
        where: { jobId: id },
      });

      // Update job and create new custom questions
      return tx.job.update({
        where: { id },
        data: {
          ...jobData,
          ...(typeof jobData.unpaid !== 'undefined' ? { unpaid: jobData.unpaid } : {}),
          customQuestions: {
            create: customQuestions.map((q, index) => ({
              ...q,
              order: index,
            })),
          },
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
    });

    // Transform the response to match frontend expectations
    const transformedJob = {
      ...job,
      startupName: job.startup.name,
      applications: job.applications.length,
    };

    return NextResponse.json({ data: transformedJob });
  } catch (error) {
    return handleApiError(error);
  }
});

export const DELETE = withAuth(async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const user = (req as any).user;
    const { id } = params;

    // Check if job exists and user owns the startup
    const existingJob = await prisma.job.findFirst({
      where: {
        id,
        startup: {
          userId: user.id,
        },
      },
    });

    if (!existingJob) {
      return NextResponse.json(
        { error: 'Job not found or access denied' },
        { status: 404 }
      );
    }

    await prisma.job.delete({
      where: { id },
    });

    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    return handleApiError(error);
  }
});