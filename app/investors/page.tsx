'use client';

import MainHeader from '@/components/layout/main-header';
import Investors from '@/components/dashboard/investors';

export default function InvestorsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <MainHeader />
      <div className="container mx-auto px-4 py-8">
        <Investors />
      </div>
    </div>
  );
} 