import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

export async function POST(request: NextRequest): Promise<Response> {
  try {
    // Check if user is authenticated and is admin (optional)
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Trigger the news fetch script
    const { spawn } = require('child_process');
    
    return new Promise<Response>((resolve) => {
      const child = spawn('node', ['scripts/fetch-news.js'], {
        stdio: 'pipe'
      });

      let output = '';
      let errorOutput = '';

      child.stdout.on('data', (data: Buffer) => {
        output += data.toString();
      });

      child.stderr.on('data', (data: Buffer) => {
        errorOutput += data.toString();
      });

      child.on('close', (code: number) => {
        if (code === 0) {
          resolve(NextResponse.json({ 
            success: true, 
            message: 'News fetch completed successfully',
            output: output
          }));
        } else {
          resolve(NextResponse.json({ 
            success: false, 
            error: 'News fetch failed',
            output: output,
            errorOutput: errorOutput
          }, { status: 500 }));
        }
      });
    });

  } catch (error) {
    console.error('Error triggering news fetch:', error);
    return NextResponse.json({ success: false, error: 'Failed to trigger news fetch' }, { status: 500 });
  }
} 