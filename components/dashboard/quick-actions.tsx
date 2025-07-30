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
import { useRouter } from 'next/navigation';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: any;
  href: string;
  color: string;
  isExternal?: boolean;
}

const quickActions: QuickAction[] = [
  {
    id: '1',
    title: 'Post a Job',
    description: 'Hire the best talent for your startup',
    icon: Plus,
    href: '/my-startups',
    color: 'bg-blue-100 text-blue-600',
    isExternal: false
  },
  {
    id: '2',
    title: 'Find Startups',
    description: 'Discover and connect with startups',
    icon: Search,
    href: '/discover-startups',
    color: 'bg-green-100 text-green-600',
    isExternal: false
  },
  {
    id: '3',
    title: 'Create Resume',
    description: 'Build a professional resume',
    icon: FileText,
    href: '/resume',
    color: 'bg-purple-100 text-purple-600',
    isExternal: false
  },
  {
    id: '4',
    title: 'Add Startup',
    description: 'List your startup on the platform',
    icon: Building2,
    href: '/my-startups',
    color: 'bg-orange-100 text-orange-600',
    isExternal: false
  },
  {
    id: '5',
    title: 'Network',
    description: 'Connect with investors',
    icon: Users,
    href: '/investors',
    color: 'bg-pink-100 text-pink-600',
    isExternal: false
  },
  {
    id: '6',
    title: 'Browse Jobs',
    description: 'Find your next opportunity',
    icon: Briefcase,
    href: '/jobs',
    color: 'bg-indigo-100 text-indigo-600',
    isExternal: false
  },
  {
    id: '7',
    title: 'Resources',
    description: 'Access startup resources',
    icon: BookOpen,
    href: '/resources',
    color: 'bg-yellow-100 text-yellow-600',
    isExternal: false
  },
  {
    id: '8',
    title: 'Analytics',
    description: 'View your startup metrics',
    icon: TrendingUp,
    href: '/my-startups',
    color: 'bg-red-100 text-red-600',
    isExternal: false
  }
];

interface QuickActionsProps {
  onTabChange?: (tab: string) => void;
}

export default function QuickActions({ onTabChange }: QuickActionsProps) {
  const router = useRouter();

  const handleActionClick = (action: QuickAction) => {
    if (action.isExternal) {
      window.open(action.href, '_blank');
    } else {
      router.push(action.href);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {quickActions.map((action) => {
        const Icon = action.icon;
        const tab = action.href.split('tab=')[1];
        return (
          <button
            key={action.id}
            onClick={() => handleActionClick(action)}
            className="w-full flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 text-left"
          >
            <div className={`p-2 rounded-lg ${action.color} mr-3`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{action.title}</h3>
              <p className="text-xs text-gray-500">{action.description}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}