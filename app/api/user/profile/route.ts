import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, handleApiError } from '@/lib/middleware';
import { userProfileSchema } from '@/lib/validations';
import { z } from 'zod';
import { CoinSystem } from '@/lib/coin-system';

export const GET = withAuth(async (req: NextRequest) => {
  try {
    const user = (req as any).user;

    // Get user profile data
    const userProfile = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        website: true,
        linkedin: true,
        github: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!userProfile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: userProfile });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return handleApiError(error);
  }
});

export const PUT = withAuth(async (req: NextRequest) => {
  try {
    const user = (req as any).user;
    const body = await req.json();
    
    // Validate input data
    const validatedData = userProfileSchema.parse(body);

    // Check if email is already taken by another user
    if (validatedData.email !== user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: validatedData.email },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: 'Email address is already in use' },
          { status: 409 }
        );
      }
    }

    // Normalize URLs by adding https:// if they don't have a protocol
    const normalizeUrl = (url: string | undefined) => {
      if (!url || url === '') return null;
      if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
      }
      return `https://${url}`;
    };

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: validatedData.name,
        email: validatedData.email,
        website: normalizeUrl(validatedData.website),
        linkedin: normalizeUrl(validatedData.linkedin),
        github: normalizeUrl(validatedData.github),
      },
      select: {
        id: true,
        name: true,
        email: true,
        website: true,
        linkedin: true,
        github: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Award coins for updating profile
    await CoinSystem.awardCoins(user.id, 'PROFILE_UPDATE', { fields: Object.keys(validatedData) });
    await CoinSystem.checkAndAwardMilestones(user.id);

    return NextResponse.json({ 
      data: updatedUser,
      message: 'Profile updated successfully' 
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    return handleApiError(error);
  }
}); 