'use client';

import MainHeader from '@/components/layout/main-header';
import MyApplications from '@/components/dashboard/my-applications';

export default function MyApplicationsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <MainHeader />
      <div className="container mx-auto px-4 py-8">
        <MyApplications />
      </div>
    </div>
  );
} 