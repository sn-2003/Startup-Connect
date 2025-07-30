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
import Image from "next/image"
import Link from "next/link"
import { Menu, LogOut, User, Settings, Home, Bell, ChevronDown, Info } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const startupsMenuItems = [
  { href: "/my-startups", label: "My Startup", description: "Manage your startup profile and jobs" },
  { href: "/discover-startups", label: "Discover Startups", description: "Explore innovative companies" },
  { href: "/tools", label: "Tools", description: "Essential tools for founders" },
  { href: "/investors", label: "Investors", description: "Connect with potential investors" },
  { href: "/incubators", label: "Incubators", description: "Find accelerator programs" },
  { href: "/resources", label: "Resources", description: "Guides and educational content" },
]

const jobSeekersMenuItems = [
  { href: "/jobs", label: "Job Board", description: "Browse all available positions" },
  { href: "/saved-jobs", label: "Saved Jobs", description: "Your bookmarked opportunities" },
  { href: "/my-applications", label: "My Applications", description: "Track your job applications" },
  { href: "/resume", label: "My Resume", description: "Manage your professional profile" },
]

export default function MainHeader() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/logo.png" alt="StartupGram" width={32} height={32} className="h-8 w-8" />
            <span className="text-xl font-bold text-gray-900">StartupGram</span>
          </Link>

          {/* Desktop Navigation */}
          {user && (
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm font-medium">For Startups</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {startupsMenuItems.map((item) => (
                        <ListItem key={item.href} title={item.label} href={item.href}>
                          {item.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm font-medium">For Job Seekers</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {jobSeekersMenuItems.map((item) => (
                        <ListItem key={item.href} title={item.label} href={item.href}>
                          {item.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/news" legacyBehavior passHref>
                    <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                      Founder Feed
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          )}

          {/* Simple navigation for non-logged in users */}
          {!user && (
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/jobs" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                Jobs
              </Link>
              <Link
                href="/startups"
                className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Startups
              </Link>
              <Link
                href="/investors"
                className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Investors
              </Link>
              <Link
                href="/news"
                className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                News
              </Link>
            </nav>
          )}

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Home */}
                <Button variant="ghost" size="sm" className="hidden md:flex" onClick={() => router.push("/")}>
                  <Home className="h-4 w-4" />
                </Button>

                {/* Notifications */}
                <Button variant="ghost" size="sm" className="hidden md:flex relative">
                  <Bell className="h-4 w-4" />
                  <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2 px-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-blue-100 text-blue-700">
                          {user.name?.charAt(0)?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <ChevronDown className="h-4 w-4 text-gray-500" />
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
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" onClick={() => router.push("/login")}>
                  Sign in
                </Button>
                <Button onClick={() => router.push("/register")}>Sign up</Button>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-4 mt-8">
                  {user ? (
                    <>
                      <div className="space-y-2">
                        <h3 className="font-semibold text-lg">For Startups</h3>
                        {startupsMenuItems.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="block text-sm text-gray-600 hover:text-gray-900 pl-4"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-semibold text-lg">For Job Seekers</h3>
                        {jobSeekersMenuItems.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="block text-sm text-gray-600 hover:text-gray-900 pl-4"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                      <Link
                        href="/news"
                        className="text-lg font-medium text-gray-700 hover:text-gray-900"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Founder Feed
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/jobs"
                        className="text-lg font-medium text-gray-700 hover:text-gray-900"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Jobs
                      </Link>
                      <Link
                        href="/startups"
                        className="text-lg font-medium text-gray-700 hover:text-gray-900"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Startups
                      </Link>
                      <Link
                        href="/investors"
                        className="text-lg font-medium text-gray-700 hover:text-gray-900"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Investors
                      </Link>
                      <Link
                        href="/news"
                        className="text-lg font-medium text-gray-700 hover:text-gray-900"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        News
                      </Link>
                      <Link
                        href="/about"
                        className="text-lg font-medium text-gray-700 hover:text-gray-900"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        About Us
                      </Link>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}

const ListItem = ({
  className,
  title,
  children,
  href,
  ...props
}: {
  className?: string
  title: string
  children: React.ReactNode
  href: string
}) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
} 