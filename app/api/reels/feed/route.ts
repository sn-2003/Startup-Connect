import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/auth-options';
import { reelFeedManager } from '@/lib/reel-feed-manager';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const sync = searchParams.get('sync') === 'true';

    // Optionally sync user's reel order with current active reels
    if (sync) {
      await reelFeedManager.syncUserReelOrder(session.user.id);
    }

    // Get user's personalized feed
    const feedData = await reelFeedManager.getUserReelFeed(session.user.id);
    
    // Get user's current position info
    const positionInfo = await reelFeedManager.getUserFeedPosition(session.user.id);

    return NextResponse.json({
      success: true,
      data: {
        ...feedData,
        position: positionInfo
      }
    });
  } catch (error) {
    console.error('Error fetching user reel feed:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reel feed' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action, reelId, index } = body;

    switch (action) {
      case 'update_progress':
        if (!reelId || typeof index !== 'number') {
          return NextResponse.json(
            { success: false, error: 'Missing reelId or index' },
            { status: 400 }
          );
        }
        
        await reelFeedManager.updateUserProgress(session.user.id, reelId, index);
        
        return NextResponse.json({
          success: true,
          message: 'Progress updated'
        });

      case 'reset':
        await reelFeedManager.resetUserFeed(session.user.id);
        
        return NextResponse.json({
          success: true,
          message: 'Feed reset successfully'
        });

      case 'get_position':
        const position = await reelFeedManager.getUserFeedPosition(session.user.id);
        
        return NextResponse.json({
          success: true,
          data: position
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error handling reel feed action:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 }
    );
  }
}