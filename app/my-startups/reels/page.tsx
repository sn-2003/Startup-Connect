'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import MainHeader from '@/components/layout/main-header';
import ReelManager from '@/components/reels/reel-manager';
import { apiClient } from '@/lib/api-client';
import { Startup } from '@/lib/types';
import { Loader2 } from 'lucide-react';

export default function MyStartupReelsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      loadStartups();
    }
  }, [user, authLoading, router]);

  const loadStartups = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getMyStartups();
      
      if (response.success && response.data) {
        setStartups(response.data);
      }
    } catch (error) {
      console.error('Error loading startups:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MainHeader />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MainHeader />
      <div className="container mx-auto px-4 py-8">
        <ReelManager startups={startups} />
      </div>
    </div>
  );
}