import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('Production test: Environment check');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
    
    // Test database connection
    const jobCount = await prisma.job.count();
    console.log('Total jobs in database:', jobCount);
    
    const listedJobCount = await prisma.job.count({
      where: { listed: true }
    });
    console.log('Listed jobs in database:', listedJobCount);
    
    // Test startup count
    const startupCount = await prisma.startup.count();
    console.log('Total startups in database:', startupCount);
    
    return NextResponse.json({
      success: true,
      environment: process.env.NODE_ENV,
      databaseConnected: true,
      jobCount,
      listedJobCount,
      startupCount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Production test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      environment: process.env.NODE_ENV,
      databaseConnected: false,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 