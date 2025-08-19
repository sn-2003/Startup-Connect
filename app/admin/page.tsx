import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { NextRequest } from 'next/server';
import authOptions from '@/lib/auth-options';
import { isAdmin } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';
import { ApplicationStatus } from '@prisma/client';
import { FeaturedStartupsManager } from '@/components/admin/FeaturedStartupsManager';
import ReelManager from '@/components/reels/reel-manager';

// Add type for activity log item
interface ActivityLogItem {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  userId: string;
  createdAt: Date;
  user: {
    name: string | null;
    email: string | null;
  };
}

interface Activity {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  userId: string;
  createdAt: Date;
  user: {
    name: string | null;
    email: string | null;
  };
}


export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  // Redirect to login if not authenticated
  if (!session) {
    redirect('/login?callbackUrl=/admin');
  }
  // Check if user is admin by email
  const ADMIN_EMAILS = ['nikhil.s@startupgram.in'];
  const userEmail = session.user?.email;
  if (!userEmail || !ADMIN_EMAILS.includes(userEmail)) {
    redirect('/unauthorized');
  }

  // Fetch real data
  const [
    totalUsers,
    totalStartups,
    activeJobs,
    pendingApplications,
    recentActivity
  ] = await Promise.all([
    prisma.user.count(),
    prisma.startup.count(),
    prisma.job.count({
      where: { listed: true }
    }),
    prisma.application.count({
      where: { status: ApplicationStatus.PENDING }
    }),
    prisma.$queryRaw`
      SELECT al.*, u.name, u.email 
      FROM "activity_logs" al
      JOIN "users" u ON al."userId" = u.id
      ORDER BY al."createdAt" DESC
      LIMIT 5
    ` as Promise<ActivityLogItem[]>
  ]);

  const stats = [
    { name: 'Total Users', value: totalUsers.toString(), change: '+0%', changeType: 'neutral' },
    { name: 'Active Startups', value: totalStartups.toString(), change: '+0%', changeType: 'neutral' },
    { name: 'Open Jobs', value: activeJobs.toString(), change: '0%', changeType: 'neutral' },
    { name: 'Pending Applications', value: pendingApplications.toString(), change: '0', changeType: 'neutral' },
  ];

  return (
    <div className="space-y-8">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-sm text-gray-700">
              Overview of your application's performance and activity.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900">Overview</h2>
          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.name}
                className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
              >
                <dt className="truncate text-sm font-medium text-gray-500">
                  {stat.name}
                </dt>
                <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                  {stat.value}
                </dd>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Startups */}
      <div className="px-4 sm:px-6 lg:px-8">
        <FeaturedStartupsManager />
        </div>

        {/* Reels Admin */}
        <div className="px-4 sm:px-6 lg:px-8">
          <ReelManager />
      </div>

      {/* Recent Activity */}
      <div className="px-4 sm:px-6 lg:px-8">
        <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
        <div className="mt-4 overflow-hidden bg-white shadow sm:rounded-md">
          <ul role="list" className="divide-y divide-gray-200">
            {recentActivity.map((activity: ActivityLogItem) => (
              <li key={activity.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="truncate text-sm font-medium text-indigo-600">
                      {activity.user?.name || 'Unknown User'}
                    </p>
                    <div className="ml-2 flex flex-shrink-0">
                      <p className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                        {activity.action}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        {activity.entityType} #{activity.entityId}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <p>
                        {new Date(activity.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
