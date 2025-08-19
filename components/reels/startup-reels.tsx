'use client';

import { useState, useEffect, useRef, useCallback, useReducer } from 'react';
import { ApiResponse } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StartupReelWithRelations } from '@/lib/types';
import { apiClient } from '@/lib/api-client';
import { 
  ExternalLink, 
  Building2, 
  Eye, 
  Play, 
  Heart, 
  Share2, 
  Bookmark,
  ChevronUp,
  ChevronDown,
  Loader2,
  Instagram,
  RotateCcw,
  Info
} from 'lucide-react';
import { toast } from 'sonner';

interface ReelsProps {
  reels?: StartupReelWithRelations[];
  featured?: boolean;
  className?: string;
  usePersonalizedFeed?: boolean;
}

interface InstagramEmbedProps {
  embedId: string;
  onLoad?: () => void;
  onError?: () => void;
}

// Instagram Embed Component
const InstagramEmbed: React.FC<InstagramEmbedProps> = ({ embedId, onLoad, onError }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const embedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadInstagramEmbed = async () => {
      try {
        // Check if Instagram embed script is already loaded
        if (!window.instgrm) {
          // Load Instagram embed script
          const script = document.createElement('script');
          script.src = 'https://www.instagram.com/embed.js';
          script.async = true;
          script.onload = () => {
            if (window.instgrm) {
              window.instgrm.Embeds.process();
              setLoading(false);
              onLoad?.();
            }
          };
          script.onerror = () => {
            setError(true);
            setLoading(false);
            onError?.();
          };
          document.head.appendChild(script);
        } else {
          // Script already loaded, just process embeds
          window.instgrm.Embeds.process();
          setLoading(false);
          onLoad?.();
        }
      } catch (err) {
        setError(true);
        setLoading(false);
        onError?.();
      }
    };

    loadInstagramEmbed();
  }, [embedId, onLoad, onError]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-gray-100 rounded-lg">
        <Instagram className="h-12 w-12 text-gray-400 mb-4" />
        <p className="text-gray-600 text-center">
          Unable to load Instagram content
        </p>
        <p className="text-gray-500 text-sm mt-2">
          Please check your internet connection
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg z-10">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-2" />
            <p className="text-gray-600 text-sm">Loading Instagram content...</p>
          </div>
        </div>
      )}
      <div 
        ref={embedRef}
        className="instagram-embed-container"
        style={{ minHeight: loading ? '400px' : 'auto' }}
      >
        <blockquote
          className="instagram-media"
          data-instgrm-permalink={`https://www.instagram.com/p/${embedId}/`}
          data-instgrm-version="14"
          style={{
            background: '#FFF',
            border: '0',
            borderRadius: '3px',
            boxShadow: '0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)',
            margin: '1px',
            maxWidth: '540px',
            minWidth: '326px',
            padding: '0',
            width: '99.375%',
          }}
        >
          <div style={{ padding: '16px' }}>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'row', 
              alignItems: 'center' 
            }}>
              <div style={{
                backgroundColor: '#F4F4F4',
                borderRadius: '50%',
                flexGrow: '0',
                height: '40px',
                marginRight: '14px',
                width: '40px',
              }}></div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                flexGrow: '1',
                justifyContent: 'center',
              }}>
                <div style={{
                  backgroundColor: '#F4F4F4',
                  borderRadius: '4px',
                  flexGrow: '0',
                  height: '14px',
                  marginBottom: '6px',
                  width: '100px',
                }}></div>
                <div style={{
                  backgroundColor: '#F4F4F4',
                  borderRadius: '4px',
                  flexGrow: '0',
                  height: '14px',
                  width: '60px',
                }}></div>
              </div>
            </div>
            <div style={{ padding: '19% 0' }}></div>
            <div style={{ 
              display: 'block', 
              height: '50px', 
              margin: '0 auto 12px', 
              width: '50px' 
            }}>
              <svg width="50px" height="50px" viewBox="0 0 60 60" version="1.1">
                <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                  <g transform="translate(-511.000000, -20.000000)" fill="#000000">
                    <g>
                      <path d="M556.869,30.41 C554.814,30.41 553.148,32.076 553.148,34.131 C553.148,36.186 554.814,37.852 556.869,37.852 C558.924,37.852 560.59,36.186 560.59,34.131 C560.59,32.076 558.924,30.41 556.869,30.41 M541,60.657 C535.114,60.657 530.342,55.887 530.342,50 C530.342,44.114 535.114,39.342 541,39.342 C546.887,39.342 551.658,44.114 551.658,50 C551.658,55.887 546.887,60.657 541,60.657 M541,33.886 C532.1,33.886 524.886,41.1 524.886,50 C524.886,58.899 532.1,66.113 541,66.113 C549.9,66.113 557.115,58.899 557.115,50 C557.115,41.1 549.9,33.886 541,33.886 M565.378,62.101 C565.244,65.022 564.756,66.606 564.346,67.663 C563.803,69.06 563.154,70.057 562.106,71.106 C561.058,72.155 560.06,72.803 558.662,73.347 C557.607,73.757 556.021,74.244 553.102,74.378 C549.944,74.521 548.997,74.552 541,74.552 C533.003,74.552 532.056,74.521 528.898,74.378 C525.979,74.244 524.393,73.757 523.338,73.347 C521.94,72.803 520.942,72.155 519.894,71.106 C518.846,70.057 518.197,69.06 517.654,67.663 C517.244,66.606 516.755,65.022 516.623,62.101 C516.479,58.943 516.448,57.996 516.448,50 C516.448,42.003 516.479,41.056 516.623,37.899 C516.755,34.978 517.244,33.391 517.654,32.338 C518.197,30.938 518.846,29.942 519.894,28.894 C520.942,27.846 521.94,27.196 523.338,26.654 C524.393,26.244 525.979,25.756 528.898,25.623 C532.057,25.479 533.004,25.448 541,25.448 C548.997,25.448 549.943,25.479 553.102,25.623 C556.021,25.756 557.607,26.244 558.662,26.654 C560.06,27.196 561.058,27.846 562.106,28.894 C563.154,29.942 563.803,30.938 564.346,32.338 C564.756,33.391 565.244,34.978 565.378,37.899 C565.522,41.056 565.552,42.003 565.552,50 C565.552,57.996 565.522,58.943 565.378,62.101 M570.82,37.631 C570.674,34.438 570.167,32.258 569.425,30.349 C568.659,28.377 567.633,26.702 565.965,25.035 C564.297,23.368 562.623,22.342 560.652,21.575 C558.743,20.834 556.562,20.326 553.369,20.18 C550.169,20.033 549.148,20 541,20 C532.853,20 531.831,20.033 528.631,20.18 C525.438,20.326 523.257,20.834 521.349,21.575 C519.376,22.342 517.703,23.368 516.035,25.035 C514.368,26.702 513.342,28.377 512.574,30.349 C511.834,32.258 511.326,34.438 511.181,37.631 C511.035,40.831 511,41.851 511,50 C511,58.147 511.035,59.17 511.181,62.369 C511.326,65.562 511.834,67.743 512.574,69.651 C513.342,71.625 514.368,73.296 516.035,74.965 C517.703,76.634 519.376,77.658 521.349,78.425 C523.257,79.167 525.438,79.673 528.631,79.82 C531.831,79.965 532.853,80.001 541,80.001 C549.148,80.001 550.169,79.965 553.369,79.82 C556.562,79.673 558.743,79.167 560.652,78.425 C562.623,77.658 564.297,76.634 565.965,74.965 C567.633,73.296 568.659,71.625 569.425,69.651 C570.167,67.743 570.674,65.562 570.82,62.369 C570.966,59.17 571,58.147 571,50 C571,41.851 570.966,40.831 570.82,37.631"></path>
                    </g>
                  </g>
                </g>
              </svg>
            </div>
            <div style={{ paddingTop: '8px' }}>
              <div style={{
                color: '#3897f0',
                fontFamily: 'Arial,sans-serif',
                fontSize: '14px',
                fontStyle: 'normal',
                fontWeight: '550',
                lineHeight: '18px',
              }}>
                View this post on Instagram
              </div>
            </div>
          </div>
        </blockquote>
      </div>
    </div>
  );
};

