import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

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
      where: { email: session.user.email },
      select: { id: true, coins: true }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const includeTransactions = searchParams.get('transactions') === 'true';
    const limit = parseInt(searchParams.get('limit') || '50');

    let transactions: Array<{
      id: string;
      userId: string;
      amount: number;
      action: string;
      description: string;
      metadata: any;
      createdAt: Date;
    }> = [];
    
    if (includeTransactions) {
      transactions = await prisma.coinTransaction.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: limit,
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        balance: user.coins,
        transactions: includeTransactions ? transactions : undefined,
      }
    });
  } catch (error) {
    console.error('Error fetching coin data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch coin data' },
      { status: 500 }
    );
  }
}