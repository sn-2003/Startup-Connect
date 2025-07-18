import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, handleApiError, rateLimit } from '@/lib/middleware';
import { feedbackSchema } from '@/lib/validations';

export const POST = withAuth(async (req: NextRequest) => {
  // Rate limit feedback submission
  const rateLimitResult = await rateLimit(req);
  if (rateLimitResult) return rateLimitResult;

  try {
    const body = await req.json();
    const { startupId, comment } = feedbackSchema.parse(body);
    const user = (req as any).user;

    // Check if startup exists
    const startup = await prisma.startup.findUnique({
      where: { id: startupId },
    });

    if (!startup) {
      return NextResponse.json(
        { error: 'Startup not found' },
        { status: 404 }
      );
    }

    const feedback = await prisma.startupFeedback.create({
      data: {
        userId: user.id,
        startupId,
        comment,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({ data: feedback });
  } catch (error) {
    return handleApiError(error);
  }
});