import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/auth-options';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    const savedNews = await prisma.newsBookmark.findMany({
      where: { userId: user.id },
      include: {
        news: {
          include: {
            _count: {
              select: {
                userBookmarks: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: skip
    });

    const total = await prisma.newsBookmark.count({
      where: { userId: user.id }
    });

    return NextResponse.json({
      success: true,
      data: savedNews.map(item => ({
        ...item.news,
        isBookmarked: true,
        bookmarkId: item.id,
        bookmarkCount: item.news._count.userBookmarks
      })),
      pagination: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
        limit
      }
    });
  } catch (error) {
    console.error('Error fetching saved news:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch saved news' },
      { status: 500 }
    );
  }
}