'use client';

import MainHeader from '@/components/layout/main-header';
import SavedJobs from '@/components/dashboard/saved-jobs';

export default function SavedJobsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <MainHeader />
      <div className="container mx-auto px-4 py-8">
        <SavedJobs />
      </div>
    </div>
  );
} 