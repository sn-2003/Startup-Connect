'use client';

import { useState, useEffect } from 'react';
import { ExternalLink, Clock, TrendingUp, DollarSign, Users, Zap, Bookmark, BookmarkCheck, Filter } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  publishedAt: string;
  category: string;
  readTime?: string;
  image?: string;
  featured: boolean;
}

const categories = [
  { id: 'all', label: 'All', icon: TrendingUp },
  { id: 'STARTUP', label: 'Startups', icon: Zap },
  { id: 'INVESTMENT', label: 'Investment', icon: DollarSign },
  { id: 'TECHNOLOGY', label: 'Technology', icon: TrendingUp }
];

export default function StartupNews() {
  const { user } = useAuth();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);
  const [savedNewsIds, setSavedNewsIds] = useState<string[]>([]);

  useEffect(() => {
    fetchNews();
    if (user) {
      fetchSavedNews();
    }
  }, [selectedCategory, showSavedOnly, user]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getNews({
        category: selectedCategory === 'all' ? undefined : selectedCategory,
        limit: 6,
        featured: showSavedOnly ? undefined : undefined,
        sortBy: 'latest'
      });

      if (response.success && response.data) {
        setNews(response.data);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedNews = async () => {
    if (!user) return;
    
    try {
      const response = await apiClient.getSavedNews({ limit: 100 });
      if (response.success && response.data) {
        setSavedNewsIds(response.data.map((item: NewsItem) => item.id));
      }
    } catch (error) {
      console.error('Error fetching saved news:', error);
    }
  };

  const handleSaveNews = async (newsId: string) => {
    if (!user) {
      toast.error('Please login to save news');
      return;
    }

    setSaving(newsId);
    try {
      const response = await apiClient.saveNews(newsId);
      if (response.success) {
        const isCurrentlySaved = savedNewsIds.includes(newsId);
        if (isCurrentlySaved) {
          setSavedNewsIds(prev => prev.filter(id => id !== newsId));
          toast.success('News removed from saved');
        } else {
          setSavedNewsIds(prev => [...prev, newsId]);
          toast.success('News saved successfully');
        }
      } else {
        toast.error(response.error || 'Failed to save news');
      }
    } catch (error) {
      console.error('Error saving news:', error);
      toast.error('Failed to save news');
    } finally {
      setSaving(null);
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

  const isNewsSaved = (newsId: string) => {
    return savedNewsIds.includes(newsId);
  };

  const filteredNews = showSavedOnly 
    ? news.filter(item => isNewsSaved(item.id))
    : news;

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{category.label}</span>
              </button>
            );
          })}
        </div>

        {/* Saved News Filter */}
        <Button
          variant={showSavedOnly ? 'default' : 'outline'}
          size="sm"
          onClick={() => setShowSavedOnly(!showSavedOnly)}
          className="flex items-center space-x-2"
        >
          <Filter className="h-4 w-4" />
          <span>{showSavedOnly ? 'Show All' : 'Show Saved Only'}</span>
        </Button>
      </div>

      {/* News Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 animate-pulse">
              <div className="space-y-4">
                <div className="h-48 bg-gray-200 rounded-lg"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((item, index) => (
            <article key={item.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
              {/* Image */}
              {item.image && (
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(item.category)}`}>
                      {item.category}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSaveNews(item.id)}
                      disabled={saving === item.id}
                      className="h-8 w-8 p-0 bg-white/80 hover:bg-white/90"
                      title={isNewsSaved(item.id) ? 'Remove from saved' : 'Save news'}
                    >
                      {isNewsSaved(item.id) ? (
                        <BookmarkCheck className="h-4 w-4 text-blue-600" />
                      ) : (
                        <Bookmark className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Content */}
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-sm text-gray-500">{item.source}</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-sm text-gray-500">{item.publishedAt}</span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {item.summary}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    {item.readTime && (
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{item.readTime}</span>
                      </div>
                    )}
                  </div>
                  
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 flex items-center space-x-1 font-medium text-sm"
                  >
                    <span>Read More</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredNews.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
            {showSavedOnly ? <BookmarkCheck className="h-12 w-12" /> : <TrendingUp className="h-12 w-12" />}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {showSavedOnly ? 'No saved news yet' : 'No news found'}
          </h3>
          <p className="text-gray-500">
            {showSavedOnly 
              ? 'Save interesting articles to read them later.'
              : 'Try adjusting your filters or check back later for new articles.'
            }
          </p>
        </div>
      )}

      {/* Load More Button */}
      {!loading && filteredNews.length > 0 && !showSavedOnly && (
        <div className="text-center pt-4">
          <Button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Load More News
          </Button>
        </div>
      )}
    </div>
  );
} 