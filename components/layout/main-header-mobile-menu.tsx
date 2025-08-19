import React, { useState } from 'react';
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { useAuthRedirect } from "@/lib/utils";
import { 
  User, 
  Settings, 
  Info, 
  Newspaper, 
  LogOut,
  Home,
  Briefcase,
  Rocket,
  Handshake,
  Flame,
  BookOpen,
  Star,
  FileText,
  UserCircle,
  Globe,
  DollarSign,
  Calendar,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CoinDisplay } from "@/components/ui/coin-display";
import { useCoins } from "@/hooks/use-coins";

interface MobileMenuProps {
  onClose: () => void;
  onLogout: () => void;
}

const startupsMenuItems = [
  { 
    href: "/my-startups", 
    label: "My Startup", 
    icon: Rocket,
    description: "Manage your startup profile",
    requiresAuth: true
  },
  { 
    href: "/discover-startups", 
    label: "Discover Startups", 
    icon: Globe,
    description: "Explore innovative companies",
    requiresAuth: false
  },
  { 
    href: "/tools", 
    label: "Tools", 
    icon: Settings,
    description: "Essential tools for founders",
    requiresAuth: true
  },
  { 
    href: "/investors", 
    label: "Investors", 
    icon: DollarSign,
    description: "Connect with potential investors",
    requiresAuth: true
  },
  { 
    href: "/incubators", 
    label: "Incubators", 
    icon: Flame,
    description: "Find accelerator programs",
    requiresAuth: true
  },
  { 
    href: "/resources", 
    label: "Resources", 
    icon: BookOpen,
    description: "Guides and educational content",
    requiresAuth: true
  },
];

const jobSeekersMenuItems = [
  { 
    href: "/jobs", 
    label: "Job Board", 
    icon: Briefcase,
    description: "Browse all available positions",
    requiresAuth: false
  },
  { 
    href: "/saved-jobs", 
    label: "Saved Jobs", 
    icon: Star,
    description: "Your bookmarked opportunities",
    requiresAuth: true
  },
  { 
    href: "/my-applications", 
    label: "My Applications", 
    icon: FileText,
    description: "Track your job applications",
    requiresAuth: true
  },
  { 
    href: "/resume", 
    label: "My Resume", 
    icon: UserCircle,
    description: "Manage your professional profile",
    requiresAuth: true
  },
];

interface MobileNavItemProps {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  requiresAuth?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  description?: string;
}

const MobileNavItem: React.FC<MobileNavItemProps> = ({ 
  href, 
  onClick, 
  children,
  className = '',
  requiresAuth = false,
  icon: Icon,
  description
}) => {
  const { requireAuthHref } = useAuthRedirect();
  const finalHref = requiresAuth ? requireAuthHref(href) : href;
  
  return (
    <Link
      href={finalHref}
      className={cn(
        "flex items-center py-4 px-4 text-base font-medium hover:bg-gray-100 rounded-lg transition-colors min-h-[56px] group",
        className
      )}
      onClick={onClick}
    >
      {Icon && <Icon className="h-5 w-5 mr-3 text-gray-500 group-hover:text-gray-700" />}
      <div className="flex-1">
        <div className="font-medium text-gray-900">{children}</div>
        {description && <div className="text-sm text-gray-500 mt-0.5">{description}</div>}
      </div>
    </Link>
  );
};

const CollapsibleSection = ({
  title,
  children,
  defaultOpen = false,
  icon: Icon,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="space-y-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-4 py-3 text-left text-base font-medium text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <div className="flex items-center">
          {Icon && <Icon className="h-5 w-5 mr-3 text-gray-500" />}
          {title}
        </div>
        {isOpen ? (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronRight className="h-5 w-5 text-gray-500" />
        )}
      </button>
      {isOpen && <div className="ml-8 space-y-1">{children}</div>}
    </div>
  );
};

