'use client';

import { useState, useEffect } from 'react';
import MainHeader from '@/components/layout/main-header';
import Reels from '@/components/reels/startup-reels';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StartupReelWithRelations } from '@/lib/types';
import { apiClient } from '@/lib/api-client';
import { Instagram, Sparkles, TrendingUp, Filter } from 'lucide-react';
import { toast } from 'sonner';

export default function ReelsPage() {
  const [reels, setReels] = useState<StartupReelWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  useEffect(() => {
    loadReels();
  }, [showFeaturedOnly]);

  const loadReels = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getReels({
        featured: showFeaturedOnly || undefined,
        limit: 50,
      });
      if (response.success && response.data) {
        setReels(response.data);
      } else {
        toast.error('Failed to load reels');
      }
    } catch (error) {
      console.error('Error loading reels:', error);
      toast.error('Failed to load reels');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header - Fixed at top */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <img src="/logo.png" alt="StartupGram Logo" className="h-7 w-7 object-contain" />
                <h1 className="text-xl font-bold text-white">Shorts</h1>
              </div>
              <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <Sparkles className="h-3 w-3 mr-1" />
                New Feature
              </Badge>
            </div>

            <div className="flex items-center space-x-3">
              
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.history.back()}
                className="bg-white/10 text-white hover:bg-white/20 border-white/20"
              >
                Back
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-16">
        {loading ? (
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-white">Loading startup reels...</p>
            </div>
          </div>
        ) : (
          <Reels 
            reels={reels}
            featured={showFeaturedOnly}
            usePersonalizedFeed={true}
          />
        )}
      </div>
    </div>
  );
}
