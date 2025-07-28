'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
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
  FileCheck,
  Settings,
  Bell,
  ChevronDown,
  Target,
  Sparkles
} from 'lucide-react';
import AiMentorChat from '@/components/ui/ai-mentor-chat';
import { AnimatePresence, motion } from 'framer-motion';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const mainNavItems = [
  { id: 'jobs', label: 'Jobs', icon: Briefcase },
  { id: 'discover', label: 'Startups', icon: Rocket },
  { id: 'investors', label: 'Investors', icon: Handshake },
  { id: 'incubators', label: 'Incubators', icon: Flame },
  { id: 'resources', label: 'Resources', icon: BookOpen },
];

const personalNavItems = [
  { id: 'saved-jobs', label: 'Saved Jobs', icon: Star },
  { id: 'resume', label: 'Resume', icon: FileText },
  { id: 'profile', label: 'Profile', icon: UserCircle },
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
        flex flex-col
        fixed top-0 left-0 z-50 h-full w-64 bg-gray-50 border-r border-gray-200 transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        {/* Logo Section */}
        <div className="px-8 py-5 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Image
              src="/logo.png"
              alt="StartupGram Logo"
              width={32}
              height={32}
              className="h-8 w-8 object-contain"
            />
            <span className="text-xl font-bold text-gray-900">StartupGram</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-6">
          {/* Main Navigation */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">MAIN</h3>
            <ul className="space-y-1">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        onTabChange(item.id);
                        setSidebarOpen(false);
                      }}
                      className={`
                        w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200 group relative
                        ${activeTab === item.id
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        }
                      `}
                    >
                      {activeTab === item.id && (
                        <div className="absolute right-0 top-0 bottom-0 w-1 bg-blue-600 rounded-l-full"></div>
                      )}
                      <Icon className={`h-5 w-5 ${activeTab === item.id ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Personal Navigation */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">PERSONAL</h3>
            <ul className="space-y-1">
              {personalNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        onTabChange(item.id);
                        setSidebarOpen(false);
                      }}
                      className={`
                        w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200 group relative
                        ${activeTab === item.id
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        }
                      `}
                    >
                      {activeTab === item.id && (
                        <div className="absolute right-0 top-0 bottom-0 w-1 bg-blue-600 rounded-l-full"></div>
                      )}
                      <Icon className={`h-5 w-5 ${activeTab === item.id ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start text-gray-700 hover:bg-gray-100">
                <Settings className="h-4 w-4 mr-3" />
                <span className="font-medium">Settings</span>
                <ChevronDown className="h-4 w-4 ml-auto" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuItem onClick={() => onTabChange('profile')}>
                <UserCircle className="mr-2 h-4 w-4" />
                My Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:ml-64 min-h-screen flex flex-col">
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
                <DropdownMenuItem onClick={() => onTabChange('profile')}>
                  <Settings className="mr-2 h-4 w-4" />
                  My Profile
                </DropdownMenuItem>
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

        {/* Footer */}
        <footer className="bg-slate-50/80 backdrop-blur-lg border-t border-slate-100 px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="text-sm text-slate-600">
              © 2025 StartupGram. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <button
                onClick={() => router.push('/privacy')}
                className="text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => router.push('/terms')}
                className="text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              >
                Terms of Service
              </button>
              <button
                onClick={() => router.push('/cookies')}
                className="text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              >
                Cookie Policy
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}