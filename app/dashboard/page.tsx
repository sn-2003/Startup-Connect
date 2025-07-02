'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import DashboardLayout from '@/components/layout/dashboard-layout';
import Overview from '@/components/dashboard/overview';
import StartupModule from '@/components/dashboard/startup-module';
import JobBoard from '@/components/dashboard/job-board';
import ResumeModule from '@/components/dashboard/resume-module';
import Resources from '@/components/dashboard/resources';
import Investors from '@/components/dashboard/investors';
import SavedJobs from '@/components/dashboard/saved-jobs';
import MyApplications from '@/components/dashboard/my-applications';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview onTabChange={setActiveTab} />;
      case 'startup':
        return <StartupModule />;
      case 'jobs':
        return <JobBoard />;
      case 'resume':
        return <ResumeModule />;
      case 'resources':
        return <Resources />;
      case 'investors':
        return <Investors />;
      case 'saved-jobs':
        return <SavedJobs />;
      case 'applications':
        return <MyApplications />;
      default:
        return <Overview onTabChange={setActiveTab} />;
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </DashboardLayout>
  );
}