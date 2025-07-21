import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, handleApiError, rateLimit } from '@/lib/middleware';
import { jobSchema } from '@/lib/validations';

export async function GET() {
  try {
    const jobs = await prisma.job.findMany({
      include: {
        startup: {
          select: {
            id: true,
            name: true,
            logo: true,
            linkedinUrl: true,
            instagramUrl: true,
            xUrl: true,
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform data to match frontend expectations
    const transformedJobs = jobs.map(job => ({
      ...job,
      startupName: job.startup.name,
      applications: job.applications.length,
    }));

    return NextResponse.json({ data: transformedJobs }, {
      headers: {
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=60'
      }
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export const POST = withAuth(async (req: NextRequest) => {
  // Rate limit job creation
  const rateLimitResult = await rateLimit(req);
  if (rateLimitResult) return rateLimitResult;

  try {
    const body = await req.json();
    const { customQuestions, ...jobData } = jobSchema.parse(body);
    const user = (req as any).user;

    // Verify startup ownership
    const startup = await prisma.startup.findFirst({
      where: {
        id: jobData.startupId,
        userId: user.id,
      },
    });

    if (!startup) {
      return NextResponse.json(
        { error: 'Startup not found or access denied' },
        { status: 404 }
      );
    }

    const job = await prisma.job.create({
      data: {
        ...jobData,
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