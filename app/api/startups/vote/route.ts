import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, handleApiError, rateLimit } from '@/lib/middleware';
import { voteSchema } from '@/lib/validations';

export const POST = withAuth(async (req: NextRequest) => {
  // Rate limit vote submission
  const rateLimitResult = await rateLimit(req);
  if (rateLimitResult) return rateLimitResult;

  try {
    const body = await req.json();
    const { startupId, type } = voteSchema.parse(body);
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

    // Use transaction to handle vote update
    const result = await prisma.$transaction(async (tx) => {
      // Remove existing vote if any
      const existingVote = await tx.startupVote.findUnique({
        where: {
          userId_startupId: {
            userId: user.id,
            startupId,
          },
        },
      });

      if (existingVote) {
        // Update vote counts based on previous vote
        if (existingVote.type === 'UPVOTE') {
          await tx.startup.update({
            where: { id: startupId },
            data: { upvotes: { decrement: 1 } },
          });
        } else {
          await tx.startup.update({
            where: { id: startupId },
            data: { downvotes: { decrement: 1 } },
          });
        }

        // Delete existing vote
        await tx.startupVote.delete({
          where: {
            userId_startupId: {
              userId: user.id,
              startupId,
            },
          },
        });
      }

      // Create new vote
      await tx.startupVote.create({
        data: {
          userId: user.id,
          startupId,
          type,
        },
      });

      // Update vote counts
      if (type === 'UPVOTE') {
        await tx.startup.update({
          where: { id: startupId },
          data: { upvotes: { increment: 1 } },
        });
      } else {
        await tx.startup.update({
          where: { id: startupId },
          data: { downvotes: { increment: 1 } },
        });
      }

      // Return updated startup
      return tx.startup.findUnique({
        where: { id: startupId },
        include: {
          votes: true,
        },
      });
    });

    return NextResponse.json({ data: result });
  } catch (error) {
    return handleApiError(error);
  }
});