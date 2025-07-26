'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import DashboardLayout from '@/components/layout/dashboard-layout';
import Overview from '@/components/dashboard/overview';
import StartupModule from '@/components/dashboard/startup-module';
import JobBoard from '@/components/dashboard/job-board';
import ResumePdfModule from '@/components/dashboard/resume-pdf-module';
import Resources from '@/components/dashboard/resources';
import Investors from '@/components/dashboard/investors';
import SavedJobs from '@/components/dashboard/saved-jobs';
import MyApplications from '@/components/dashboard/my-applications';
import Incubators from '@/components/dashboard/incubators';
import DiscoverStartups from '@/components/dashboard/discover-startups';
import { useSearchParams } from 'next/navigation';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // List of valid tab ids
  const validTabs = [
    'overview',
    'startup',
    'jobs',
    'resume',
    'resources',
    'investors',
    'incubators',
    'saved-jobs',
    'applications',
    'discover', // Add discover tab
  ];

  // Get tab from query param, fallback to 'overview' if not valid
  const tabParam = searchParams.get('tab');
  const initialTab = tabParam && validTabs.includes(tabParam) ? tabParam : 'overview';

  const [activeTab, setActiveTab] = useState(initialTab);

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
        return <ResumePdfModule />;
      case 'resources':
        return <Resources />;
      case 'investors':
        return <Investors />;
      case 'incubators':
        return <Incubators />;
      case 'saved-jobs':
        return <SavedJobs />;
      case 'applications':
        return <MyApplications />;
      case 'discover':
        return <DiscoverStartups />;
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