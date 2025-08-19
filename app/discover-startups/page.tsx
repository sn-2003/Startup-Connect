'use client';

import MainHeader from '@/components/layout/main-header';
import DiscoverStartups from '@/components/dashboard/discover-startups';

export default function DiscoverStartupsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <MainHeader />
      <div className="container mx-auto px-4 py-8">
        <DiscoverStartups />
      </div>
    </div>
  );
} 