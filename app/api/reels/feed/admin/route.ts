import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/auth-options';
import { reelFeedManager } from '@/lib/reel-feed-manager';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is admin
    if (!session?.user?.email || session.user.email !== 'nikhil.s@startupgram.in') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action, reelId } = body;

    switch (action) {
      case 'reel_added':
        if (!reelId) {
          return NextResponse.json(
            { success: false, error: 'Missing reelId' },
            { status: 400 }
          );
        }
        
        await reelFeedManager.handleReelAdded(reelId);
        
        return NextResponse.json({
          success: true,
          message: 'Reel added to all user feeds'
        });

      case 'reel_deleted':
        if (!reelId) {
          return NextResponse.json(
            { success: false, error: 'Missing reelId' },
            { status: 400 }
          );
        }
        
        await reelFeedManager.handleReelDeleted(reelId);
        
        return NextResponse.json({
          success: true,
          message: 'Reel removed from all user feeds'
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error handling admin reel feed action:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 }
    );
  }
}