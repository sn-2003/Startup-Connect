import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, handleApiError, rateLimit } from '@/lib/middleware';
import { startupSchema } from '@/lib/validations';

export async function GET() {
  try {
    const startups = await prisma.startup.findMany({
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

    return NextResponse.json({ data: startup });
  } catch (error) {
    return handleApiError(error);
  }
});