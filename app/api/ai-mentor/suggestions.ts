import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, suggestions: [] }, { status: 401 });
    }
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
      return NextResponse.json({ success: false, suggestions: [] }, { status: 404 });
    }

    const [resume, startups, applications] = await Promise.all([
      prisma.resume.findUnique({ where: { userId: user.id } }),
      prisma.startup.findMany({ where: { userId: user.id } }),
      prisma.application.findMany({ where: { userId: user.id } }),
    ]);

    const suggestions: string[] = [];
    if (!resume) {
      suggestions.push("How do I create a great resume for startups?");
      suggestions.push("Can you help me build my resume?");
    } else {
      suggestions.push("Can you review my resume and suggest improvements?");
    }
    if (startups.length === 0) {
      suggestions.push("How do I register my startup on this platform?");
      suggestions.push("What are the benefits of adding my startup?");
    } else {
      suggestions.push("How can I improve my startup profile?");
      suggestions.push("What funding options are best for my startup?");
    }
    if (applications.length === 0) {
      suggestions.push("How do I find and apply for jobs?");
      suggestions.push("What jobs are best for my skills?");
    } else {
      suggestions.push("Can you give me tips for my job applications?");
    }
    suggestions.push("What resources are available for founders?");
    suggestions.push("How can I connect with investors?");

    return NextResponse.json({ success: true, suggestions });
  } catch (error) {
    console.error('AI Mentor Suggestions Error:', error);
    return NextResponse.json({ success: false, suggestions: [] }, { status: 500 });
  }
} 