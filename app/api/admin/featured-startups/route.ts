import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Check if user is admin (simplified for now)
  const isAdminUser = session.user.email === 'nikhil.s@startupgram.in';
  
  if (!isAdminUser) {
    return NextResponse.json(
      { error: 'Forbidden' },
      { status: 403 }
    );
  }

  try {
    const featuredStartups = await prisma.startup.findMany({
      where: { featured: true },
      select: {
        id: true,
        name: true,
        description: true,
        logo: true,
        website: true,
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(featuredStartups);
  } catch (error) {
    console.error('Error fetching featured startups:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured startups' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Check if user is admin (simplified for now)
  const isAdminUser = session.user.email === 'nikhil.s@startupgram.in';
  
  if (!isAdminUser) {
    console.log('Non-admin user attempted to modify featured status:', session.user.email);
    return NextResponse.json(
      { error: 'Forbidden' },
      { status: 403 }
    );
  }

  try {
    const { startupId, featured } = await req.json();
    
    if (!startupId || typeof featured !== 'boolean') {
      console.log('Invalid request data:', { startupId, featured });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log('Updating featured status:', { startupId, featured });
    
    const updatedStartup = await prisma.startup.update({
      where: { id: startupId },
      data: { featured },
      select: {
        id: true,
        name: true,
        featured: true,
      },
    });

    console.log('Successfully updated featured status:', updatedStartup);
    
    return NextResponse.json({
      success: true,
      data: updatedStartup,
    });
  } catch (error) {
    console.error('Error updating featured status:', error);
    return NextResponse.json(
      { error: 'Failed to update featured status' },
      { status: 500 }
    );
  }
}
