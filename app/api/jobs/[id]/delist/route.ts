import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, handleApiError } from '@/lib/middleware';

export const PUT = withAuth(async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const user = (req as any).user;
    const { id } = params;

    // Find the job and ensure the user owns the startup
    const job = await prisma.job.findUnique({
      where: { id },
      include: { startup: true },
    });
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }
    if (!job.startup || job.startup.userId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Update the job to set listed=false
    await prisma.job.update({
      where: { id },
      data: { listed: false },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
});

export const PATCH = withAuth(async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const user = (req as any).user;
    const { id } = params;

    // Find the job and ensure the user owns the startup
    const job = await prisma.job.findUnique({
      where: { id },
      include: { startup: true },
    });
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }
    if (!job.startup || job.startup.userId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Update the job to set listed=true
    await prisma.job.update({
      where: { id },
      data: { listed: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}); 