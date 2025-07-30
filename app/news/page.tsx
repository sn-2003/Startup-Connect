'use client';

import { useState, useEffect } from 'react';
import MainHeader from '@/components/layout/main-header';
import { useAuth } from '@/hooks/use-auth';
import { apiClient } from '@/lib/api-client';
import { 
  Search, 
  Filter, 
  ExternalLink, 
  Clock, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Zap,
  Bookmark,
  Share2,
  Eye,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content?: string;
  source: string;
  url: string;
  publishedAt: string;
  category: string;
  readTime?: string;
  image?: string;
  author?: string;
  tags: string[];
  views: number;
  featured: boolean;
  sourceType: string;
  _count?: {
    userBookmarks: number;
  };
}

const categories = [
  { id: 'all', label: 'All News', icon: TrendingUp },
  { id: 'STARTUP', label: 'Startups', icon: Zap },
  { id: 'INVESTMENT', label: 'Investment', icon: DollarSign },
  { id: 'TECHNOLOGY', label: 'Technology', icon: TrendingUp },
  { id: 'MARKETING', label: 'Marketing', icon: TrendingUp },
  { id: 'DESIGN', label: 'Design', icon: TrendingUp },
  { id: 'PRODUCTIVITY', label: 'Productivity', icon: TrendingUp },
  { id: 'ANALYTICS', label: 'Analytics', icon: TrendingUp },
  { id: 'FINANCE', label: 'Finance', icon: TrendingUp },
  { id: 'COMMUNICATION', label: 'Communication', icon: TrendingUp },
  { id: 'CAREERS', label: 'Careers', icon: TrendingUp },
  { id: 'GENERAL', label: 'General', icon: TrendingUp }
];

export default function NewsPage() {
  const { user } = useAuth();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'trending'>('latest');

  useEffect(() => {
    fetchNews();
  }, [selectedCategory, searchQuery, sortBy]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getNews({
        category: selectedCategory === 'all' ? undefined : selectedCategory,
        search: searchQuery || undefined,
        sortBy: sortBy,
        limit: 50
      });

      if (response.success && response.data) {
        setNews(response.data);
      } else {
        toast.error('Failed to fetch news');
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      toast.error('Failed to fetch news');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      STARTUP: 'bg-blue-100 text-blue-800',
      INVESTMENT: 'bg-green-100 text-green-800',
      TECHNOLOGY: 'bg-purple-100 text-purple-800',
      MARKETING: 'bg-orange-100 text-orange-800',
      DESIGN: 'bg-pink-100 text-pink-800',
      PRODUCTIVITY: 'bg-indigo-100 text-indigo-800',
      ANALYTICS: 'bg-red-100 text-red-800',
      FINANCE: 'bg-yellow-100 text-yellow-800',
      COMMUNICATION: 'bg-teal-100 text-teal-800',
      CAREERS: 'bg-gray-100 text-gray-800',
      GENERAL: 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleBookmark = async (newsId: string) => {
    if (!user) {
      toast.error('Please log in to bookmark articles');
      return;
    }

    try {
      // Check if already bookmarked
      const isBookmarked = news.find(item => item.id === newsId)?._count?.userBookmarks ?? 0 > 0;
      
      if (isBookmarked) {
        await apiClient.unbookmarkNews(newsId);
        toast.success('Removed from bookmarks');
      } else {
        await apiClient.bookmarkNews(newsId);
        toast.success('Added to bookmarks');
      }
      
      // Refresh news to update bookmark counts
      fetchNews();
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast.error('Failed to update bookmark');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MainHeader />
      
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Startup Newsroom
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stay updated with the latest startup news, funding rounds, acquisitions, and founder insights from around the world.
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
                  placeholder="Search news by title, content, or tags..."
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
                onChange={(e) => setSortBy(e.target.value as 'latest' | 'popular' | 'trending')}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="latest">Latest First</option>
                <option value="popular">Most Popular</option>
                <option value="trending">Trending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const Icon = category.icon;
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
                </button>
              );
            })}
          </div>
        </div>

        {/* News Grid */}
        {loading ? (
          <div className="grid gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-6 animate-pulse">
                <div className="flex space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-20 w-32 bg-gray-200 rounded-lg"></div>
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-6">
            {news.map((item) => (
              <article key={item.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="md:flex">
                  {item.image && (
                    <div className="md:flex-shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="h-48 w-full md:w-64 object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="p-6 flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                            {item.category}
                          </span>
                          <span className="text-sm text-gray-500">{item.source}</span>
                          {item.author && (
                            <span className="text-sm text-gray-500">by {item.author}</span>
                          )}
                        </div>
                        
                        <h2 className="text-xl font-semibold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
                          {item.title}
                        </h2>
                        
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {item.summary}
                        </p>
                      </div>
                      
                      <div className="flex flex-col items-end space-y-2 ml-4">
                        <button
                          onClick={() => handleBookmark(item.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            (item._count?.userBookmarks ?? 0) > 0
                              ? 'text-blue-600 bg-blue-50' 
                              : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <Bookmark className={`h-5 w-5 ${(item._count?.userBookmarks ?? 0) > 0 ? 'fill-current' : ''}`} />
                        </button>
                        
                        <button className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors">
                          <Share2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {item.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{item.publishedAt}</span>
                        </div>
                        <span>{item.readTime}</span>
                        <div className="flex items-center space-x-1">
                          <Eye className="h-4 w-4" />
                          <span>{item.views.toLocaleString()}</span>
                        </div>
                      </div>
                      
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 flex items-center space-x-1 font-medium"
                      >
                        <span>Read Full Article</span>
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Load More Button */}
        <div className="text-center pt-8">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Load More News
          </button>
        </div>
      </div>
    </div>
  );
}