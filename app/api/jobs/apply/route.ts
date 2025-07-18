import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, handleApiError, rateLimit } from '@/lib/middleware';
import { applicationSchema } from '@/lib/validations';

export const POST = withAuth(async (req: NextRequest) => {
  // Rate limit job application submission
  const rateLimitResult = await rateLimit(req);
  if (rateLimitResult) return rateLimitResult;

  try {
    const body = await req.json();
    const { jobId, customAnswers } = applicationSchema.parse(body);
    const user = (req as any).user;

    // Check if job exists
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        customQuestions: true,
        startup: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    // Check if user already applied
    const existingApplication = await prisma.application.findUnique({
      where: {
        userId_jobId: {
          userId: user.id,
          jobId,
        },
      },
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: 'You have already applied to this job' },
        { status: 409 }
      );
    }

    // Create application with custom answers
    const application = await prisma.application.create({
      data: {
        userId: user.id,
        jobId,
        customAnswers: {
          create: customAnswers.map(answer => ({
            questionId: answer.questionId,
            answer: answer.answer,
          })),
        },
      },
      include: {
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
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({ data: application });
  } catch (error) {
    return handleApiError(error);
  }
});