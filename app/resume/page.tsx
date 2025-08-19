'use client';

import MainHeader from '@/components/layout/main-header';
import ResumePdfModule from '@/components/dashboard/resume-pdf-module';

export default function ResumePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <MainHeader />
      <div className="container mx-auto px-4 py-8">
        <ResumePdfModule />
      </div>
    </div>
  );
} 