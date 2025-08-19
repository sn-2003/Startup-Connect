"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useAuthRedirect } from "@/lib/utils";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Plus,
  Rocket,
  Users,
  TrendingUp,
  Star,
  CheckCircle,
  Target,
  Lightbulb,
  Zap,
  Globe,
  Award,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Briefcase,
  BookOpen,
  Search,
  MapPin,
  Mail,
  Phone,
  MessageCircle,
  Sparkles,
  Linkedin as LinkedinIcon,
  Building2,
  ExternalLink,
  Calendar,
  DollarSign,
  Linkedin,
  Twitter,
  Instagram,
  Newspaper
} from "lucide-react";
import MainHeader from "@/components/layout/main-header";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { motion } from "framer-motion";
import Autoplay from "embla-carousel-autoplay";
import type { EmblaCarouselType } from 'embla-carousel';
import { apiClient } from "@/lib/api-client";
import AiMentorChat from "@/components/ui/ai-mentor-chat";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { SocialIcons } from '@/components/dashboard/social-icons';
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  publishedAt: string;
  category: string;
  image?: string;
  url: string;
}

interface Startup {
  id: string;
  name: string;
  description: string;
  logo: string | null;
  website: string | null;
  industry: string;
  stage: string;
  location: string | null;
  upvotes: number;
  downvotes: number;
  promotionalImages: string[];
  xUrl: string | null;
  instagramUrl: string | null;
  linkedinUrl: string | null;
  foundedDate: string | null;
  employees: number | null;
  funding: string | null;
  feedback: any[];
}

interface Tool {
  name: string;
  description: string;
  category: string;
  image: string;
  url: string;
  pricing: string;
  rating: number;
  users: string;
}

const featuredTools: Tool[] = [
  {
    name: "v0 by Vercel",
    description: "AI-powered UI generation tool",
    category: "Development",
    image: "https://logo.svgcdn.com/l/vercel-icon.svg",
    url: "https://v0.dev",
    pricing: "Free tier available",
    rating: 4.9,
    users: "50K+",
  },
  {
    name: "Bolt.new",
    description: "Full-stack web development in the browser",
    category: "Development",
    image: "/tools/bolt.jpeg",
    url: "https://bolt.new",
    pricing: "Free",
    rating: 4.8,
    users: "25K+",
  },
  {
    name: "Cursor",
    description: "AI-first code editor",
    category: "Development",
    image: "https://cursor.sh/favicon.ico",
    url: "https://cursor.sh",
    pricing: "$20/month",
    rating: 4.9,
    users: "100K+",
  },
  {
    name: "Notion",
    description: "All-in-one workspace for teams",
    category: "Productivity",
    image: "https://logo.svgcdn.com/l/notion.svg",
    url: "https://notion.so",
    pricing: "Free tier available",
    rating: 4.7,
    users: "30M+",
  },
  {
    name: "Figma",
    description: "Collaborative design platform",
    category: "Design",
    image: "https://static.figma.com/app/icon/1/favicon.ico",
    url: "https://figma.com",
    pricing: "Free tier available",
    rating: 4.8,
    users: "4M+",
  },
  {
    name: "Stripe",
    description: "Payment processing platform",
    category: "Finance",
    image: "https://logo.svgcdn.com/l/stripe.svg",
    url: "https://stripe.com",
    pricing: "2.9% + 30¢ per transaction",
    rating: 4.6,
    users: "2M+",
  },
];

