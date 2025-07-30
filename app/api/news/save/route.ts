import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

export async function POST(request: NextRequest) {
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
    const { newsId } = body;

    if (!newsId) {
      return NextResponse.json(
        { success: false, error: 'News ID is required' },
        { status: 400 }
      );
    }

    // Check if news exists
    const news = await prisma.news.findUnique({
      where: { id: newsId }
    });

    if (!news) {
      return NextResponse.json(
        { success: false, error: 'News not found' },
        { status: 404 }
      );
    }

    // Check if already bookmarked
    const existingBookmark = await prisma.newsBookmark.findUnique({
      where: {
        userId_newsId: {
          userId: user.id,
          newsId: newsId
        }
      }
    });

    if (existingBookmark) {
      // Remove bookmark
      await prisma.newsBookmark.delete({
        where: {
          userId_newsId: {
            userId: user.id,
            newsId: newsId
          }
        }
      });

      return NextResponse.json({
        success: true,
        data: { saved: false },
        message: 'News removed from saved'
      });
    } else {
      // Add bookmark
      await prisma.newsBookmark.create({
        data: {
          userId: user.id,
          newsId: newsId
        }
      });

      return NextResponse.json({
        success: true,
        data: { saved: true },
        message: 'News saved successfully'
      });
    }
  } catch (error) {
    console.error('Error saving/unsaving news:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save/unsave news' },
      { status: 500 }
    );
  }
} 