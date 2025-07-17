import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, handleApiError } from '@/lib/middleware';

export const DELETE = withAuth(async (req: NextRequest, { params }: { params: { jobId: string } }) => {
  try {
    const user = (req as any).user;
    const { jobId } = params;

    const savedJob = await prisma.savedJob.findUnique({
      where: {
        userId_jobId: {
          userId: user.id,
          jobId,
        },
      },
    });

    if (!savedJob) {
      return NextResponse.json(
        { error: 'Saved job not found' },
        { status: 404 }
      );
    }

    await prisma.savedJob.delete({
      where: {
        userId_jobId: {
          userId: user.id,
          jobId,
        },
      },
    });

    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    return handleApiError(error);
  }
});