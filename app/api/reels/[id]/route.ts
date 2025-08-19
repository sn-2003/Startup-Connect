import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, handleApiError } from '@/lib/middleware';
import { reelSchema } from '@/lib/validations';

export const PUT = withAuth(async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const body = await req.json();
    const data = reelSchema.parse(body);
    const user = (req as any).user;
    const { id } = params;

    // Only allow admins to update reels
    if (!user?.isAdmin) {
      return NextResponse.json(
        { error: 'Only admins can update reels.' },
        { status: 403 }
      );
    }

    // Check if reel exists
  const existingReel = await prisma.reel.findUnique({
      where: { id },
    });
    if (!existingReel) {
      return NextResponse.json(
        { error: 'Reel not found' },
        { status: 404 }
      );
    }

    // Extract embed ID if URL changed
    let embedId = existingReel.embedId;
    if (data.instagramUrl && data.instagramUrl !== existingReel.instagramUrl) {
      embedId = extractInstagramEmbedId(data.instagramUrl);
      if (!embedId) {
        return NextResponse.json(
          { error: 'Invalid Instagram URL' },
          { status: 400 }
        );
      }
    }

  const reel = await prisma.reel.update({
      where: { id },
      data: {
        ...data,
        embedId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({ data: reel });
  } catch (error) {
    return handleApiError(error);
  }
});

export const DELETE = withAuth(async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const user = (req as any).user;
    const { id } = params;

    // Only allow admins to delete reels
    if (!user?.isAdmin) {
      return NextResponse.json(
        { error: 'Only admins can delete reels.' },
        { status: 403 }
      );
    }

    // Check if reel exists
  const existingReel = await prisma.reel.findUnique({
      where: { id },
    });
    if (!existingReel) {
      return NextResponse.json(
        { error: 'Reel not found' },
        { status: 404 }
      );
    }

    // Import the reel feed manager
    const { reelFeedManager } = await import('@/lib/reel-feed-manager');
    
    // Handle reel deletion in feed manager before deleting from database
    await reelFeedManager.handleReelDeleted(id);
  await prisma.reel.delete({
      where: { id },
    });

    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    return handleApiError(error);
  }
});

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();
    const { action } = body;

    if (action === 'view') {
      // Increment view count
  await prisma.reel.update({
        where: { id },
        data: {
          views: {
            increment: 1,
          },
        },
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

function extractInstagramEmbedId(url: string): string | null {
  try {
    const patterns = [
      /instagram\.com\/p\/([A-Za-z0-9_-]+)/,
      /instagram\.com\/reel\/([A-Za-z0-9_-]+)/,
      /instagram\.com\/tv\/([A-Za-z0-9_-]+)/,
      /instagr\.am\/p\/([A-Za-z0-9_-]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }

    return null;
  } catch (error) {
    return null;
  }
}