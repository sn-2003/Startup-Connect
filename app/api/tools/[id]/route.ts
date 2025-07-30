import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tool = await prisma.tool.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            userRatings: true,
            userFavorites: true
          }
        }
      }
    });

    if (!tool) {
      return NextResponse.json(
        { success: false, error: 'Tool not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: tool });
  } catch (error) {
    console.error('Error fetching tool:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tool' },
      { status: 500 }
    );
  }
}

export async function POST(
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

    const body = await request.json();
    const { action, rating, review } = body;

    if (action === 'rate') {
      // Upsert rating
      const toolRating = await prisma.toolRating.upsert({
        where: {
          userId_toolId: {
            userId: user.id,
            toolId: params.id
          }
        },
        update: {
          rating,
          review,
          updatedAt: new Date()
        },
        create: {
          userId: user.id,
          toolId: params.id,
          rating,
          review
        }
      });

      // Update tool's average rating
      const ratings = await prisma.toolRating.findMany({
        where: { toolId: params.id }
      });

      const averageRating = ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length;

      await prisma.tool.update({
        where: { id: params.id },
        data: { rating: averageRating }
      });

      return NextResponse.json({ success: true, data: toolRating });
    }

    if (action === 'favorite') {
      const favorite = await prisma.toolFavorite.create({
        data: {
          userId: user.id,
          toolId: params.id
        }
      });

      return NextResponse.json({ success: true, data: favorite });
    }

    if (action === 'unfavorite') {
      await prisma.toolFavorite.delete({
        where: {
          userId_toolId: {
            userId: user.id,
            toolId: params.id
          }
        }
      });

      return NextResponse.json({ success: true, message: 'Removed from favorites' });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error with tool action:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to perform action' },
      { status: 500 }
    );
  }
} 