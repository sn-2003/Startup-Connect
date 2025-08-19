import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, handleApiError, rateLimit } from '@/lib/middleware';
import { startupSchema } from '@/lib/validations';
import { CoinSystem } from '@/lib/coin-system';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const featuredOnly = searchParams.get('featured') === 'true';
    
    const startups = await prisma.startup.findMany({
      where: featuredOnly ? { featured: true } : {},
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        jobs: {
          select: {
            id: true,
          },
        },
        votes: true,
        feedback: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ data: startups });
  } catch (error) {
    return handleApiError(error);
  }
}

export const POST = withAuth(async (req: NextRequest) => {
  // Rate limit startup creation
  const rateLimitResult = await rateLimit(req);
  if (rateLimitResult) return rateLimitResult;

  try {
    const body = await req.json();
    const data = startupSchema.parse(body);
    const user = (req as any).user;

    const startup = await prisma.startup.create({
      data: {
        ...data,
        userId: user.id,
        promotionalImages: data.promotionalImages || [],
        featured: true, // Ensure all new startups are featured by default
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

    // Award coins for creating startup
    await CoinSystem.awardCoins(user.id, 'STARTUP_CREATE', { startupId: startup.id });
    await CoinSystem.checkAndAwardMilestones(user.id);

    return NextResponse.json({ data: startup });
  } catch (error) {
    return handleApiError(error);
  }
});