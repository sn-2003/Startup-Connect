"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Star, X, Briefcase } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface Startup {
  id: string;
  name: string;
  description: string;
  logo?: string | null;
  website?: string | null;
  featured: boolean;
}

export function FeaturedStartupsManager() {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchStartups();
  }, []);

  const fetchStartups = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/startups');
      if (!response.ok) throw new Error('Failed to fetch startups');
      const data = await response.json();
      setStartups(data);
    } catch (error) {
      console.error('Error fetching startups:', error);
      toast({
        title: 'Error',
        description: 'Failed to load startups',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFeatured = async (startup: Startup) => {
    try {
      setUpdatingId(startup.id);
      const response = await fetch('/api/admin/featured-startups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startupId: startup.id,
          featured: !startup.featured,
        }),
      });

      if (!response.ok) throw new Error('Failed to update featured status');

      // Update local state
      setStartups((prev) =>
        prev.map((s) =>
          s.id === startup.id ? { ...s, featured: !s.featured } : s
        )
      );

      toast({
        title: 'Success',
        description: startup.featured
          ? 'Startup removed from featured'
          : 'Startup added to featured',
      });
    } catch (error) {
      console.error('Error toggling featured status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update featured status',
        variant: 'destructive',
      });
    } finally {
      setUpdatingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Featured Startups</h3>
        <p className="text-sm text-muted-foreground">
          Manage which startups appear in the featured section on the homepage
        </p>
      </div>

      <div className="space-y-4">
        {startups.length === 0 ? (
          <div className="text-center py-8 border rounded-lg">
            <p className="text-muted-foreground">No startups found</p>
          </div>
        ) : (
          <div className="space-y-2">
            {startups.map((startup) => (
              <div
                key={startup.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
              >
                <div className="flex items-center space-x-4">
                  {startup.logo ? (
                    <img
                      src={startup.logo}
                      alt={startup.name}
                      className="h-10 w-10 rounded-md object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                      <Briefcase className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                  <div>
                    <h4 className="font-medium">{startup.name}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {startup.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor={`featured-${startup.id}`} className="flex items-center">
                    <span className="mr-2 text-sm font-medium">
                      {startup.featured ? 'Featured' : 'Not Featured'}
                    </span>
                    <Switch
                      id={`featured-${startup.id}`}
                      checked={startup.featured}
                      onCheckedChange={() => toggleFeatured(startup)}
                      disabled={updatingId === startup.id}
                    />
                  </Label>
                  {updatingId === startup.id && (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
