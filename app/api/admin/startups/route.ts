import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Check if user is admin
  const isAdminUser = session.user?.email === 'nikhil.s@startupgram.in';
  
  if (!isAdminUser) {
    return NextResponse.json(
      { error: 'Forbidden' },
      { status: 403 }
    );
  }

  try {
    const startups = await prisma.startup.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        logo: true,
        website: true,
        featured: true,
        createdAt: true,
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(startups);
  } catch (error) {
    console.error('Error fetching startups:', error);
    return NextResponse.json(
      { error: 'Failed to fetch startups' },
      { status: 500 }
    );
  }
}
