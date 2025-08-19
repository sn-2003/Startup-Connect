'use client';

import MainHeader from '@/components/layout/main-header';
import StartupModule from '@/components/dashboard/startup-module';

export default function MyStartupsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <MainHeader />
      <div className="container mx-auto px-4 py-8">
        <StartupModule />
      </div>
    </div>
  );
} 