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
  BookmarkCheck,
  Share2,
  Eye,
  Calendar,
  Star,
  ArrowRight,
  Sparkles,
  Check
} from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

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
  { id: 'all', label: 'All News', icon: TrendingUp, color: 'bg-gradient-to-r from-blue-500 to-purple-600' },
  { id: 'STARTUP', label: 'Startups', icon: Zap, color: 'bg-gradient-to-r from-green-500 to-emerald-600' },
  { id: 'INVESTMENT', label: 'Investment', icon: DollarSign, color: 'bg-gradient-to-r from-yellow-500 to-orange-600' },
  { id: 'TECHNOLOGY', label: 'Technology', icon: TrendingUp, color: 'bg-gradient-to-r from-purple-500 to-pink-600' },
  { id: 'MARKETING', label: 'Marketing', icon: TrendingUp, color: 'bg-gradient-to-r from-red-500 to-pink-600' },
  { id: 'DESIGN', label: 'Design', icon: TrendingUp, color: 'bg-gradient-to-r from-indigo-500 to-purple-600' },
  { id: 'PRODUCTIVITY', label: 'Productivity', icon: TrendingUp, color: 'bg-gradient-to-r from-teal-500 to-cyan-600' },
  { id: 'ANALYTICS', label: 'Analytics', icon: TrendingUp, color: 'bg-gradient-to-r from-blue-500 to-indigo-600' },
  { id: 'FINANCE', label: 'Finance', icon: TrendingUp, color: 'bg-gradient-to-r from-green-500 to-teal-600' },
  { id: 'COMMUNICATION', label: 'Communication', icon: TrendingUp, color: 'bg-gradient-to-r from-orange-500 to-red-600' },
  { id: 'CAREERS', label: 'Careers', icon: TrendingUp, color: 'bg-gradient-to-r from-gray-500 to-slate-600' },
  { id: 'GENERAL', label: 'General', icon: TrendingUp, color: 'bg-gradient-to-r from-slate-500 to-gray-600' }
];

