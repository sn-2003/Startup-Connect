"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { useAuth } from "@/hooks/use-auth"
import { useAuthRedirect } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { Menu, LogOut, User, Settings, Home, ChevronDown, Info, Newspaper, Calendar } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import MobileMenuContent from "./main-header-mobile-menu"
import { CoinDisplay } from "@/components/ui/coin-display"
import { useCoins } from "@/hooks/use-coins"

const startupsMenuItems = [
  { 
    href: "/my-startups", 
    label: "My Startup", 
    description: "Manage your startup profile and jobs",
    requiresAuth: true
  },
  { 
    href: "/discover-startups", 
    label: "Discover Startups", 
    description: "Explore innovative companies",
    requiresAuth: false
  },
  { 
    href: "/tools", 
    label: "Tools", 
    description: "Essential tools for founders",
    requiresAuth: true
  },
  { 
    href: "/investors", 
    label: "Investors", 
    description: "Connect with potential investors",
    requiresAuth: true
  },
  { 
    href: "/incubators", 
    label: "Incubators", 
    description: "Find accelerator programs",
    requiresAuth: true
  },
  { 
    href: "/resources", 
    label: "Resources", 
    description: "Guides and educational content",
    requiresAuth: true
  },
]

const hackathonsMenuItems = [
  { href: "/hackathons", label: "Upcoming Hackathons", description: "Discover upcoming coding events" },
]

const jobSeekersMenuItems = [
  { 
    href: "/jobs", 
    label: "Job Board", 
    description: "Browse all available positions",
    requiresAuth: false
  },
  { 
    href: "/saved-jobs", 
    label: "Saved Jobs", 
    description: "Your bookmarked opportunities",
    requiresAuth: true
  },
  { 
    href: "/my-applications", 
    label: "My Applications", 
    description: "Track your job applications",
    requiresAuth: true
  },
  { 
    href: "/resume", 
    label: "My Resume", 
    description: "Manage your professional profile",
    requiresAuth: true
  },
]

