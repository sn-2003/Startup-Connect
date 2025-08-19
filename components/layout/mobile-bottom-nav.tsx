'use client';

import { Home, Compass, PlusSquare, User, Video } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function MobileBottomNav() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden">
      <div className="flex justify-around items-center h-16">
        <Link 
          href="/" 
          className={`flex flex-col items-center justify-center flex-1 h-full ${isActive('/') ? 'text-blue-600' : 'text-gray-600'}`}
        >
          <Home className="h-5 w-5" />
          <span className="text-xs mt-1">Home</span>
        </Link>
        
        <Link 
          href="/discover-startups" 
          className={`flex flex-col items-center justify-center flex-1 h-full ${pathname.startsWith('/discover-startups') ? 'text-blue-600' : 'text-gray-600'}`}
        >
          <Compass className="h-5 w-5" />
          <span className="text-xs mt-1">Discover</span>
        </Link>
        
        <Link 
          href="/reels" 
          className={`flex flex-col items-center justify-center flex-1 h-full ${pathname.startsWith('/reels') ? 'text-blue-600' : 'text-gray-600'}`}
        >
          <Video className="h-5 w-5" />
          <span className="text-xs mt-1">Shorts</span>
        </Link>
        
        <Link 
          href="/jobs" 
          className={`flex flex-col items-center justify-center flex-1 h-full ${pathname.startsWith('/jobs') ? 'text-blue-600' : 'text-gray-600'}`}
        >
          <PlusSquare className="h-5 w-5" />
          <span className="text-xs mt-1">Job board</span>
        </Link>
        
        <Link 
          href="/dashboard" 
          className={`flex flex-col items-center justify-center flex-1 h-full ${pathname.startsWith('/dashboard') ? 'text-blue-600' : 'text-gray-600'}`}
        >
          <User className="h-5 w-5" />
          <span className="text-xs mt-1">Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
