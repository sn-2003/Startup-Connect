'use client';

import MainHeader from '@/components/layout/main-header';
import UserSettings from '@/components/dashboard/user-settings';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <MainHeader />
      <div className="container mx-auto px-4 py-8">
        <UserSettings />
      </div>
    </div>
  );
} 