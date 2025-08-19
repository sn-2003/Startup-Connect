'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import MainHeader from '@/components/layout/main-header';
import { 
  Search, 
  Bell, 
  User, 
  LogOut, 
  TrendingUp, 
  Users, 
  Briefcase, 
  Building2, 
  BookOpen, 
  Zap,
  ArrowRight,
  ExternalLink,
  Calendar,
  Clock,
  Star,
  Plus
} from 'lucide-react';
import Link from 'next/link';

// Import components (we'll create these)
import FeaturedStartups from '@/components/dashboard/featured-startups';
import StartupNews from '@/components/dashboard/startup-news';
import AITools from '@/components/dashboard/ai-tools';
import QuickActions from '@/components/dashboard/quick-actions';
import RecentActivity from '@/components/dashboard/recent-activity';

// Tab content components
const TabContent = ({ tab }: { tab: string }) => {
  switch(tab) {
    case 'post-job':
      return (
        <div className="bg-white rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Post a Job</h2>
          <p>Post job form will go here</p>
        </div>
      );
    case 'discover':
      return (
        <div className="bg-white rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Discover Startups</h2>
          <p>Startup discovery content will go here</p>
        </div>
      );
    case 'resume':
      return (
        <div className="bg-white rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Create Resume</h2>
          <p>Resume builder will go here</p>
        </div>
      );
    case 'add-startup':
      return (
        <div className="bg-white rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Add Your Startup</h2>
          <p>Startup submission form will go here</p>
        </div>
      );
    case 'network':
      return (
        <div className="bg-white rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Network</h2>
          <p>Networking features will go here</p>
        </div>
      );
    case 'jobs':
      return (
        <div className="bg-white rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Browse Jobs</h2>
          <p>Job listings will go here</p>
        </div>
      );
    case 'resources':
      return (
        <div className="bg-white rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Resources</h2>
          <p>Resource library will go here</p>
        </div>
      );
    case 'analytics':
      return (
        <div className="bg-white rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Analytics</h2>
          <p>Analytics dashboard will go here</p>
        </div>
      );
    default:
      return null;
  }
};

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  // Update active tab when URL changes
  useEffect(() => {
    const tab = searchParams?.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Update URL without page reload
    router.push(`/dashboard?tab=${tab}`, { scroll: false });
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleSignOut = async () => {
    logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MainHeader />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name?.split(' ')[0] || 'Founder'}
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            This is your dashboard. You can access it anytime from your profile icon in the top right corner.
          </p>
        </div>

        {/* Quick Actions - Mobile Only */}
        <div className="lg:hidden mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <QuickActions onTabChange={handleTabChange} />
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            {activeTab !== 'overview' ? (
              <TabContent tab={activeTab} />
            ) : (
              <div className="space-y-8">
                {/* Default Dashboard View - Only show when no tab is selected */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Featured Startups</h2>
                    <Link href="/discover-startups" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                      View all
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                  <FeaturedStartups />
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Latest Startup News</h2>
                    <Link href="/dashboard?tab=news" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                      View all
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                  <StartupNews />
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">AI Tools for Startups</h2>
                    <Link href="/dashboard?tab=tools" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                      View all
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                  <AITools />
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions - Desktop Only */}
            <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <QuickActions onTabChange={handleTabChange} />
            </div>

            {/* Recent Activity */}
            {/*<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <RecentActivity />
            </div>*/}
          </div>
        </div>
      </main>
    </div>
  );
}
