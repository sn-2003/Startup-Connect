'use client';

import { 
  Eye, 
  Heart, 
  MessageSquare, 
  Briefcase, 
  Building2, 
  FileText,
  Clock
} from 'lucide-react';

interface Activity {
  id: string;
  type: 'view' | 'like' | 'comment' | 'application' | 'startup' | 'resume';
  title: string;
  description: string;
  time: string;
  icon: any;
  color: string;
}

const recentActivities: Activity[] = [
  {
    id: '1',
    type: 'view',
    title: 'Viewed your startup profile',
    description: 'TechCorp Inc. viewed your startup "InnovateAI"',
    time: '2 hours ago',
    icon: Eye,
    color: 'text-blue-600'
  },
  {
    id: '2',
    type: 'like',
    title: 'Liked your job posting',
    description: 'Sarah Johnson liked your "Senior Developer" position',
    time: '4 hours ago',
    icon: Heart,
    color: 'text-red-600'
  },
  {
    id: '3',
    type: 'application',
    title: 'New job application',
    description: 'Received application for "Product Manager" role',
    time: '6 hours ago',
    icon: Briefcase,
    color: 'text-green-600'
  },
  {
    id: '4',
    type: 'comment',
    title: 'New comment on your post',
    description: 'Alex Chen commented on your startup announcement',
    time: '1 day ago',
    icon: MessageSquare,
    color: 'text-purple-600'
  },
  {
    id: '5',
    type: 'startup',
    title: 'Startup profile updated',
    description: 'Your startup "InnovateAI" profile was updated',
    time: '2 days ago',
    icon: Building2,
    color: 'text-orange-600'
  },
  {
    id: '6',
    type: 'resume',
    title: 'Resume viewed',
    description: 'StartupXYZ viewed your resume',
    time: '3 days ago',
    icon: FileText,
    color: 'text-indigo-600'
  }
];

export default function RecentActivity() {
  return (
    <div className="space-y-4">
      {recentActivities.map((activity) => {
        const Icon = activity.icon;
        return (
          <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className={`flex-shrink-0 p-2 rounded-lg bg-gray-100 ${activity.color}`}>
              <Icon className="h-4 w-4" />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">
                {activity.title}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                {activity.description}
              </p>
              <div className="flex items-center mt-2 text-xs text-gray-500">
                <Clock className="h-3 w-3 mr-1" />
                <span>{activity.time}</span>
              </div>
            </div>
          </div>
        );
      })}
      
      {/* View All Activity Button */}
      <div className="pt-2">
        <button className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium">
          View all activity
        </button>
      </div>
    </div>
  );
} 