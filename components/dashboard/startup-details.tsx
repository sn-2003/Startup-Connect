'use client';

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Building2, 
  MapPin, 
  Users, 
  ThumbsUp, 
  ThumbsDown, 
  MessageCircle,
  ExternalLink,
  Briefcase,
  Calendar
} from 'lucide-react';
import { SocialIcons } from './social-icons';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselApi,
} from '@/components/ui/carousel';

interface StartupPromoCarouselProps {
  images: string[];
  contain?: boolean;
}

function StartupPromoCarousel({ images, contain = false }: StartupPromoCarouselProps) {
  const [carouselApi, setCarouselApi] = React.useState<CarouselApi | null>(null);
  const slideshowInterval = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    if (!carouselApi) return;
    slideshowInterval.current = setInterval(() => {
      if (carouselApi) {
        if (carouselApi.canScrollNext()) {
          carouselApi.scrollNext();
        } else {
          carouselApi.scrollTo(0);
        }
      }
    }, 3000);
    return () => {
      if (slideshowInterval.current) clearInterval(slideshowInterval.current);
    };
  }, [carouselApi]);

  const imgClass = contain
    ? 'w-full max-h-48 mx-auto object-contain rounded-lg bg-white'
    : 'w-full h-40 object-cover rounded-lg transition-all duration-500';

  if (images.length === 1) {
    return (
      <img
        src={images[0]}
        alt="Promotional Preview"
        className={imgClass}
      />
    );
  }
  return (
    <Carousel opts={{ loop: true }} className="relative group" setApi={setCarouselApi}>
      <CarouselContent>
        {images.map((img, idx) => (
          <CarouselItem key={idx}>
            <img
              src={img}
              alt={`Promotional ${idx + 1}`}
              className={imgClass}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="absolute inset-0 flex items-center justify-between pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100 opacity-0 transition-opacity duration-200 md:group-hover:opacity-100 md:pointer-events-auto md:flex hidden">
        <div className="pointer-events-auto">
          <CarouselPrevious className="!static !left-2 !top-1/2 !-translate-y-1/2 z-10 bg-white/70 hover:bg-white/90" />
        </div>
        <div className="pointer-events-auto">
          <CarouselNext className="!static !right-2 !top-1/2 !-translate-y-1/2 z-10 bg-white/70 hover:bg-white/90" />
        </div>
      </div>
    </Carousel>
  );
}

interface StartupDetailsProps {
  startup: {
    id: string;
    name: string;
    logo?: string | null;
    description?: string | null;
    industry?: string | null;
    stage?: string | null;
    location?: string | null;
    employees?: string | null;
    funding?: string | null;
    founded?: string | null;
    website?: string | null;
    xUrl?: string | null;
    instagramUrl?: string | null;
    linkedinUrl?: string | null;
    promotionalImages?: string[] | null;
    upvotes?: number;
    downvotes?: number;
  };
  jobCount?: number;
  onVote?: (startupId: string, type: 'UPVOTE' | 'DOWNVOTE') => void;
  userVote?: { type: 'UPVOTE' | 'DOWNVOTE' } | null;
  voting?: boolean;
  user?: any;
}

export default function StartupDetails({ 
  startup, 
  jobCount,
  onVote,
  userVote,
  voting = false,
  user
}: StartupDetailsProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={startup.logo || undefined} alt={startup.name} />
            <AvatarFallback>
              <Building2 className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>
          <div>
            <span className="text-lg">{startup.name}</span>
            <p className="text-sm text-gray-600 font-normal">{startup.industry}</p>
            <SocialIcons
              xUrl={startup.xUrl}
              instagramUrl={startup.instagramUrl}
              linkedinUrl={startup.linkedinUrl}
              className="mt-2"
            />
          </div>
        </CardTitle>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4" />
          <span>{startup.stage} • {startup.location}</span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {startup.promotionalImages && startup.promotionalImages.length > 0 && (
          <div className="w-full bg-gray-50 rounded-lg border border-gray-200 p-2 shadow-sm">
            <StartupPromoCarousel
              images={startup.promotionalImages}
              contain={true}
            />
          </div>
        )}
        
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold mb-3">About {startup.name}</h3>
          <p className="text-gray-600 mb-4 text-sm">{startup.description}</p>
          
          <div className="grid grid-cols-1 gap-3 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="font-medium text-gray-900 block">Stage</span>
                <p className="text-gray-600">{startup.stage}</p>
              </div>
              <div>
                <span className="font-medium text-gray-900 block">Industry</span>
                <p className="text-gray-600">{startup.industry}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="font-medium text-gray-900 block">Team Size</span>
                <p className="text-gray-600">{startup.employees}</p>
              </div>
              <div>
                <span className="font-medium text-gray-900 block">Funding</span>
                <p className="text-gray-600">{startup.funding}</p>
              </div>
            </div>
            
            {startup.founded && (
              <div>
                <span className="font-medium text-gray-900 block">Founded</span>
                <p className="text-gray-600">{startup.founded}</p>
              </div>
            )}
            
            <div>
              <span className="font-medium text-gray-900 block">Location</span>
              <p className="text-gray-600">{startup.location}</p>
            </div>
            
            {startup.website && (
              <div>
                <span className="font-medium text-gray-900 block">Website</span>
                <p>
                  <a 
                    href={startup.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 flex items-center space-x-1 text-sm"
                  >
                    <ExternalLink className="h-3 w-3" />
                    <span className="truncate">{startup.website}</span>
                  </a>
                </p>
              </div>
            )}
            
            {jobCount !== undefined && (
              <div>
                <span className="font-medium text-gray-900 block">Open Positions</span>
                <p className="text-gray-600 flex items-center space-x-1">
                  <Briefcase className="h-3 w-3" />
                  <span>{jobCount} job{jobCount !== 1 ? 's' : ''}</span>
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Voting Section */}
        {onVote && (
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Button
                variant={userVote?.type === 'UPVOTE' ? 'default' : 'outline'}
                onClick={() => onVote(startup.id, 'UPVOTE')}
                disabled={!user || voting}
                size="sm"
                className="flex items-center space-x-1"
              >
                <ThumbsUp className="h-3 w-3" />
                <span className="text-xs">{startup.upvotes || 0}</span>
              </Button>
              <Button
                variant={userVote?.type === 'DOWNVOTE' ? 'destructive' : 'outline'}
                onClick={() => onVote(startup.id, 'DOWNVOTE')}
                disabled={!user || voting}
                size="sm"
                className="flex items-center space-x-1"
              >
                <ThumbsDown className="h-3 w-3" />
                <span className="text-xs">{startup.downvotes || 0}</span>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
