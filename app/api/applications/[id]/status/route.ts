import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, handleApiError } from '@/lib/middleware';
import { ApplicationStatus } from '@prisma/client';

export const PUT = withAuth(async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const body = await req.json();
    const { status } = body;
    const user = (req as any).user;
    const { id: applicationId } = params;

    // Validate status
    if (!Object.values(ApplicationStatus).includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Check if application exists and user owns the startup
    const application = await prisma.application.findFirst({
      where: {
        id: applicationId,
        job: {
          startup: {
            userId: user.id,
          },
        },
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found or access denied' },
        { status: 404 }
      );
    }

    const updatedApplication = await prisma.application.update({
      where: { id: applicationId },
      data: { status },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        job: {
          include: {
            startup: {
              select: {
                name: true,
              },
            },
          },
        },
        customAnswers: {
          include: {
            question: true,
          },
        },
      },
    });

    return NextResponse.json({ data: updatedApplication });
  } catch (error) {
    return handleApiError(error);
  }
});