function LandingPage() {
  const { user, loading } = useAuth();
  const { requireAuthHref } = useAuthRedirect();
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentToolPair, setCurrentToolPair] = useState(0);
  const [latestNews, setLatestNews] = useState<NewsItem[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loadingStartups, setLoadingStartups] = useState(true);
  const [currentStartup, setCurrentStartup] = useState(0);
  const [selectedStartup, setSelectedStartup] = useState<Startup | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const newsCarouselRef = useRef<any>(null);
  const scrollInterval = useRef<NodeJS.Timeout>();
  const router = useRouter();

  useEffect(() => {
    setIsVisible(true);

    const handleScroll = () => {
      const sections = ["hero", "features", "stats", "platform", "cta"];
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (
          element &&
          scrollPosition >= element.offsetTop &&
          scrollPosition < element.offsetTop + element.offsetHeight
        ) {
          setActiveSection(section);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentToolPair((prev) => (prev + 1) % Math.ceil(featuredTools.length / 2));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchLatestNews = async () => {
      try {
        setLoadingNews(true);
        const response = await apiClient.getNews({
          limit: 6,
          sortBy: 'latest'
        });
        if (response.success && response.data) {
          setLatestNews(response.data);
        } else {
          console.warn('News API returned no data');
          setLatestNews([]);
        }
      } catch (error) {
        console.error("Error fetching latest news:", error);
        setLatestNews([]);
      } finally {
        setLoadingNews(false);
      }
    };

    fetchLatestNews();
    const interval = setInterval(fetchLatestNews, 300000); // Fetch every 5 minutes
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchStartups = async () => {
      try {
        setLoadingStartups(true);
        // Fetch only featured startups
        const response = await fetch('/api/startups?featured=true');
        if (response.ok) {
          const data = await response.json();
          setStartups(data.data || []);
        }
      } catch (error) {
        console.error('Error fetching startups:', error);
      } finally {
        setLoadingStartups(false);
      }
    };

    // Fetch startups for all users
    fetchStartups();
  }, []);

  useEffect(() => {
    if (startups.length <= 1 || isDialogOpen) return;
    
    const scrollToNext = () => {
      setCurrentStartup(prev => (prev + 1) % startups.length);
    };

    scrollInterval.current = setInterval(scrollToNext, 5000);

    return () => {
      if (scrollInterval.current) {
        clearInterval(scrollInterval.current);
      }
    };
  }, [startups.length, isDialogOpen]);

  // Handle touch events for swiping
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      // Swipe left
      setCurrentStartup(prev => (prev + 1) % startups.length);
    } else if (touchEnd - touchStart > 50) {
      // Swipe right
      setCurrentStartup(prev => (prev - 1 + startups.length) % startups.length);
    }
  };

  // Handle scroll position
  useEffect(() => {
    if (!containerRef.current || startups.length === 0) return;
    
    const container = containerRef.current;
    const scrollPosition = (currentStartup / startups.length) * container.scrollWidth;
    
    container.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    });
  }, [currentStartup, startups.length]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  const handleGetStarted = () => {
    router.push("/register");
  };

  const handleSignIn = () => {
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MainHeader />
      
      <div className="container mx-auto px-4 py-8">
        {/* Startups Showcase */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Featured Startups</h2>
            {startups.length > 0 && (
              <Button variant="ghost" onClick={() => router.push('/discover-startups')}>
                View All Startups
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
          
          {loadingStartups ? (
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : startups.length > 0 ? (
            <div className="relative">
              <div 
                ref={containerRef}
                className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
                style={{
                  scrollSnapType: 'x mandatory',
                  WebkitOverflowScrolling: 'touch',
                  scrollBehavior: 'smooth',
                }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <div className="flex w-full flex-shrink-0">
                  {startups.map((startup, index) => (
                    <div key={startup.id} className="w-full flex-shrink-0 px-1">
                      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 h-48">
                        <CardContent className="h-full p-6">
                          <div className="flex h-full">
                            <div className="flex-shrink-0 mr-6">
                              {startup.logo ? (
                                <div className="h-20 w-20 rounded-full bg-white border-4 border-white shadow-lg overflow-hidden">
                                  <Image
                                    src={startup.logo}
                                    alt={startup.name}
                                    width={80}
                                    height={80}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="h-20 w-20 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                                  {startup.name.charAt(0).toUpperCase()}
                                </div>
                              )}
                            </div>
                            <div className="flex-1 flex flex-col">
                              <h3 className="text-xl font-semibold text-gray-900 mb-2">{startup.name}</h3>
                              <p className="text-gray-700 text-sm line-clamp-3 mb-1">
                                {startup.description}
                              </p>
                              <div className="mt-auto">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                                      {startup.industry}
                                    </Badge>
                                    <Badge variant="outline" className="ml-2">
                                      {startup.stage}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Dialog 
                                      open={isDialogOpen && selectedStartup?.id === startup.id}
                                      onOpenChange={(open) => {
                                        setIsDialogOpen(open);
                                        if (open) {
                                          setSelectedStartup(startup);
                                        } else {
                                          // Small delay to allow the dialog to close smoothly
                                          setTimeout(() => setSelectedStartup(null), 300);
                                        }
                                      }}
                                    >
                                      <DialogTrigger asChild>
                                        <Button 
                                          variant="outline" 
                                          size="sm"
                                          className="text-sm"
                                          onClick={() => setSelectedStartup(startup)}
                                        >
                                          View Details
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                          <DialogHeader>
                                            <DialogTitle className="flex items-center space-x-3">
                                              <Avatar className="h-12 w-12">
                                                <AvatarImage src={startup.logo || undefined} alt={startup.name} />
                                                <AvatarFallback>
                                                  <Building2 className="h-6 w-6" />
                                                </AvatarFallback>
                                              </Avatar>
                                              <div>
                                                <span>{startup.name}</span>
                                                <p className="text-sm text-gray-600 font-normal">{startup.industry}</p>
                                                <SocialIcons
                                                  xUrl={startup.xUrl}
                                                  instagramUrl={startup.instagramUrl}
                                                  linkedinUrl={startup.linkedinUrl}
                                                  className="mt-2"
                                                />
                                              </div>
                                            </DialogTitle>
                                            <DialogDescription>
                                              {startup.stage} • {startup.location}
                                            </DialogDescription>
                                          </DialogHeader>
                                          <div className="space-y-4">
                                            <div>
                                              <h3 className="font-medium text-gray-900 mb-2">About</h3>
                                              <p className="text-gray-700">{startup.description}</p>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                              {startup.website && (
                                                <div>
                                                  <h4 className="text-sm font-medium text-gray-500">Website</h4>
                                                  <a 
                                                    href={startup.website} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline flex items-center"
                                                  >
                                                    {startup.website.replace(/^https?:\/\//, '')}
                                                    <ExternalLink className="h-3 w-3 ml-1" />
                                                  </a>
                                                </div>
                                              )}
                                              {startup.foundedDate && (
                                                <div>
                                                  <h4 className="text-sm font-medium text-gray-500">Founded</h4>
                                                  <p>{new Date(startup.foundedDate).getFullYear()}</p>
                                                </div>
                                              )}
                                              {startup.employees && (
                                                <div>
                                                  <h4 className="text-sm font-medium text-gray-500">Team Size</h4>
                                                  <p>{startup.employees} employees</p>
                                                </div>
                                              )}
                                              {startup.funding && (
                                                <div>
                                                  <h4 className="text-sm font-medium text-gray-500">Funding</h4>
                                                  <p>{startup.funding}</p>
                                                </div>
                                              )}
                                            </div>
                                            {startup.promotionalImages && startup.promotionalImages.length > 0 && (
                                              <div className="mb-6">
                                                <Carousel className="w-full">
                                                  <CarouselContent>
                                                    {startup.promotionalImages.map((image, index) => (
                                                      <CarouselItem key={index}>
                                                        <div className="relative w-full overflow-hidden rounded-lg" style={{ aspectRatio: '16/9' }}>
                                                          <Image
                                                            src={image}
                                                            alt={`${startup.name} promotional image ${index + 1}`}
                                                            fill
                                                            className="object-contain bg-gray-50"
                                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                          />
                                                        </div>
                                                      </CarouselItem>
                                                    ))}
                                                  </CarouselContent>
                                                  {startup.promotionalImages.length > 1 && (
                                                    <>
                                                      <CarouselPrevious className="left-2" />
                                                      <CarouselNext className="right-2" />
                                                    </>
                                                  )}
                                                </Carousel>
                                              </div>
                                            )}
                                          </div>
                                        </DialogContent>
                                    </Dialog>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
              {startups.length > 1 && (
                <div className="mt-3 flex justify-center space-x-1.5">
                  {startups.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      className={`!h-1 !w-1 sm:!h-2 sm:!w-2 min-h-[2px] min-w-[2px] rounded-full transition-colors ${
                        index === currentStartup ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                      style={{ minWidth: '2px', minHeight: '2px' }}
                      onClick={() => {
                        setCurrentStartup(index);
                        if (scrollInterval.current) {
                          clearInterval(scrollInterval.current);
                          scrollInterval.current = setInterval(() => {
                            setCurrentStartup(prev => (prev + 1) % startups.length);
                          }, 5000);
                        }
                      }}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <Card className="text-center p-8 bg-gradient-to-r from-purple-50 to-blue-50">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-md">
                <Rocket className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="mt-4 text-xl font-medium text-gray-900">No startups yet</h3>
              <p className="text-gray-600">Be the first to register your startup!</p>
              <div className="mt-6">
                <Button 
                  onClick={() => router.push('/startups/new')}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your Startup
                </Button>
              </div>
            </Card>
          )}
        </motion.div>

        {/* Featured AI Tools - Responsive Layout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Featured AI Tools</h2>
            <Button variant="ghost" onClick={() => router.push("/tools")}>
              View All Tools
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          {/* Mobile/Tablet View - Horizontal Scrollable */}
          <div className="lg:hidden">
            <div className="flex space-x-4 pb-4 overflow-x-auto no-scrollbar">
              {featuredTools.map((tool, index) => (
                <motion.div
                  key={tool.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex-shrink-0 w-64"
                >
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-4 h-full">
                      <div className="flex flex-col h-full">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                            <Image 
                              src={tool.image} 
                              alt={tool.name} 
                              width={20} 
                              height={20} 
                              className="h-5 w-5 object-contain"
                            />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{tool.name}</h3>
                            <Badge variant="outline" className="text-xs mt-1">{tool.category}</Badge>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2 flex-grow">{tool.description}</p>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-3 w-3 ${i < Math.floor(tool.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                              />
                            ))}
                            <span className="text-xs text-gray-500 ml-1">({tool.users})</span>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-xs h-7"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(tool.url, '_blank');
                            }}
                          >
                            Try Now
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Desktop View - Carousel */}
          <div className="hidden lg:block">
            <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200 overflow-hidden">
              <CardContent className="p-0">
                <div className="relative h-64">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-green-600/10"></div>
                  <div className="relative z-10 w-full h-full flex items-center px-8">
                    <motion.div
                      key={currentToolPair}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="w-full"
                    >
                      <div className="grid grid-cols-2 gap-8">
                        {featuredTools
                          .slice(currentToolPair * 2, (currentToolPair * 2) + 2)
                          .map((tool) => (
                            <div key={tool.name} className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                              <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0 h-14 w-14 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                                  <Image 
                                    src={tool.image} 
                                    alt={tool.name} 
                                    width={28} 
                                    height={28} 
                                    className="h-7 w-7 object-contain"
                                  />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-gray-900">{tool.name}</h3>
                                    <Badge variant="secondary">{tool.category}</Badge>
                                  </div>
                                  <p className="text-sm text-gray-600 mt-1">{tool.description}</p>
                                  <div className="flex items-center justify-between mt-3">
                                    <div className="flex items-center space-x-1">
                                      {[...Array(5)].map((_, i) => (
                                        <Star 
                                          key={i} 
                                          className={`h-4 w-4 ${i < Math.floor(tool.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                                        />
                                      ))}
                                      <span className="text-xs text-gray-500 ml-1">({tool.users})</span>
                                    </div>
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="text-xs"
                                      onClick={() => window.open(tool.url, '_blank')}
                                    >
                                      Try Now
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </motion.div>
                  </div>
                  
                  <button 
                    onClick={() => setCurrentToolPair(currentToolPair - 1)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 p-2 rounded-full shadow-md z-20"
                    aria-label="Previous tools"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  
                  <button 
                    onClick={() => setCurrentToolPair(currentToolPair + 1)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 p-2 rounded-full shadow-md z-20"
                    aria-label="Next tools"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {Array.from({ length: Math.ceil(featuredTools.length / 2) }).map((_, index) => (
                      <button
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentToolPair ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                        onClick={() => setCurrentToolPair(index)}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Latest News Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Latest Startup News</h2>
            <Button variant="ghost" onClick={() => router.push("/news")}>
              View All News
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <Carousel
            ref={newsCarouselRef}
            opts={{
              align: "start",
              loop: true,
              dragFree: false,
              containScroll: "keepSnaps",
              dragThreshold: 10,
              watchDrag: true,
              skipSnaps: false
            }}
            plugins={[
              Autoplay({
                delay: 5000,
                stopOnInteraction: false,
                stopOnMouseEnter: true,
              }),
              {
                name: 'onSelect',
                options: {},
                init: (embla: EmblaCarouselType) => {
                  embla.on('select', () => {
                    setCurrentNewsIndex(embla.selectedScrollSnap());
                  });
                  return {}; // Return the plugin API
                },
                destroy: () => {},
              } as any, // Type assertion to handle the plugin type
            ]}
            className="w-full relative group overflow-visible"
          >
            <CarouselContent className="-ml-4 touch-pan-y">
              {loadingNews ? (
                <div className="text-center py-10">
                  <p>Loading latest news...</p>
                </div>
              ) : latestNews.length === 0 ? (
                <div className="text-center py-10">
                  <div className="text-gray-400 mb-4">
                    <BookOpen className="h-12 w-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No news available</h3>
                  <p className="text-gray-600">Check back later for the latest startup news and updates.</p>
                </div>
              ) : (
                latestNews.map((news) => (
                  <CarouselItem key={news.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                    <Card 
                      className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 opacity-100 scale-100 translate-y-0"
                      onClick={() => window.open(news.url, '_blank')}
                    >
                      <div className="aspect-video relative overflow-hidden">
                        {news.image ? (
                          <Image
                            src={news.image}
                            alt={news.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                            <BookOpen className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-black/70 text-white text-xs">{news.category}</Badge>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {news.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{news.summary}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span className="font-medium">{news.source}</span>
                          <span>{new Date(news.publishedAt).toLocaleDateString()}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))
              )}
            </CarouselContent>
            <div className="hidden md:block">
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </div>
            
            {/* Mobile Navigation Dots */}
            {!loadingNews && latestNews.length > 0 && (
              <div className="flex justify-center space-x-1.5 mt-4 md:hidden">
                {latestNews.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      if (newsCarouselRef.current) {
                        const api = newsCarouselRef.current;
                        api.scrollTo(index);
                        setCurrentNewsIndex(index);
                      }
                    }}
                    className={`!h-1 !w-1 min-h-[2px] min-w-[2px] rounded-full transition-colors ${
                      index === currentNewsIndex % latestNews.length ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                    style={{ minWidth: '2px', minHeight: '2px' }}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </Carousel>
        </motion.div>

        {/* Call to Action Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: "Register Startup",
              description: "Register your startup for free",
              href: "/my-startups",
              color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
              requiresAuth: true,
            },
            {
              title: "Discover Startups",
              description: "Explore innovative companies",
              href: "/discover-startups",
              color: "bg-green-50 border-green-200 hover:bg-green-100",
              requiresAuth: false,
            },
            {
              title: "Shorts",
              description: "Watch startup Instagram reels",
              href: "/reels",
              color: "bg-purple-50 border-purple-200 hover:bg-purple-100",
              requiresAuth: false,
            },
            {
              title: "Connect with Investors",
              description: "Find funding opportunities",
              href: "/investors",
              color: "bg-yellow-50 border-yellow-200 hover:bg-yellow-100",
              requiresAuth: true,
            },
          ].map((action, index) => {
            const href = action.requiresAuth ? requireAuthHref(action.href) : action.href;
            
            return (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Link href={href} passHref>
                  <Card
                    className={`cursor-pointer transition-all duration-300 ${action.color} hover:shadow-lg hover:scale-105`}
                  >
                    <CardContent className="p-6 text-center">
                      <h3 className="font-semibold text-lg">{action.title}</h3>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
      
      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
      <div className="h-16 md:hidden"></div> {/* Spacer for mobile bottom nav */}
    </div>
  );
}

export default LandingPage;