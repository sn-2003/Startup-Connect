'use client';

import { useState, useEffect } from 'react';
import { ExternalLink, Clock, TrendingUp, DollarSign, Users, Zap } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

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
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchNews();
  }, [selectedCategory]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getNews({
        category: selectedCategory === 'all' ? undefined : selectedCategory,
        limit: 5,
        featured: true
      });

      if (response.success) {
        setNews(response.data);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
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

  return (
    <div className="space-y-6">
      {/* Category Filter */}
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

      {/* News Grid */}
      {loading ? (
        <div className="grid gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-4 animate-pulse">
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
        <div className="grid gap-4">
          {news.map((item, index) => (
          <article key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex space-x-4">
              {item.image && (
                <div className="flex-shrink-0">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="h-20 w-32 object-cover rounded-lg"
                  />
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {item.summary}
                    </p>
                  </div>
                  
                  <div className="flex-shrink-0 ml-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                      {item.category}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span className="font-medium text-gray-700">{item.source}</span>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{item.publishedAt}</span>
                    </div>
                    <span>{item.readTime}</span>
                  </div>
                  
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                  >
                    <span>Read</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Load More Button */}
      <div className="text-center pt-4">
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Load More News
        </button>
      </div>
    </div>
  );
} 