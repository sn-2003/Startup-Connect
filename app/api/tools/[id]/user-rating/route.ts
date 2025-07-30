import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user has favorited this tool
    const favorite = await prisma.toolFavorite.findUnique({
      where: {
        userId_toolId: {
          userId: user.id,
          toolId: params.id
        }
      }
    });

    // Get user's rating for this tool
    const rating = await prisma.toolRating.findUnique({
      where: {
        userId_toolId: {
          userId: user.id,
          toolId: params.id
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        isFavorited: !!favorite,
        rating: rating?.rating || null,
        review: rating?.review || null,
        ratingId: rating?.id || null
      }
    });
  } catch (error) {
    console.error('Error fetching user tool rating:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user rating' },
      { status: 500 }
    );
  }
} 