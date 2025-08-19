import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, handleApiError } from '@/lib/middleware';
import { startupSchema } from '@/lib/validations';
import { CoinSystem } from '@/lib/coin-system';

export const PUT = withAuth(async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const body = await req.json();
    const data = startupSchema.parse(body);
    const user = (req as any).user;
    const { id } = params;

    // Check if startup exists and belongs to user
    const existingStartup = await prisma.startup.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!existingStartup) {
      return NextResponse.json(
        { error: 'Startup not found or access denied' },
        { status: 404 }
      );
    }

    const startup = await prisma.startup.update({
      where: { id },
      data: {
        ...data,
        // promotionalImages is not a valid property on the startup model for update
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        jobs: true,
        votes: true,
        feedback: true,
      },
    });

    // Award coins for updating startup
    await CoinSystem.awardCoins(user.id, 'STARTUP_UPDATE', { startupId: startup.id });

    return NextResponse.json({ data: startup });
  } catch (error) {
    return handleApiError(error);
  }
});

export const DELETE = withAuth(async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const user = (req as any).user;
    const { id } = params;

    // Check if startup exists and belongs to user
    const existingStartup = await prisma.startup.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!existingStartup) {
      return NextResponse.json(
        { error: 'Startup not found or access denied' },
        { status: 404 }
      );
    }

    await prisma.startup.delete({
      where: { id },
    });

    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    return handleApiError(error);
  }
});