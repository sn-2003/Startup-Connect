import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
// Add this line after imports
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'latest';
    const featured = searchParams.get('featured');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Build where clause
    const where: any = {};
    
    if (category && category !== 'all') {
      where.category = category.toUpperCase();
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { summary: { contains: search, mode: 'insensitive' } },
        { tags: { hasSome: [search] } }
      ];
    }

    if (featured === 'true') {
      where.featured = true;
    }

    // Build orderBy clause
    let orderBy: any = {};
    switch (sortBy) {
      case 'latest':
        orderBy.publishedAt = 'desc';
        break;
      case 'popular':
        orderBy.views = 'desc';
        break;
      case 'trending':
        orderBy.views = 'desc';
        break;
      case 'oldest':
        orderBy.publishedAt = 'asc';
        break;
      default:
        orderBy.publishedAt = 'desc';
    }

    const news = await prisma.news.findMany({
      where,
      orderBy,
      take: limit,
      include: {
        _count: {
          select: {
            userBookmarks: true
          }
        }
      }
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