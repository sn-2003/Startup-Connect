import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
// Add this line after imports
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Check if Prisma client is available
    if (!prisma) {
      console.error('Prisma client is not available');
      return NextResponse.json(
        { success: false, error: 'Database connection not available' },
        { status: 500 }
      );
    }

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

    console.log('Fetching tools with params:', { category, search, sortBy, featured });

    // Test database connection first
    await prisma.$connect();

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

    console.log(`Successfully fetched ${tools.length} tools`);
    return NextResponse.json({ success: true, data: tools });
  } catch (error) {
    // Ensure we disconnect from the database
    try {
      await prisma.$disconnect();
    } catch (disconnectError) {
      console.error('Error disconnecting from database:', disconnectError);
    }
    console.error('Error fetching tools:', error);
    
    // More detailed error logging
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tools', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    // Ensure we disconnect from the database
    try {
      await prisma.$disconnect();
    } catch (disconnectError) {
      console.error('Error disconnecting from database:', disconnectError);
    }
  }
} 