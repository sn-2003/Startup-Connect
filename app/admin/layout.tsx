import { ReactNode } from 'react';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import authOptions from '@/lib/auth-options';
import AdminNav from '@/components/admin/AdminNav';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);
  
  // Redirect to login if not authenticated
  if (!session) {
    redirect('/login?callbackUrl=/admin');
  }
  
  // Check if user is admin (replace with your admin email)
  const isAdmin = session.user?.email === 'nikhil.s@startupgram.in';
  
  if (!isAdmin) {
    redirect('/unauthorized');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/admin" className="text-xl font-semibold text-gray-900">
            Admin Panel
          </Link>
          <div className="flex items-center space-x-4">
            <Link 
              href="/" 
              className="text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              Back to Site
            </Link>
            <div className="h-8 w-px bg-gray-200" />
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">
                  {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700">
                {session.user?.name || 'Admin'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white p-4 rounded-lg shadow">
              <AdminNav />
            </div>
          </div>
          
          {/* Page content */}
          <main className="flex-1">
            <div className="bg-white rounded-lg shadow p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
