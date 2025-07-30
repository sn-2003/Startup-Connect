import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'rating';
    const featured = searchParams.get('featured');

    // Build where clause
    const where: any = {};
    
    if (category && category !== 'all') {
      where.category = category.toUpperCase();
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { hasSome: [search] } }
      ];
    }

    if (featured === 'true') {
      where.featured = true;
    }

    // Build orderBy clause
    let orderBy: any = {};
    switch (sortBy) {
      case 'rating':
        orderBy.rating = 'desc';
        break;
      case 'users':
        orderBy.users = 'desc';
        break;
      case 'name':
        orderBy.name = 'asc';
        break;
      case 'createdAt':
        orderBy.createdAt = 'desc';
        break;
      default:
        orderBy.rating = 'desc';
    }

    const tools = await prisma.tool.findMany({
      where,
      orderBy,
      include: {
        _count: {
          select: {
            userRatings: true,
            userFavorites: true
          }
        }
      }
    });

    return NextResponse.json({ success: true, data: tools });
  } catch (error) {
    console.error('Error fetching tools:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tools' },
      { status: 500 }
    );
  }
} 