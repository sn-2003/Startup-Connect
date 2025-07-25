'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/use-auth';
import Image from 'next/image';
import { 
  Home, 
  Building2, 
  Briefcase, 
  FileText, 
  BookOpen, 
  Users, 
  Menu,
  X,
  LogOut,
  Rocket,
  Search,
  Bookmark,
  Send,
  Info,
  UserCircle,
  Star,
  Globe,
  Handshake,
  Flame,
  ClipboardList,
  Layers,
  Heart,
  Compass,
  Lightbulb,
  Award,
  TrendingUp,
  UsersRound,
  LayoutGrid,
  FileCheck
} from 'lucide-react';
import AiMentorChat from '@/components/ui/ai-mentor-chat';
import { AnimatePresence, motion } from 'framer-motion';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const sidebarItems = [
  { id: 'jobs', label: 'Job Board', icon: Briefcase },
  { id: 'saved-jobs', label: 'Saved Jobs', icon: Star },
  { id: 'resume', label: 'My Resume', icon: UserCircle },
  { id: 'resources', label: 'Resources', icon: Layers },
  { id: 'investors', label: 'Investors', icon: Handshake },
  { id: 'incubators', label: 'Incubators', icon: Flame },
  { id: 'discover', label: 'Discover Startups', icon: Globe },
];

export default function DashboardLayout({ children, activeTab, onTabChange }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleStartupsDiscovery = () => {
    router.push('/startups');
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-50 via-blue-50 to-gray-100">
      {/* AI Mentor Chat Widget */}
      <AiMentorChat />
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        flex flex-col items-center
        fixed top-0 left-0 z-50 h-full w-56 bg-slate-50/80 backdrop-blur-lg border-r border-slate-100 shadow-2xl rounded-tr-3xl rounded-br-3xl transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="flex flex-col items-center w-full pt-4 pb-2 px-2 border-b border-slate-100 mb-2">
          <Image src="/logo.png" alt="StartupGram Logo" width={40} height={40} className="h-10 w-10 object-contain mb-1" priority />
          <span className="text-xl font-bold text-gray-900">StartupGram</span>
        </div>
        <nav className="p-2 w-full flex-1">
          <ul className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      onTabChange(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`
                      w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200
                      ${activeTab === item.id
                        ? 'bg-blue-200/90 text-blue-900 shadow-lg scale-[1.04]'
                        : 'text-gray-700 hover:bg-blue-100/70 hover:text-blue-800 hover:scale-[1.04]'
                      }
                    `}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:ml-56 min-h-screen flex flex-col">
        {/* Header */}
        <header className="bg-slate-50/80 backdrop-blur-lg border-b border-slate-100 px-4 py-4 shadow-md transition-all duration-200 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline">{user?.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {/* Right-aligned nav buttons */}
          <div className="flex items-center space-x-2 ml-auto">
            <Button
              variant={activeTab === 'overview' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => onTabChange('overview')}
              className="flex items-center transition-all duration-200"
              aria-label="Overview"
            >
              <Home className="h-5 w-5" />
            </Button>
            <Button
              variant={activeTab === 'startup' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => onTabChange('startup')}
              className="flex items-center space-x-2 transition-all duration-200"
            >
              <Rocket className="h-4 w-4" />
              <span className="hidden sm:inline">My Startups</span>
            </Button>
            <Button
              variant={activeTab === 'applications' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => onTabChange('applications')}
              className="flex items-center space-x-2 transition-all duration-200"
            >
              <ClipboardList className="h-4 w-4" />
              <span className="hidden sm:inline">My Applications</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/about')}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium transition-all duration-200"
            >
              <Info className="h-4 w-4" />
              <span className="hidden sm:inline">About Us</span>
            </Button>
          </div>
        </header>


        {/* Page content */}
        <main className="flex-1 p-6 bg-gradient-to-br from-slate-50/60 via-white/80 to-gray-100/80 transition-colors duration-300">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}