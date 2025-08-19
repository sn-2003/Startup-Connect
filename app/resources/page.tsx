'use client';

import MainHeader from '@/components/layout/main-header';
import Resources from '@/components/dashboard/resources';

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <MainHeader />
      <div className="container mx-auto px-4 py-8">
        <Resources />
      </div>
    </div>
  );
} 