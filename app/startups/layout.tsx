'use client';

import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/dashboard-layout';

export default function StartupsLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  // When a sidebar tab is clicked, navigate to the corresponding dashboard tab
  const handleTabChange = (tab: string) => {
    if (tab === 'overview') {
      router.push('/dashboard');
    } else {
      router.push(`/dashboard?tab=${tab}`);
    }
  };

  return (
    <DashboardLayout activeTab="discover" onTabChange={handleTabChange}>
      {children}
    </DashboardLayout>
  );
}