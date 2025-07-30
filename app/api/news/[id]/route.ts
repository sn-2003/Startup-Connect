import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const news = await prisma.news.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            userBookmarks: true
          }
        }
      }
    });

    if (!news) {
      return NextResponse.json(
        { success: false, error: 'News article not found' },
        { status: 404 }
      );
    }

    // Increment view count
    await prisma.news.update({
      where: { id: params.id },
      data: { views: { increment: 1 } }
    });

    return NextResponse.json({ success: true, data: news });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch news' },
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
    const { action } = body;

    if (action === 'bookmark') {
      const bookmark = await prisma.newsBookmark.create({
        data: {
          userId: user.id,
          newsId: params.id
        }
      });

      return NextResponse.json({ success: true, data: bookmark });
    }

    if (action === 'unbookmark') {
      await prisma.newsBookmark.delete({
        where: {
          userId_newsId: {
            userId: user.id,
            newsId: params.id
          }
        }
      });

      return NextResponse.json({ success: true, message: 'Removed from bookmarks' });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error with news action:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to perform action' },
      { status: 500 }
    );
  }
} 