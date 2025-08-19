import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, handleApiError, rateLimit } from '@/lib/middleware';
import { jobSchema } from '@/lib/validations';
import { CoinSystem } from '@/lib/coin-system';

export async function GET() {
  try {
    // Add production debugging
    // console.log('Jobs API: Environment check - NODE_ENV:', process.env.NODE_ENV);
    // console.log('Jobs API: Database URL check:', process.env.DATABASE_URL ? 'Set' : 'Not set');
    
    const jobs = await prisma.job.findMany({
      where: {
        listed: true, // Only show listed jobs
      },
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

    // console.log('Jobs API: Found', jobs.length, 'listed jobs');

    // Transform data to match frontend expectations
    const transformedJobs = jobs.map(job => ({
      ...job,
      startupName: job.startup.name,
      applications: job.applications.length,
    }));

    // Remove aggressive caching for production
    return NextResponse.json({ data: transformedJobs }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('Jobs API Error:', error);
    return handleApiError(error);
  }
}

export const POST = withAuth(async (req: NextRequest) => {
  // Rate limit job creation
  const rateLimitResult = await rateLimit(req);
  if (rateLimitResult) return rateLimitResult;

  try {
    const body = await req.json();
    console.log('Job creation: Environment - NODE_ENV:', process.env.NODE_ENV);
    console.log('Job creation: Received data:', body);
    
    const { customQuestions, ...jobData } = jobSchema.parse(body);
    const user = (req as any).user;

    console.log('Job creation: User ID:', user.id);
    console.log('Job creation: Startup ID:', jobData.startupId);

    // Verify startup ownership
    const startup = await prisma.startup.findFirst({
      where: {
        id: jobData.startupId,
        userId: user.id,
      },
    });

    if (!startup) {
      console.error('Job creation: Startup not found or access denied');
      return NextResponse.json(
        { error: 'Startup not found or access denied' },
        { status: 404 }
      );
    }

    console.log('Job creation: Startup verified:', startup.name);

    // Ensure listed field is explicitly set to true
    const jobCreateData = {
      ...jobData,
      listed: true, // Explicitly set listed to true
      ...(typeof jobData.unpaid !== 'undefined' ? { unpaid: jobData.unpaid } : {}),
      customQuestions: {
        create: customQuestions.map((q, index) => ({
          ...q,
          order: index,
        })),
      },
    };

    console.log('Job creation: Creating job with data:', jobCreateData);

    const job = await prisma.job.create({
      data: jobCreateData,
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

    console.log('Job creation: Job created successfully:', {
      id: job.id,
      title: job.title,
      listed: job.listed,
      startupId: job.startupId
    });

    // Transform the response to match frontend expectations
    const transformedJob = {
      ...job,
      startupName: job.startup.name,
      applications: job.applications.length,
    };

    // Award coins for creating job
    await CoinSystem.awardCoins(user.id, 'JOB_CREATE', { jobId: job.id, startupId: job.startupId });

    return NextResponse.json({ data: transformedJob });
  } catch (error) {
    console.error('Job creation error:', error);
    return handleApiError(error);
  }
});