'use client';

import MainHeader from '@/components/layout/main-header';
import Incubators from '@/components/dashboard/incubators';

export default function IncubatorsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <MainHeader />
      <div className="container mx-auto px-4 py-8">
        <Incubators />
      </div>
    </div>
  );
} 