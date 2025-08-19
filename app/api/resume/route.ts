import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, handleApiError } from '@/lib/middleware';
import { resumeSchema } from '@/lib/validations';
import { CoinSystem } from '@/lib/coin-system';

export const POST = withAuth(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { experience, education, customSections, ...resumeData } = resumeSchema.parse(body);
    const user = (req as any).user;

    // Check if user already has a resume
    const existingResume = await prisma.resume.findUnique({
      where: { userId: user.id },
    });

    if (existingResume) {
      return NextResponse.json(
        { error: 'Resume already exists. Use PUT to update.' },
        { status: 409 }
      );
    }

    const resume = await prisma.resume.create({
      data: {
        ...resumeData,
        userId: user.id,
        experience: {
          create: experience.map((exp, index) => ({
            ...exp,
            order: index,
          })),
        },
        education: {
          create: education.map((edu, index) => ({
            ...edu,
            order: index,
          })),
        },
        customSections: {
          create: customSections.map((section, index) => ({
            ...section,
            order: index,
          })),
        },
      },
      include: {
        experience: {
          orderBy: {
            order: 'asc',
          },
        },
        education: {
          orderBy: {
            order: 'asc',
          },
        },
        customSections: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    // Award coins for creating resume
    await CoinSystem.checkAndAwardMilestones(user.id);

    return NextResponse.json({ data: resume });
  } catch (error) {
    console.error('Resume creation error:', error);
    return handleApiError(error);
  }
});

export const PUT = withAuth(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { experience, education, customSections, ...resumeData } = resumeSchema.parse(body);
    const user = (req as any).user;

    // Check if resume exists
    const existingResume = await prisma.resume.findUnique({
      where: { userId: user.id },
    });

    if (!existingResume) {
      return NextResponse.json(
        { error: 'Resume not found. Please create a resume first.' },
        { status: 404 }
      );
    }

    // Update resume with transaction to ensure data consistency
    const resume = await prisma.$transaction(async (tx) => {
      // Delete existing related records
      await tx.experience.deleteMany({
        where: { resumeId: existingResume.id },
      });
      await tx.education.deleteMany({
        where: { resumeId: existingResume.id },
      });
      await tx.customSection.deleteMany({
        where: { resumeId: existingResume.id },
      });

      // Update resume and create new related records
      return tx.resume.update({
        where: { id: existingResume.id },
        data: {
          ...resumeData,
          experience: {
            create: experience.map((exp, index) => ({
              ...exp,
              order: index,
            })),
          },
          education: {
            create: education.map((edu, index) => ({
              ...edu,
              order: index,
            })),
          },
          customSections: {
            create: customSections.map((section, index) => ({
              ...section,
              order: index,
            })),
          },
        },
        include: {
          experience: {
            orderBy: {
              order: 'asc',
            },
          },
          education: {
            orderBy: {
              order: 'asc',
            },
          },
          customSections: {
            orderBy: {
              order: 'asc',
            },
          },
        },
      });
    });

    return NextResponse.json({ data: resume });
  } catch (error) {
    console.error('Resume update error:', error);
    return handleApiError(error);
  }
});

export const GET = withAuth(async (req: NextRequest) => {
  try {
    const user = (req as any).user;

    const resume = await prisma.resume.findUnique({
      where: {
        userId: user.id,
      },
      include: {
        experience: {
          orderBy: {
            order: 'asc',
          },
        },
        education: {
          orderBy: {
            order: 'asc',
          },
        },
        customSections: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    // Award coins for updating resume
    await CoinSystem.checkAndAwardMilestones(user.id);

    return NextResponse.json({ data: resume });
  } catch (error) {
    console.error('Resume fetch error:', error);
    return handleApiError(error);
  }
});