import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, generateToken } from '@/lib/auth';
import { loginSchema } from '@/lib/validations';
import { rateLimit } from '@/lib/middleware';
import { CoinSystem } from '@/lib/coin-system';

export async function POST(req: NextRequest) {
  // Rate limit login attempts
  const rateLimitResult = await rateLimit(req);
  if (rateLimitResult) return rateLimitResult;

  try {
    const body = await req.json();
    const { email, password } = loginSchema.parse(body);

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    if (!user.password) {
      return NextResponse.json(
        { error: 'This account does not have a password. Please sign in with Google or another provider.' },
        { status: 400 }
      );
    }
    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    // Return user data (without password) and token
    const { password: _, ...userWithoutPassword } = user;

    // Award daily login bonus
    await CoinSystem.awardCoins(user.id, 'DAILY_LOGIN');

    return NextResponse.json({
      data: {
        user: userWithoutPassword,
        token,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Invalid request data' },
      { status: 400 }
    );
  }
}