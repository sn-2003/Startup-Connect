'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  Star
} from 'lucide-react';
import Link from 'next/link';

// Import components (we'll create these)
import FounderInsights from '@/components/dashboard/founder-insights';
import StartupNews from '@/components/dashboard/startup-news';
import AITools from '@/components/dashboard/ai-tools';
import QuickActions from '@/components/dashboard/quick-actions';
import RecentActivity from '@/components/dashboard/recent-activity';

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([]);

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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name?.split(' ')[0] || 'Founder'}
          </h1>
          <p className="text-gray-600">
            Stay ahead with the latest startup insights, tools, and opportunities
          </p>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Founder Insights Carousel */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Founder Insights</h2>
                <Link href="/dashboard?tab=insights" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                  View all
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
              <FounderInsights />
            </div>

            {/* Startup News */}
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

            {/* AI Tools for Startups */}
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

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <QuickActions />
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