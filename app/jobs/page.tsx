'use client';

import MainHeader from '@/components/layout/main-header';
import EnhancedJobBoard from '@/components/dashboard/enhanced-job-board';

export default function JobsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <MainHeader />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <EnhancedJobBoard />
      </div>
    </div>
  );
}
