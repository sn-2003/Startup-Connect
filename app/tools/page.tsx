'use client';

import { useState, useEffect } from 'react';
import MainHeader from '@/components/layout/main-header';
import { useAuth } from '@/hooks/use-auth';
import { apiClient } from '@/lib/api-client';
import { 
  Search, 
  Filter, 
  ExternalLink, 
  Star, 
  Users, 
  Zap,
  TrendingUp,
  BookOpen,
  MessageSquare,
  Calendar,
  DollarSign,
  Shield,
  Globe,
  Code,
  Palette,
  BarChart3,
  Heart,
  MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  url: string;
  rating: number;
  users: string;
  pricing: string;
  featured: boolean;
  tags: string[];
  _count?: {
    userRatings: number;
    userFavorites: number;
  };
}

const categories = [
  { id: 'all', label: 'All Tools', icon: Zap },
  { id: 'DEVELOPMENT', label: 'Development', icon: Code },
  { id: 'DESIGN', label: 'Design', icon: Palette },
  { id: 'MARKETING', label: 'Marketing', icon: TrendingUp },
  { id: 'PRODUCTIVITY', label: 'Productivity', icon: BookOpen },
  { id: 'ANALYTICS', label: 'Analytics', icon: BarChart3 },
  { id: 'FINANCE', label: 'Finance', icon: DollarSign },
  { id: 'COMMUNICATION', label: 'Communication', icon: MessageSquare },
  { id: 'AI', label: 'AI', icon: Zap }
];

export default function ToolsPage() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'users' | 'name'>('rating');
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [submittingRating, setSubmittingRating] = useState(false);

  useEffect(() => {
    fetchTools();
  }, [selectedCategory, searchQuery, sortBy]);

  const fetchTools = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getTools({
        category: selectedCategory === 'all' ? undefined : selectedCategory,
        search: searchQuery || undefined,
        sortBy
      });

      if (response.success) {
        setTools(response.data);
      } else {
        toast.error('Failed to fetch tools');
      }
    } catch (error) {
      console.error('Error fetching tools:', error);
      toast.error('Failed to fetch tools');
    } finally {
      setLoading(false);
    }
  };

  const handleRateTool = async () => {
    if (!user) {
      toast.error('Please log in to rate tools');
      return;
    }

    if (!selectedTool) return;

    try {
      setSubmittingRating(true);
      const response = await apiClient.rateTool(selectedTool.id, rating, review);
      
      if (response.success) {
        toast.success('Rating submitted successfully!');
        setShowRatingDialog(false);
        setRating(5);
        setReview('');
        fetchTools(); // Refresh to get updated ratings
      } else {
        toast.error(response.error || 'Failed to submit rating');
      }
    } catch (error) {
      console.error('Error rating tool:', error);
      toast.error('Failed to submit rating');
    } finally {
      setSubmittingRating(false);
    }
  };

  const handleFavorite = async (tool: Tool) => {
    if (!user) {
      toast.error('Please log in to favorite tools');
      return;
    }

    try {
      const response = await apiClient.favoriteTool(tool.id);
      
      if (response.success) {
        toast.success('Added to favorites!');
        fetchTools(); // Refresh to get updated counts
      } else {
        toast.error(response.error || 'Failed to add to favorites');
      }
    } catch (error) {
      console.error('Error favoriting tool:', error);
      toast.error('Failed to add to favorites');
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      DEVELOPMENT: 'bg-blue-100 text-blue-800',
      DESIGN: 'bg-purple-100 text-purple-800',
      MARKETING: 'bg-green-100 text-green-800',
      PRODUCTIVITY: 'bg-orange-100 text-orange-800',
      ANALYTICS: 'bg-red-100 text-red-800',
      FINANCE: 'bg-yellow-100 text-yellow-800',
      COMMUNICATION: 'bg-pink-100 text-pink-800',
      AI: 'bg-indigo-100 text-indigo-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) 
            ? 'text-yellow-500 fill-current' 
            : i < rating 
            ? 'text-yellow-500 fill-current opacity-50' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MainHeader />
      
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Tools for Startups
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the best tools and resources to help your startup grow, from development and design to marketing and analytics.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search tools by name, description, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Sort */}
            <div className="lg:w-48">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'rating' | 'users' | 'name')}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="rating">Sort by Rating</option>
                <option value="users">Sort by Users</option>
                <option value="name">Sort by Name</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const Icon = category.icon;
              const count = tools.filter(t => category.id === 'all' || t.category === category.id).length;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{category.label}</span>
                  <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tools Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <Card key={tool.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {/* Tool Image */}
                <div className="relative h-48 bg-gray-100">
                  <img 
                    src={tool.image} 
                    alt={tool.name}
                    className="w-full h-full object-cover"
                  />
                  {tool.featured && (
                    <div className="absolute top-3 left-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Featured
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-white bg-opacity-90 rounded-full px-2 py-1 flex items-center space-x-1">
                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                    <span className="text-xs font-medium">{tool.rating.toFixed(1)}</span>
                  </div>
                </div>

                {/* Tool Content */}
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{tool.name}</h3>
                    <Badge className={getCategoryColor(tool.category)}>
                      {tool.category}
                    </Badge>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {tool.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {tool.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-4">
                      <span>{tool.users} users</span>
                      <span className="font-medium text-gray-700">{tool.pricing}</span>
                    </div>
                    {tool._count && (
                      <div className="flex items-center space-x-2 text-xs text-gray-400">
                        <Heart className="h-3 w-3" />
                        <span>{tool._count.userFavorites}</span>
                        <MessageCircle className="h-3 w-3" />
                        <span>{tool._count.userRatings}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <span>Try Tool</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    {user && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleFavorite(tool)}
                          className="px-3"
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedTool(tool);
                            setShowRatingDialog(true);
                          }}
                          className="px-3"
                        >
                          <Star className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && tools.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tools found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>

      {/* Rating Dialog */}
      <Dialog open={showRatingDialog} onOpenChange={setShowRatingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rate {selectedTool?.name}</DialogTitle>
            <DialogDescription>
              Share your experience with this tool to help other users.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Rating</label>
              <div className="flex items-center space-x-1 mt-2">
                {Array.from({ length: 5 }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setRating(i + 1)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        i < rating 
                          ? 'text-yellow-500 fill-current' 
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-600">{rating}/5</span>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Review (Optional)</label>
              <Textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Share your thoughts about this tool..."
                className="mt-2"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRatingDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRateTool}
              disabled={submittingRating}
            >
              {submittingRating ? 'Submitting...' : 'Submit Rating'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 