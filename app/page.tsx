'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [hasVisitedBefore, setHasVisitedBefore] = useState<boolean | null>(null);

  useEffect(() => {
    router.prefetch('/landing');
    router.prefetch('/dashboard');
    router.prefetch('/login');
  }, [router]);

  useEffect(() => {
    if (!loading) {
      // Check for session cookies
      const hasSessionCookie = document.cookie.includes('next-auth.session-token') || 
                              document.cookie.includes('__Secure-next-auth.session-token');
      
      // Check for localStorage (backup method)
      const hasLocalStorage = localStorage.getItem('StartupGram-visited') === 'true';
      
      const visitedBefore = hasLocalStorage;
      setHasVisitedBefore(visitedBefore);

      if (user) {
        // User is authenticated, go to dashboard
        router.push('/dashboard');
      } else if (hasSessionCookie) {
        // User has session cookie but not authenticated (likely logged out), go to login
        router.push('/login');
      } else {
        // First-time visitor OR user who visited but never authenticated, show landing page
        localStorage.setItem('StartupGram-visited', 'true');
        router.push('/landing');
      }
    }
  }, [user, loading, router]);

  if (loading || hasVisitedBefore === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return null;
}