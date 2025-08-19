'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Building2, 
  ExternalLink, 
  ArrowRight, 
  X, 
  Linkedin, 
  Twitter, 
  Instagram, 
  Mail, 
  Globe, 
  Users,
  Calendar,
  DollarSign,
  MapPin
} from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { SocialIcons } from '@/components/dashboard/social-icons';

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
  featured: boolean;
  linkedinUrl: string | null;
  xUrl: string | null;
  instagramUrl: string | null;
  foundedDate?: string | null;
  employees?: number | null;
  funding?: string | null;
  promotionalImages?: string[];
}

export default function FeaturedStartups() {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedStartup, setSelectedStartup] = useState<Startup | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollInterval = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const fetchFeaturedStartups = async () => {
      try {
        const response = await fetch('/api/startups?featured=true');
        if (response.ok) {
          const data = await response.json();
          setStartups(data.data || []);
        }
      } catch (error) {
        console.error('Error fetching featured startups:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedStartups();
  }, []);

  // Auto-scroll functionality
  useEffect(() => {
    if (startups.length <= 1 || isDialogOpen) return;

    const scrollToNext = () => {
      setCurrentIndex(prev => (prev + 1) % startups.length);
    };

    scrollInterval.current = setInterval(scrollToNext, 3000);

    return () => {
      if (scrollInterval.current) {
        clearInterval(scrollInterval.current);
      }
    };
  }, [startups.length, isDialogOpen]);

  // Handle scroll position
  useEffect(() => {
    if (!containerRef.current || startups.length === 0) return;
    
    const container = containerRef.current;
    const scrollPosition = (currentIndex / startups.length) * container.scrollWidth;
    
    container.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    });
  }, [currentIndex, startups.length]);

  // Handle scroll events to update currentIndex on swipe
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const containerWidth = container.scrollWidth;
      const scrollPosition = container.scrollLeft + (container.clientWidth / 2);
      const newIndex = Math.round((scrollPosition / containerWidth) * (startups.length - 1));
      
      if (newIndex !== currentIndex && newIndex >= 0 && newIndex < startups.length) {
        setCurrentIndex(newIndex);
      }
    };

    // Use passive: true for better performance
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [currentIndex, startups.length]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (startups.length === 0) {
    return (
      <div className="text-center py-12">
        <Building2 className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No featured startups</h3>
        <p className="mt-1 text-sm text-gray-500">Check back later for featured startups.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Scrollable container */}
      <div 
        ref={containerRef}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
        style={{
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          scrollBehavior: 'smooth',
        }}
      >
        {startups.map((startup) => (
          <div 
            key={startup.id}
            className="flex-shrink-0 w-full snap-start"
            style={{
              scrollSnapAlign: 'start',
              flex: '0 0 100%',
            }}
          >
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    {startup.logo ? (
                      <div className="flex-shrink-0 h-16 w-16 rounded-lg bg-white border border-gray-200 overflow-hidden">
                        <Image
                          src={startup.logo}
                          alt={`${startup.name} logo`}
                          width={64}
                          height={64}
                          className="h-full w-full object-contain p-1"
                        />
                      </div>
                    ) : (
                      <div className="flex-shrink-0 flex items-center justify-center h-16 w-16 rounded-lg bg-gray-100">
                        <Building2 className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{startup.name}</h3>
                      <p className="text-sm text-gray-500">{startup.industry}</p>
                      {startup.location && (
                        <p className="text-sm text-gray-500">{startup.location}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {startup.website && (
                      <a
                        href={startup.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-gray-500"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </div>

                <p className="mt-4 text-sm text-gray-600 line-clamp-3">
                  {startup.description}
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {startup.stage}
                    </span>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="text-green-600 font-medium">{startup.upvotes}</span>
                      <span className="mx-1">•</span>
                      <span className="text-red-600 font-medium">{startup.downvotes}</span>
                    </div>
                  </div>
                  <Dialog
                    open={isDialogOpen && selectedStartup?.id === startup.id}
                    onOpenChange={(open) => {
                      setIsDialogOpen(open);
                      if (open) {
                        setSelectedStartup(startup);
                      } else {
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
        ))}
      </div>

      {/* Navigation Dots */}
      {startups.length > 1 && (
        <div className="mt-3 flex justify-center space-x-1.5">
          {startups.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`!h-1 !w-1 sm:!h-1.5 sm:!w-1.5 min-h-[2px] min-w-[2px] rounded-full transition-colors ${
                index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
              }`}
              style={{ minWidth: '2px', minHeight: '2px' }}
              onClick={() => {
                setCurrentIndex(index);
                if (scrollInterval.current) {
                  clearInterval(scrollInterval.current);
                  scrollInterval.current = setInterval(() => {
                    setCurrentIndex(prev => (prev + 1) % startups.length);
                  }, 3000);
                }
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