// Individual Reel Component
interface ReelCardProps {
  reel: StartupReelWithRelations;
  isActive: boolean;
  onView: (id: string) => void;
  onProgress?: (reelId: string, index: number) => void;
  index?: number;
}

const ReelCard: React.FC<ReelCardProps> = ({ reel, isActive, onView, onProgress, index }) => {
  const [hasViewed, setHasViewed] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isActive && !hasViewed) {
      onView(reel.id);
      setHasViewed(true);
      
      // Update progress if callback provided
      if (onProgress && typeof index === 'number') {
        onProgress(reel.id, index);
      }
    }
  }, [isActive, hasViewed, reel.id, onView, onProgress, index]);

  const handleOpenInInstagram = () => {
    window.open(reel.instagramUrl, '_blank', 'noopener,noreferrer');
  };

  const getStageColor = (stage: string) => {
    const colors = {
      'IDEA': 'bg-gray-100 text-gray-800',
      'MVP': 'bg-blue-100 text-blue-800',
      'EARLY': 'bg-green-100 text-green-800',
      'GROWTH': 'bg-purple-100 text-purple-800',
      'SCALE': 'bg-orange-100 text-orange-800',
    };
    return colors[stage as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div
      ref={cardRef}
      className="w-full max-w-md mx-auto snap-start snap-always px-2 md:px-0"
      style={{ scrollSnapAlign: 'start' }}
    >
      <Card className="border-0 shadow-lg bg-white overflow-hidden">
        <div className="px-3 md:px-4 py-2 md:py-3">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-1">{reel.title}</h2>
          {reel.description && (
            <p className="text-gray-600 text-xs md:text-sm line-clamp-2">{reel.description}</p>
          )}
        </div>
        <CardContent className="p-0">
          <div className="relative">
            <InstagramEmbed 
              embedId={reel.embedId}
              onLoad={() => {
                // Embed loaded successfully
              }}
              onError={() => {
                toast.error('Failed to load Instagram content');
              }}
            />
          </div>
        </CardContent>
        <div className="p-3 md:p-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 text-gray-500">
                <Eye className="h-3 md:h-4 w-3 md:w-4" />
                <span className="text-xs md:text-sm">{reel.views?.toLocaleString() || 0}</span>
              </div>
            </div>
            <Button
              onClick={handleOpenInInstagram}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xs md:text-sm"
              size="sm"
            >
              <Instagram className="h-3 md:h-4 w-3 md:w-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Open in </span>Instagram
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

// Touch/Swipe state management
interface TouchState {
  startY: number;
  currentY: number;
  isDragging: boolean;
  startTime: number;
}

type TouchAction =
  | { type: 'START_TOUCH'; payload: { y: number; time: number } }
  | { type: 'MOVE_TOUCH'; payload: { y: number } }
  | { type: 'END_TOUCH' }
  | { type: 'RESET' };

const touchReducer = (state: TouchState, action: TouchAction): TouchState => {
  switch (action.type) {
    case 'START_TOUCH':
      return {
        startY: action.payload.y,
        currentY: action.payload.y,
        isDragging: true,
        startTime: action.payload.time,
      };
    case 'MOVE_TOUCH':
      return {
        ...state,
        currentY: action.payload.y,
      };
    case 'END_TOUCH':
    case 'RESET':
      return {
        startY: 0,
        currentY: 0,
        isDragging: false,
        startTime: 0,
      };
    default:
      return state;
  }
};

// Main Reels Component
export default function Reels({
  reels: initialReels,
  featured = false,
  className = '',
  usePersonalizedFeed = false
}: ReelsProps) {
  const { user } = useAuth();
  const [reels, setReels] = useState<StartupReelWithRelations[]>(initialReels || []);
  const [loading, setLoading] = useState(!initialReels);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedPosition, setFeedPosition] = useState<{
    totalReels: number;
    currentPosition: number;
    remainingReels: number;
  } | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);
  const [touchState, touchDispatch] = useReducer(touchReducer, {
    startY: 0,
    currentY: 0,
    isDragging: false,
    startTime: 0,
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();
  const preventScrollRef = useRef(false);

  // Load reels if not provided as props
  useEffect(() => {
    if (!initialReels && user) {
      loadReels();
    }
  }, [featured, initialReels, user, usePersonalizedFeed]);

  const loadReels = useCallback(async (sync = true) => {
    try {
      setLoading(true);
      
      let response;
      if (usePersonalizedFeed && user) {
        // Always sync when loading reels to ensure fresh, randomized feed
        response = await apiClient.getUserReelFeed(sync, 1, 10);
        
        if (response.success && response.data) {
          setReels(response.data.reels || []);
          setCurrentIndex(response.data.currentIndex || 0);
          setHasMore(response.data.hasMore);
          setPage(2);
        }
      } else {
        // Load regular feed
        response = await apiClient.getReels({ featured, limit: 10, page: 1 });
        if (response.success && Array.isArray(response.data)) {
          setReels(response.data);
          setPage(2);
          setHasMore(response.data.length > 0);
        }
      }
      
    } catch (error) {
      console.error('Error loading reels:', error);
      toast.error('Failed to load reels');
    } finally {
      setLoading(false);
    }
  }, [usePersonalizedFeed, user, featured]);

  const loadMoreReels = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    try {
      let response: ApiResponse<any>;
      if (usePersonalizedFeed && user) {
        response = await apiClient.getUserReelFeed(false, page, 10);
        if (response.success && response.data && Array.isArray((response.data as any).reels)) {
          setReels(prev => [...prev, ...(response.data as any).reels]);
          setHasMore((response.data as any).hasMore);
          setPage(prev => prev + 1);
        }
      } else {
        response = await apiClient.getReels({ featured, limit: 10, page });
        if (response.success && Array.isArray(response.data)) {
          setReels(prev => [...prev, ...response.data as StartupReelWithRelations[]]);
          setHasMore(response.data.length > 0);
          setPage(prev => prev + 1);
        }
      }
    } catch (error) {
      console.error('Error loading more reels:', error);
      toast.error('Failed to load more reels');
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, page, usePersonalizedFeed, user, featured]);

  const refreshReels = useCallback(async () => {
    try {
      await apiClient.resetReelFeed();
      await loadReels();
      toast.success('Reels refreshed');
    } catch (error) {
      console.error('Error refreshing reels:', error);
      toast.error('Failed to refresh reels');
    }
  }, [loadReels]);

  // Handle view tracking
  const handleView = useCallback(async (reelId: string, index?: number) => {
    try {
      if (usePersonalizedFeed && user && typeof index === 'number') {
        // Update progress in personalized feed
        await apiClient.updateReelProgress(reelId, index);
      } else {
        // Regular view tracking
        await apiClient.incrementReelViews(reelId);
      }
      
      // Update local state
      setReels(prev => 
        prev.map(reel => 
          reel.id === reelId 
            ? { ...reel, views: reel.views + 1 }
            : reel
        )
      );
    } catch (error) {
      console.error('Error tracking view:', error);
    }
  }, [usePersonalizedFeed, user]);

  // Handle progress update for personalized feed
  const handleProgress = useCallback(async (reelId: string, index: number) => {
    if (!usePersonalizedFeed || !user) return;
    
    try {
      await apiClient.updateReelProgress(reelId, index);
      
      // Update feed position
      const positionResponse = await apiClient.getReelFeedPosition();
      if (positionResponse.success && positionResponse.data) {
        setFeedPosition(positionResponse.data);
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  }, [usePersonalizedFeed, user]);

  // Reset feed function
  const handleResetFeed = useCallback(async (sync = false) => {
    if (!usePersonalizedFeed || !user) return;
    
    try {
      const response = await apiClient.resetReelFeed();
      if (response.success) {
        toast.success('Feed reset! Starting fresh with new order.');
        loadReels(sync); // Reload the feed
      }
    } catch (error) {
      console.error('Error resetting feed:', error);
      toast.error('Failed to reset feed');
    }
  }, [usePersonalizedFeed, user, loadReels]);

  // Handle scroll events
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setIsScrolling(true);
      
      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Set timeout to detect scroll end
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
        
        // Calculate current reel index based on scroll position
        const scrollTop = container.scrollTop;
        const containerHeight = container.clientHeight;
        const newIndex = Math.round(scrollTop / containerHeight);
        
        if (newIndex !== currentIndex && newIndex >= 0 && newIndex < reels.length) {
          setCurrentIndex(newIndex);
        }

        // Load more reels when approaching the end
        if (newIndex >= reels.length - 3 && hasMore && !loadingMore) {
          loadMoreReels();
        }
      }, 150);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [currentIndex, reels.length]);

  // Navigation functions
  const scrollToReel = (index: number) => {
    const container = containerRef.current;
    if (!container || index < 0 || index >= reels.length) return;

    const targetScrollTop = index * container.clientHeight;

    // Add smooth scroll with enhanced easing
    container.style.scrollBehavior = 'smooth';
    container.scrollTo({
      top: targetScrollTop,
      behavior: 'smooth',
    });

    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      scrollToReel(currentIndex - 1);
    }
  };

  const goToNext = () => {
    if (currentIndex < reels.length - 1) {
      scrollToReel(currentIndex + 1);
    }
  };

  // Touch event handlers for mobile swipe navigation
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchDispatch({
      type: 'START_TOUCH',
      payload: { y: touch.clientY, time: Date.now() }
    });

    // Disable scroll during touch
    const container = containerRef.current;
    if (container) {
      container.style.overflowY = 'hidden';
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchState.isDragging) return;

    const touch = e.touches[0];
    touchDispatch({
      type: 'MOVE_TOUCH',
      payload: { y: touch.clientY }
    });

    // Always prevent default scrolling during swipe
    e.preventDefault();
  }, [touchState.isDragging]);

  const handleTouchEnd = useCallback(() => {
    if (!touchState.isDragging) {
      // Re-enable scroll if we weren't dragging
      const container = containerRef.current;
      if (container) {
        container.style.overflowY = 'auto';
      }
      return;
    }

    const deltaY = touchState.startY - touchState.currentY;
    const deltaTime = Date.now() - touchState.startTime;
    const velocity = Math.abs(deltaY) / deltaTime;

    // Very sensitive thresholds for smooth experience
    const minSwipeDistance = 20;
    const minVelocity = 0.15;

    let navigated = false;

    if (Math.abs(deltaY) > minSwipeDistance || velocity > minVelocity) {
      if (deltaY > 0) {
        // Swipe up (finger moves up) - go to next reel
        if (currentIndex < reels.length - 1) {
          scrollToReel(currentIndex + 1);
          navigated = true;
        }
      } else {
        // Swipe down (finger moves down) - go to previous reel
        if (currentIndex > 0) {
          scrollToReel(currentIndex - 1);
          navigated = true;
        }
      }
    }

    // Re-enable scroll after navigation or immediately if no navigation
    const container = containerRef.current;
    if (container) {
      if (navigated) {
        // Delay re-enabling scroll to let the smooth scroll complete
        setTimeout(() => {
          container.style.overflowY = 'auto';
        }, 300);
      } else {
        container.style.overflowY = 'auto';
      }
    }

    touchDispatch({ type: 'END_TOUCH' });
  }, [touchState, currentIndex, reels.length, scrollToReel]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        goToPrevious();
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, reels.length]);



  if (loading) {
    return (
      <div className={`flex items-center justify-center h-96 ${className}`}>
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading reels...</p>
        </div>
      </div>
    );
  }

  if (reels.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center h-96 bg-gray-50 rounded-lg ${className}`}>
        <Instagram className="h-16 w-16 text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Reels Available</h3>
        <p className="text-gray-600 text-center max-w-md">
          {'No reels have been added yet. Check back later for exciting content!'}
        </p>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Main Feed Container */}
      <div
        ref={containerRef}
        className="h-screen overflow-y-auto snap-y snap-mandatory scrollbar-hide"
        style={{
          scrollSnapType: 'y mandatory',
          WebkitOverflowScrolling: 'touch',
          touchAction: 'none',
          scrollBehavior: 'smooth',
          transition: 'scroll 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {reels.map((reel, index) => (
          <div
            key={`${reel.id}-${index}`}
            className={`h-screen flex items-center justify-center p-2 md:p-4 snap-start snap-always transition-transform duration-200 ${
              touchState.isDragging && index === currentIndex
                ? 'scale-[0.98]'
                : 'scale-100'
            }`}
            style={{ scrollSnapAlign: 'start' }}
          >
            <ReelCard
              reel={reel}
              isActive={index === currentIndex}
              onView={handleView}
              onProgress={usePersonalizedFeed ? handleProgress : undefined}
              index={index}
            />
          </div>
        ))}
      </div>

      {/* Navigation Controls - Hide on mobile, show on desktop */}
      {reels.length > 1 && (
        <div className="hidden md:block fixed right-4 top-1/2 transform -translate-y-1/2 z-20">
          <div className="flex flex-col space-y-2">
            <Button
              variant="outline"
              size="icon"
              onClick={goToPrevious}
              disabled={currentIndex === 0}
              className="bg-white/90 hover:bg-white shadow-lg"
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={goToNext}
              disabled={currentIndex === reels.length - 1}
              className="bg-white/90 hover:bg-white shadow-lg"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Mobile Swipe Indicators */}
      {reels.length > 1 && (
        <div className="md:hidden fixed right-4 top-1/2 transform -translate-y-1/2 z-20">
          <div className="bg-black/50 rounded-full p-2 backdrop-blur-sm">
            <div className="text-white text-xs text-center">
              <div className="animate-bounce mb-1">👆</div>
              <div className="text-[10px] leading-tight">Swipe</div>
            </div>
          </div>
        </div>
      )}

      {/* Progress Indicator - Hidden on mobile */}
      {reels.length > 1 && (
        <div className="hidden md:block fixed left-4 top-1/2 transform -translate-y-1/2 z-20">
          <div className="flex flex-col space-y-1">
            {reels.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToReel(index)}
                className={`w-1 h-8 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-blue-600 w-2'
                    : 'bg-white/60 hover:bg-white/80'
                }`}
                aria-label={`Go to reel ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Reel Counter */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-20">
        <div className="bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2">
          <span>{currentIndex + 1} / {reels.length}</span>
          {usePersonalizedFeed && feedPosition && (
            <>
              <span>•</span>
              <span className="text-xs">
                {feedPosition.remainingReels} left
              </span>
            </>
          )}
        </div>
      </div>

      {loadingMore && (
        <div className="fixed bottom-16 left-1/2 transform -translate-x-1/2 z-30">
          <div className="bg-black/70 text-white px-4 py-2 rounded-full flex items-center space-x-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading more...</span>
          </div>
        </div>
      )}

      {/* Feed Controls for Personalized Feed */}
      {usePersonalizedFeed && user && (
        <div className="fixed top-20 right-4 z-20 space-y-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleResetFeed(true)}
            className="bg-white/90 hover:bg-white shadow-lg flex items-center space-x-2"
          >
            <RotateCcw className="h-4 w-4" />
            <span className="hidden md:inline">Reset Feed</span>
          </Button>
        </div>
      )}
    </div>
  );
}

// Declare Instagram embed script global
declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: () => void;
      };
    };
  }
}
