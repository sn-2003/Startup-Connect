import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth-options';

export const isAdmin = async (req: NextRequest) => {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  
  // Replace with your admin email or fetch from database
  const ADMIN_EMAILS = ['nikhil.s@startupgram.in'];
  
  return user?.email && ADMIN_EMAILS.includes(user.email);
};

export const adminRouteHandler = async (req: NextRequest) => {
  const isUserAdmin = await isAdmin(req);
  
  if (!isUserAdmin) {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }
  
  return NextResponse.next();
};
