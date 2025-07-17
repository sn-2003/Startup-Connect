import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const incubators = await prisma.incubator.findMany({
      orderBy: { name: 'asc' },
    });
    return NextResponse.json({ incubators });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch incubators.' }, { status: 500 });
  }
}