export default function MobileMenuContent({ onClose, onLogout }: MobileMenuProps) {
  const { user } = useAuth();
  const { balance: coinBalance } = useCoins();

  return (
    <div className="flex flex-col h-full bg-white">
      {user ? (
        <>
          {/* User Profile Section */}
          <div className="flex items-center space-x-3 p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
            <Avatar className="h-14 w-14 border-2 border-white shadow-md">
              <AvatarFallback className="bg-blue-100 text-blue-700 text-lg font-semibold">
                {user.name?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-gray-900 truncate text-lg">{user.name}</p>
              <p className="text-sm text-gray-600 truncate">{user.email}</p>
              <div className="mt-2">
                <CoinDisplay balance={coinBalance} size="sm" animated />
              </div>
            </div>
          </div>

          {/* Navigation Sections */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {/* Quick Actions - Direct Links */}
            <div className="space-y-1">
              <MobileNavItem 
                href="/dashboard" 
                onClick={onClose}
                description="Your main dashboard"
              >
                Dashboard
              </MobileNavItem>
              <MobileNavItem 
                href="/profile" 
                onClick={onClose}
                description="Manage your profile"
              >
                Profile
              </MobileNavItem>
            </div>

            {/* For Startups Dropdown */}
            <CollapsibleSection 
              title="For Startups" 
              icon={Rocket}
            >
              {startupsMenuItems.map((item) => (
                <MobileNavItem
                  key={item.href}
                  href={item.href}
                  requiresAuth={item.requiresAuth}
                  onClick={onClose}
                  description={item.description}
                >
                  {item.label}
                </MobileNavItem>
              ))}
            </CollapsibleSection>

            {/* For Job Seekers Dropdown */}
            <CollapsibleSection 
              title="For Job Seekers" 
              icon={Briefcase}
            >
              {jobSeekersMenuItems.map((item) => (
                <MobileNavItem
                  key={item.href}
                  href={item.href}
                  requiresAuth={item.requiresAuth}
                  onClick={onClose}
                  description={item.description}
                >
                  {item.label}
                </MobileNavItem>
              ))}
            </CollapsibleSection>

            {/* Static Menu Items */}
            <div className="pt-2 space-y-1">
              <MobileNavItem 
                href="/hackathons" 
                onClick={onClose}
                icon={Calendar}
                description="Discover upcoming coding events"
              >
                Hackathons
              </MobileNavItem>
              <MobileNavItem 
                href="/news" 
                onClick={onClose}
                icon={Newspaper}
                description="Latest startup news and insights"
              >
                Founder's Feed
              </MobileNavItem>
              <MobileNavItem 
                href="/about" 
                onClick={onClose}
                icon={Info}
                description="Learn more about us"
              >
                About Us
              </MobileNavItem>
            </div>
          </div>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="flex w-full items-center px-4 py-4 text-base font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors min-h-[56px]"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Sign out
            </button>
          </div>
        </>
      ) : (
        <div className="flex flex-col h-full bg-white">
          {/* Header with back button and sign in */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100"
              aria-label="Close menu"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="h-5 w-5 text-gray-700"
              >
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </button>
            <Link
              href="/login"
              className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              onClick={onClose}
            >
              Sign In
            </Link>
            <div className="w-9"></div> {/* Spacer for alignment */}
          </div>

          {/* Navigation Sections - Reordered */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {/* For Startups */}
            <CollapsibleSection 
              title="For Startups" 
              icon={Rocket}
            >
              {startupsMenuItems.map((item) => (
                <MobileNavItem
                  key={item.href}
                  href={item.href}
                  requiresAuth={item.requiresAuth}
                  onClick={onClose}
                  icon={item.icon}
                  description={item.description}
                >
                  {item.label}
                </MobileNavItem>
              ))}
            </CollapsibleSection>

            {/* For Job Seekers */}
            <CollapsibleSection 
              title="For Job Seekers" 
              icon={Briefcase}
            >
              {jobSeekersMenuItems.map((item) => (
                <MobileNavItem
                  key={item.href}
                  href={item.href}
                  requiresAuth={item.requiresAuth}
                  onClick={onClose}
                  icon={item.icon}
                  description={item.description}
                >
                  {item.label}
                </MobileNavItem>
              ))}
            </CollapsibleSection>

            {/* Quick Actions - Direct Links */}
            <div className="space-y-1 pt-2">
              <MobileNavItem 
                href="/hackathons" 
                onClick={onClose}
                icon={Calendar}
                description="Discover upcoming coding events"
              >
                Hackathons
              </MobileNavItem>
              <MobileNavItem 
                href="/reels" 
                onClick={onClose}
                icon={Calendar}
                description="Watch startup Instagram reels"
              >
                Startup Reels
              </MobileNavItem>
              <MobileNavItem 
                href="/reels" 
                onClick={onClose}
                icon={Calendar}
                description="Watch startup Instagram reels"
              >
                Startup Reels
              </MobileNavItem>
              <MobileNavItem 
                href="/news" 
                onClick={onClose}
                icon={Newspaper}
                description="Latest startup news and insights"
              >
                Founder's Feed
              </MobileNavItem>
              <MobileNavItem 
                href="/about" 
                onClick={onClose}
                icon={Info}
                description="Learn more about us"
              >
                About Us
              </MobileNavItem>
            </div>
          </div>

          {/* Legal Links */}
          <div className="p-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-2">
              {[
                { href: "/privacy", label: "Privacy Policy" },
                { href: "/terms", label: "Terms" },
                { href: "/cookies", label: "Cookies" },
                { href: "/contact", label: "Contact" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className="text-xs text-gray-600 hover:text-gray-900 py-1.5"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
