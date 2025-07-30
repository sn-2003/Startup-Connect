'use client';

import { 
  Plus, 
  Search, 
  FileText, 
  Building2, 
  Users, 
  Briefcase,
  BookOpen,
  TrendingUp,
  MessageSquare,
  Calendar
} from 'lucide-react';
import Link from 'next/link';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: any;
  href: string;
  color: string;
}

const quickActions: QuickAction[] = [
  {
    id: '1',
    title: 'Post a Job',
    description: 'Hire the best talent for your startup',
    icon: Plus,
    href: '/dashboard?tab=post-job',
    color: 'bg-blue-100 text-blue-600'
  },
  {
    id: '2',
    title: 'Find Startups',
    description: 'Discover and connect with startups',
    icon: Search,
    href: '/dashboard?tab=discover',
    color: 'bg-green-100 text-green-600'
  },
  {
    id: '3',
    title: 'Create Resume',
    description: 'Build a professional resume',
    icon: FileText,
    href: '/dashboard?tab=resume',
    color: 'bg-purple-100 text-purple-600'
  },
  {
    id: '4',
    title: 'Add Startup',
    description: 'List your startup on the platform',
    icon: Building2,
    href: '/dashboard?tab=add-startup',
    color: 'bg-orange-100 text-orange-600'
  },
  {
    id: '5',
    title: 'Network',
    description: 'Connect with other founders',
    icon: Users,
    href: '/dashboard?tab=network',
    color: 'bg-pink-100 text-pink-600'
  },
  {
    id: '6',
    title: 'Browse Jobs',
    description: 'Find your next opportunity',
    icon: Briefcase,
    href: '/dashboard?tab=jobs',
    color: 'bg-indigo-100 text-indigo-600'
  },
  {
    id: '7',
    title: 'Resources',
    description: 'Access startup resources',
    icon: BookOpen,
    href: '/dashboard?tab=resources',
    color: 'bg-yellow-100 text-yellow-600'
  },
  {
    id: '8',
    title: 'Analytics',
    description: 'View your startup metrics',
    icon: TrendingUp,
    href: '/dashboard?tab=analytics',
    color: 'bg-red-100 text-red-600'
  }
];

export default function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {quickActions.map((action) => {
        const Icon = action.icon;
        return (
          <Link
            key={action.id}
            href={action.href}
            className="group p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200"
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${action.color} group-hover:scale-110 transition-transform`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {action.title}
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  {action.description}
                </p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
} 