export default function NewsPage() {
  const { user } = useAuth();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'trending'>('latest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [viewedArticles, setViewedArticles] = useState<Set<string>>(new Set());
  const [recentlyViewed, setRecentlyViewed] = useState<Set<string>>(new Set());
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);
  const [savedNewsIds, setSavedNewsIds] = useState<string[]>([]);

  useEffect(() => {
    fetchNews();
    if (user) {
      fetchSavedNews();
    }
  }, [selectedCategory, searchQuery, sortBy, showSavedOnly, user]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getNews({
        category: selectedCategory === 'all' ? undefined : selectedCategory,
        search: searchQuery || undefined,
        sortBy: sortBy,
        limit: 50,
        featured: showSavedOnly ? undefined : true
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

  const getCategoryColor = (category: string) => {
    const colors = {
      STARTUP: 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200',
      INVESTMENT: 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border-yellow-200',
      TECHNOLOGY: 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border-purple-200',
      MARKETING: 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-red-200',
      DESIGN: 'bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 border-indigo-200',
      PRODUCTIVITY: 'bg-gradient-to-r from-teal-100 to-cyan-100 text-teal-800 border-teal-200',
      ANALYTICS: 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200',
      FINANCE: 'bg-gradient-to-r from-green-100 to-teal-100 text-green-800 border-green-200',
      COMMUNICATION: 'bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 border-orange-200',
      CAREERS: 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-gray-200',
      GENERAL: 'bg-gradient-to-r from-slate-100 to-gray-100 text-slate-800 border-slate-200'
    };
    return colors[category as keyof typeof colors] || colors.GENERAL;
  };

  const handleBookmark = async (newsId: string) => {
    if (!user) {
      toast.error('Please login to bookmark articles');
      return;
    }

    setSaving(newsId);
    try {
      const response = await apiClient.saveNews(newsId);
      if (response.success) {
        const isCurrentlySaved = savedNewsIds.includes(newsId);
        if (isCurrentlySaved) {
          setSavedNewsIds(prev => prev.filter(id => id !== newsId));
          toast.success('Article removed from saved');
        } else {
          setSavedNewsIds(prev => [...prev, newsId]);
          toast.success('Article saved successfully');
        }
      } else {
        toast.error(response.error || 'Failed to bookmark article');
      }
    } catch (error) {
      console.error('Error bookmarking article:', error);
      toast.error('Failed to bookmark article');
    } finally {
      setSaving(null);
    }
  };

  const handleViewArticle = async (newsId: string, url: string) => {
    try {
      // Mark as viewed locally for immediate feedback
      setViewedArticles(prev => new Set([...prev, newsId]));
      
      // Add pulse effect for recently viewed
      setRecentlyViewed(prev => new Set([...prev, newsId]));
      setTimeout(() => {
        setRecentlyViewed(prev => {
          const newSet = new Set(prev);
          newSet.delete(newsId);
          return newSet;
        });
      }, 2000);
      
      // Increment view count in database
      const response = await apiClient.getNewsArticle(newsId);
      if (response.success) {
        // Update local state to show immediate feedback
        setNews(prevNews => 
          prevNews.map(item => 
            item.id === newsId 
              ? { ...item, views: item.views + 1 }
              : item
          )
        );
      }
      
      // Open article in new tab
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Error viewing article:', error);
      // Still open the article even if view count fails
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const isNewsSaved = (newsId: string) => {
    return savedNewsIds.includes(newsId);
  };

  const filteredNews = showSavedOnly 
    ? news.filter(item => isNewsSaved(item.id))
    : news;
  
  const featuredNews = filteredNews.filter(item => item.featured).slice(0, 3);
  const regularNews = filteredNews.filter(item => !item.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      <MainHeader />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-800 via-purple-800 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="h-8 w-8 mr-3" />
              <h1 className="text-4xl font-bold">Latest Startup News</h1>
            </div>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Stay updated with the latest insights, funding rounds, and innovations from the startup ecosystem
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
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                />
              </div>
            </div>

            {/* Sort and View Toggle */}
            <div className="flex gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'latest' | 'popular' | 'trending')}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              >
                <option value="latest">Latest First</option>
                <option value="popular">Most Popular</option>
                <option value="trending">Trending</option>
              </select>
              
              <div className="flex border border-gray-300 rounded-xl overflow-hidden shadow-sm">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-3 transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-3 transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  List
                </button>
              </div>

              {/* Show Saved Only Filter */}
              {user && (
                <button
                  onClick={() => setShowSavedOnly(!showSavedOnly)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 shadow-sm ${
                    showSavedOnly
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 hover:shadow-md'
                  }`}
                >
                  <Bookmark className="h-4 w-4" />
                  <span>{showSavedOnly ? 'Show All' : 'Show Saved Only'}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 shadow-sm ${
                    selectedCategory === category.id
                      ? `${category.color} text-white shadow-lg transform scale-105`
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 hover:shadow-md'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{category.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Featured News Section */}
        {featuredNews.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <Star className="h-6 w-6 text-yellow-500 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Featured Stories</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredNews.map((item, index) => (
                <article key={item.id} className={`bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                  recentlyViewed.has(item.id) ? 'pulse-viewed' : ''
                }`}>
                  <div 
                    className="relative h-48 cursor-pointer"
                    onClick={() => handleViewArticle(item.id, item.url)}
                  >
                    {item.image ? (
                      <Image
                      src={item.image} 
                      alt={item.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                        <span className="text-white text-lg font-semibold">{item.source}</span>
                  </div>
                )}
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(item.category)}`}>
                          {item.category}
                        </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookmark(item.id);
                        }}
                        disabled={saving === item.id}
                        className={`p-2 rounded-full transition-colors ${
                          isNewsSaved(item.id)
                            ? 'text-yellow-500 bg-yellow-50' 
                            : 'text-white bg-black bg-opacity-30 hover:bg-opacity-50'
                        }`}
                      >
                        {isNewsSaved(item.id) ? (
                          <BookmarkCheck className="h-4 w-4 fill-current" />
                        ) : (
                          <Bookmark className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="text-sm text-gray-500">{item.source}</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-sm text-gray-500">{formatDate(item.publishedAt)}</span>
                      {viewedArticles.has(item.id) && (
                        <>
                          <span className="text-gray-300">•</span>
                          <span className="text-sm text-blue-600 font-medium flex items-center space-x-1">
                            <Check className="h-3 w-3" />
                            <span>Viewed</span>
                          </span>
                        </>
                      )}
                    </div>
                    
                    <h3 
                      className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 hover:text-blue-600 transition-colors cursor-pointer"
                      onClick={() => handleViewArticle(item.id, item.url)}
                    >
                      {item.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3 text-sm">
                      {item.summary}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div
                          className="flex items-center space-x-1 text-gray-500"
                          title={`${item.views.toLocaleString()} views`}
                        >
                          <Eye className="h-4 w-4" />
                          <span>{item.views.toLocaleString()}</span>
                        </div>
                        <span>{item.readTime}</span>
                      </div>
                      
                      <button
                        onClick={() => handleViewArticle(item.id, item.url)}
                        className="text-blue-600 hover:text-blue-700 flex items-center space-x-1 font-medium text-sm"
                      >
                        <span>Read More</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* Regular News Grid/List */}
        {loading ? (
          <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'grid gap-6'}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 animate-pulse shadow-sm">
                <div className="flex space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-20 w-32 bg-gray-200 rounded-xl"></div>
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
          <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'grid gap-6'}>
            {regularNews.map((item) => (
              <article key={item.id} className={`bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${
                viewMode === 'list' ? 'md:flex' : ''
              } ${recentlyViewed.has(item.id) ? 'pulse-viewed' : ''}`}>
                <div className={`relative ${viewMode === 'list' ? 'md:w-80 md:flex-shrink-0' : ''}`}>
                  <div 
                    className={`${viewMode === 'list' ? 'h-full' : 'h-48'} cursor-pointer`}
                    onClick={() => handleViewArticle(item.id, item.url)}
                  >
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes={viewMode === 'list' ? "(max-width: 768px) 100vw, 320px" : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center">
                        <span className="text-white text-lg font-semibold">{item.source}</span>
                      </div>
                    )}
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(item.category)}`}>
                      {item.category}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <button
                      onClick={() => handleBookmark(item.id)}
                      className={`p-2 rounded-full transition-colors ${
                        (item._count?.userBookmarks ?? 0) > 0
                          ? 'text-yellow-500 bg-yellow-50' 
                          : 'text-white bg-black bg-opacity-30 hover:bg-opacity-50'
                      }`}
                    >
                      <Bookmark className={`h-4 w-4 ${(item._count?.userBookmarks ?? 0) > 0 ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>
                
                <div className={`p-6 flex-1 ${viewMode === 'list' ? 'md:flex md:flex-col md:justify-between' : ''}`}>
                  <div>
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="text-sm text-gray-500">{item.source}</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-sm text-gray-500">{formatDate(item.publishedAt)}</span>
                      {viewedArticles.has(item.id) && (
                        <>
                          <span className="text-gray-300">•</span>
                          <span className="text-sm text-blue-600 font-medium flex items-center space-x-1">
                            <Check className="h-3 w-3" />
                            <span>Viewed</span>
                          </span>
                        </>
                      )}
                    </div>
                    
                    <h3 
                      className={`font-semibold text-gray-900 mb-3 hover:text-blue-600 transition-colors cursor-pointer ${
                        viewMode === 'list' ? 'text-xl' : 'text-lg'
                      } line-clamp-2`}
                      onClick={() => handleViewArticle(item.id, item.url)}
                    >
                      {item.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3 text-sm">
                      {item.summary}
                    </p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                      {item.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                      {item.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                          +{item.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div
                        className="flex items-center space-x-1 text-gray-500"
                        title={`${item.views.toLocaleString()} views`}
                      >
                        <Eye className="h-4 w-4" />
                        <span>{item.views.toLocaleString()}</span>
                      </div>
                      <span>{item.readTime}</span>
                    </div>
                    
                    <button
                      onClick={() => handleViewArticle(item.id, item.url)}
                      className="text-blue-600 hover:text-blue-700 flex items-center space-x-1 font-medium text-sm"
                    >
                      <span>Read More</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                </div>
              </div>
            </article>
          ))}
        </div>
        )}

        {/* Empty State */}
        {!loading && filteredNews.length === 0 && (
          <div className="text-center py-16">
            <div className="mx-auto h-16 w-16 text-gray-400 mb-6">
              {showSavedOnly ? <BookmarkCheck className="h-16 w-16" /> : <TrendingUp className="h-16 w-16" />}
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              {showSavedOnly ? 'No saved articles yet' : 'No news articles found'}
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {showSavedOnly 
                ? 'Save interesting articles to read them later. Try browsing all news and bookmarking articles you find interesting.'
                : 'Try adjusting your search terms or filters. New articles are added regularly.'
              }
            </p>
          </div>
        )}

        {/* Load More Button */}
        {regularNews.length > 0 && !showSavedOnly && (
          <div className="text-center pt-12">
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            Load More News
          </button>
        </div>
        )}
      </div>
    </div>
  );
} 