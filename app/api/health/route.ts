import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Test database connection
    await prisma.$connect();
    
    // Test a simple query
    const toolCount = await prisma.tool.count();
    
    return NextResponse.json({
      success: true,
      message: 'API is healthy',
      database: 'connected',
      toolCount: toolCount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json({
      success: false,
      message: 'API health check failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
} 