function MainHeader() {
  const { user, logout } = useAuth()
  const { requireAuthHref } = useAuthRedirect()
  const { balance: coinBalance } = useCoins()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const ListItem = ({
    className,
    title,
    children,
    href,
    requiresAuth = false,
    ...props
  }: {
    className?: string;
    title: string;
    children: React.ReactNode;
    href: string;
    requiresAuth?: boolean;
  }) => {
    const finalHref = requiresAuth ? requireAuthHref(href) : href;
    
    return (
      <li>
        <NavigationMenuLink asChild>
          <Link
            href={finalHref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          </Link>
        </NavigationMenuLink>
      </li>
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 text-white">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/logo.png" alt="StartupGram" width={32} height={32} className="h-8 w-8" />
            <span className="text-lg sm:text-xl font-bold text-white">StartupGram</span>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList className="space-x-1">
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-xs sm:text-sm font-medium bg-white/10 text-white hover:bg-white/40 hover:text-black transition-colors duration-200 h-9 px-3">
                  For Startups
                </NavigationMenuTrigger>
                <NavigationMenuContent className="rounded-lg overflow-hidden">
                  <ul className="grid w-[300px] sm:w-[400px] gap-2 p-3 md:w-[500px] md:grid-cols-2 lg:w-[600px] md:p-4">
                    {startupsMenuItems.map((item) => (
                      <ListItem 
                        key={item.href} 
                        title={item.label} 
                        href={item.href}
                        requiresAuth={item.requiresAuth}
                        className="hover:bg-gray-50 rounded-md"
                      >
                        {item.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-xs sm:text-sm font-medium bg-white/10 text-white hover:bg-white/40 hover:text-black transition-colors duration-200 h-9 px-3">
                  For Job Seekers
                </NavigationMenuTrigger>
                <NavigationMenuContent className="rounded-lg overflow-hidden">
                  <ul className="grid w-[300px] sm:w-[400px] gap-2 p-3 md:w-[500px] md:grid-cols-2 lg:w-[600px] md:p-4">
                    {jobSeekersMenuItems.map((item) => (
                      <ListItem 
                        key={item.href} 
                        title={item.label} 
                        href={item.href}
                        requiresAuth={item.requiresAuth}
                        className="hover:bg-gray-50 rounded-md"
                      >
                        {item.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <Link href="/hackathons" legacyBehavior passHref>
                  <NavigationMenuLink className="
                    group inline-flex items-center h-10 w-max justify-center rounded-md 
                    bg-white/10 px-4 py-2 text-sm font-medium text-white 
                    hover:bg-white/50 hover:backdrop-blur-sm hover:text-black 
                    focus:bg-white/50 focus:backdrop-blur-sm focus:text-black 
                    data-[active]:bg-white/50 data-[active]:backdrop-blur-sm data-[active]:text-black 
                    transition-colors duration-200 focus:outline-none
                  ">
                    Hackathons
                    <span className="ml-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-2 py-0.5 rounded-full shadow-[0_0_10px_rgba(255,193,7,0.8)]">
                      New
                    </span>
                  </NavigationMenuLink> 
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <Link href="/news" legacyBehavior passHref>
                  <NavigationMenuLink className="
                    group inline-flex h-10 w-max items-center justify-center rounded-md 
                    bg-white/10 px-4 py-2 text-sm font-medium text-white 
                    hover:bg-white/50 hover:backdrop-blur-sm hover:text-black 
                    focus:bg-white/50 focus:backdrop-blur-sm focus:text-black 
                    data-[active]:bg-white/50 data-[active]:backdrop-blur-sm data-[active]:text-black 
                    transition-colors duration-200 focus:outline-none
                  ">
                    Founder Feed
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <Link href="/reels" legacyBehavior passHref>
                  <NavigationMenuLink className="
                    group inline-flex items-center h-10 w-max justify-center rounded-md 
                    bg-white/10 px-4 py-2 text-sm font-medium text-white 
                    hover:bg-white/50 hover:backdrop-blur-sm hover:text-black 
                    focus:bg-white/50 focus:backdrop-blur-sm focus:text-black 
                    data-[active]:bg-white/50 data-[active]:backdrop-blur-sm data-[active]:text-black 
                    transition-colors duration-200 focus:outline-none
                  ">
                    Shorts
                    <span className="ml-2 bg-gradient-to-r from-purple-400 to-pink-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.8)]">
                      New
                    </span>
                  </NavigationMenuLink> 
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Right Side - User Menu / Auth Buttons */}
          <div className="flex items-center space-x-2">
            {user ? (
              <>
                {/* Mobile Menu Button - Only show on mobile */}
                <div className="md:hidden flex items-center space-x-2">
                  {/* Hackathons Link */}
                  <Link 
                    href="/hackathons" 
                    className="relative flex items-center px-3 py-2 text-sm font-medium text-white hover:bg-white/20 rounded-md transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="text-sm">Hackathons</span>
                    <span className="ml-1.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      New
                    </span>
                  </Link>
                  
                  <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                    <SheetTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="p-2"
                        aria-label="Toggle menu"
                      >
                        <Menu className="h-6 w-6" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent 
                      side="right" 
                      className="w-[85vw] max-w-sm p-0 [&>button]:hidden"
                    >
                      <MobileMenuContent
                        onClose={() => setMobileMenuOpen(false)}
                        onLogout={handleLogout}
                      />
                    </SheetContent>
                  </Sheet>
                </div>

                {/* Desktop User Menu - Hidden on mobile */}
                <div className="hidden md:block">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="default" className="flex items-center space-x-2 px-2 bg-white/80 hover:bg-white/40">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-blue-100 text-blue-700">
                            {user.name?.charAt(0)?.toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <CoinDisplay balance={coinBalance} size="sm" className="bg-yellow-100/80 text-yellow-800" />
                        <ChevronDown className="h-4 w-4 text-black" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{user.name}</p>
                          <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => router.push("/profile")}>
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                        <Settings className="mr-2 h-4 w-4" />
                        Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push("/about")}>
                        <Info className="mr-2 h-4 w-4" />
                        About Us
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" onClick={() => router.push("/about")} className="hidden sm:inline-flex">
                  About Us
                </Button>
                <Button onClick={() => router.push("/login")} className="hidden sm:inline-flex">
                  Sign up
                </Button>
                
                {/* Mobile Menu Button for non-authenticated users */}
                <div className="md:hidden flex items-center space-x-2">
                  {/* Hackathons Link */}
                  <Link 
                    href="/hackathons" 
                    className="relative flex items-center px-3 py-2 text-sm font-medium text-white hover:bg-white/20 rounded-md transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="text-sm">Hackathons</span>
                    <span className="ml-1.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      New
                    </span>
                  </Link>
                  
                  <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                    <SheetTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="p-2"
                        aria-label="Toggle menu"
                      >
                        <Menu className="h-6 w-6" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent 
                      side="right" 
                      className="w-[85vw] max-w-sm p-0 [&>button]:hidden"
                    >
                      <MobileMenuContent
                        onClose={() => setMobileMenuOpen(false)}
                        onLogout={handleLogout}
                      />
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default MainHeader;
