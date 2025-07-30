'use client';

import MainHeader from '@/components/layout/main-header';
import JobBoard from '@/components/dashboard/job-board';

export default function JobsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <MainHeader />
      <div className="container mx-auto px-4 py-8">
        <JobBoard />
      </div>
    </div>
  );
} 