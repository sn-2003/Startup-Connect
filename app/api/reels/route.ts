import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, handleApiError, rateLimit } from '@/lib/middleware';
import { reelSchema } from '@/lib/validations';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const featured = searchParams.get('featured') === 'true';
    const limit = parseInt(searchParams.get('limit') || '20');

    const where: any = {
      active: true,
    };
    if (featured) {
      where.featured = true;
    }

  // First get all active reel IDs
  const allReelIds = await prisma.reel.findMany({
    where: {
      active: true,
      ...(featured ? { featured: true } : {})
    },
    select: { id: true },
    orderBy: { id: 'asc' } // Consistent ordering
  });

  // Shuffle the IDs
  const shuffledIds = [...allReelIds].sort(() => Math.random() - 0.5);
  
  // Get the subset of IDs we need
  const selectedIds = shuffledIds.slice(0, limit).map(item => item.id);
  
  // Fetch the full reel data for the selected IDs
  const reels = await prisma.reel.findMany({
    where: {
      id: { in: selectedIds },
      active: true,
      ...(featured ? { featured: true } : {})
    },
    include: {
      user: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });
  
  // Maintain the random order from the ID selection
  const idToReel = new Map(reels.map(reel => [reel.id, reel]));
  const orderedReels = selectedIds
    .map(id => idToReel.get(id))
    .filter((reel): reel is NonNullable<typeof reel> => reel !== undefined);

  // Add cache control with a short TTL for better performance
  return NextResponse.json({ data: orderedReels }, {
    headers: {
      'Cache-Control': 'public, max-age=60, stale-while-revalidate=30',
      'Vary': 'Cookie, Authorization'  // Vary cache by auth state
    }
  });
  } catch (error) {
    return handleApiError(error);
  }
}

export const POST = withAuth(async (req: NextRequest) => {
  const rateLimitResult = await rateLimit(req);
  if (rateLimitResult) return rateLimitResult;

  try {
    const body = await req.json();
    const { instagramUrls, active } = reelSchema.parse(body);
    const user = (req as any).user;

    if (!user?.isAdmin) {
      return NextResponse.json(
        { error: 'Only admins can add reels.' },
        { status: 403 }
      );
    }

    const createdReels = [];
    const errors = [];

    for (const url of instagramUrls) {
      const embedId = extractInstagramEmbedId(url);
      if (!embedId) {
        errors.push({ url, error: 'Invalid Instagram URL' });
        continue;
      }

      const existingReel = await prisma.reel.findUnique({
        where: { instagramUrl: url },
      });

      if (existingReel) {
        errors.push({ url, error: 'This reel has already been added' });
        continue;
      }

      const reel = await prisma.reel.create({
        data: {
          instagramUrl: url,
          embedId,
          userId: user.id,
          active: active !== undefined ? active : true,
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

      createdReels.push(reel);

      try {
        const { reelFeedManager } = await import('@/lib/reel-feed-manager');
        await reelFeedManager.handleReelAdded(reel.id);
      } catch (error) {
        console.error(`Error adding reel ${reel.id} to user feeds:`, error);
      }
    }

    if (createdReels.length === 0 && errors.length > 0) {
      return NextResponse.json({ error: 'Failed to add any reels.', details: errors }, { status: 400 });
    }

    return NextResponse.json({ 
      data: createdReels, 
      message: `Successfully added ${createdReels.length} of ${instagramUrls.length} reels.`,
      errors 
    });
  } catch (error) {
    return handleApiError(error);
  }
});

function extractInstagramEmbedId(url: string): string | null {
  try {
    // Handle various Instagram URL formats
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