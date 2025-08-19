'use client';

import { useState } from 'react';
import { ExternalLink, Star, Zap, Users, TrendingUp } from 'lucide-react';

interface AITool {
  id: string;
  name: string;
  description: string;
  category: 'development' | 'design' | 'marketing' | 'productivity' | 'analytics';
  image: string;
  url: string;
  rating: number;
  users: string;
  pricing: string;
  featured: boolean;
}

const aiTools: AITool[] = [
  {
    id: '1',
    name: 'v0.dev',
    description: 'AI-powered code generation for React components and full-stack applications. Generate production-ready code from natural language descriptions.',
    category: 'development',
    image: '/tools/v0.jpeg',
    url: 'https://v0.dev',
    rating: 4.8,
    users: '50K+',
    pricing: 'Free',
    featured: true
  },
  {
    id: '2',
    name: 'Bolt',
    description: 'AI-powered design tool that helps create stunning UI/UX designs, prototypes, and visual assets for your startup.',
    category: 'design',
    image: '/tools/bolt.jpeg',
    url: 'https://bolt.com',
    rating: 4.6,
    users: '25K+',
    pricing: 'From $29/mo',
    featured: true
  },
  {
    id: '3',
    name: 'Jasper',
    description: 'AI content creation platform for marketing copy, blog posts, social media content, and product descriptions.',
    category: 'marketing',
    image: '/tools/jasper.jpeg',
    url: 'https://jasper.ai',
    rating: 4.7,
    users: '100K+',
    pricing: 'From $39/mo',
    featured: false
  },
  {
    id: '4',
    name: 'Notion AI',
    description: 'AI-powered workspace that helps with writing, brainstorming, project management, and team collaboration.',
    category: 'productivity',
    image: '/tools/notion.png',
    url: 'https://notion.so',
    rating: 4.5,
    users: '500K+',
    pricing: 'From $8/mo',
    featured: false
  },
  {
    id: '5',
    name: 'Mixpanel',
    description: 'Product analytics platform that helps startups understand user behavior and optimize their products.',
    category: 'analytics',
    image: '/tools/mixpanel.png',
    url: 'https://mixpanel.com',
    rating: 4.4,
    users: '200K+',
    pricing: 'From $25/mo',
    featured: false
  },
  {
    id: '6',
    name: 'GitHub Copilot',
    description: 'AI pair programmer that helps you write code faster and with fewer errors by suggesting whole lines or blocks of code.',
    category: 'development',
    image: '/tools/github.jpeg',
    url: 'https://github.com/features/copilot',
    rating: 4.3,
    users: '1M+',
    pricing: '$10/mo',
    featured: false
  }
];

export default function AITools() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(0);

  const categories = [
    { id: 'all', label: 'All Tools', icon: Zap },
    { id: 'development', label: 'Development', icon: Zap },
    { id: 'design', label: 'Design', icon: Users },
    { id: 'marketing', label: 'Marketing', icon: TrendingUp },
    { id: 'productivity', label: 'Productivity', icon: Zap },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp }
  ];

  const filteredTools = selectedCategory === 'all' 
    ? aiTools 
    : aiTools.filter(tool => tool.category === selectedCategory);

  // Split tools into pairs for two-column display
  const toolPairs = [];
  for (let i = 0; i < filteredTools.length; i += 2) {
    toolPairs.push(filteredTools.slice(i, i + 2));
  }

  const currentPair = toolPairs[currentPage] || [];

  const getCategoryColor = (category: string) => {
    const colors = {
      development: 'bg-blue-100 text-blue-800',
      design: 'bg-purple-100 text-purple-800',
      marketing: 'bg-green-100 text-green-800',
      productivity: 'bg-orange-100 text-orange-800',
      analytics: 'bg-red-100 text-red-800'
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
              onClick={() => {
                setSelectedCategory(category.id);
                setCurrentPage(0);
              }}
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

      {/* Tools Grid - Horizontal Scroll on Mobile, Two Columns on Desktop */}
      <div className="lg:hidden overflow-x-auto pb-4 -mx-4 px-4">
        <div className="flex space-x-4 w-max">
          {filteredTools.map((tool) => (
            <div key={tool.id} className="w-64 flex-shrink-0 bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              {/* Tool Image */}
              <div className="relative h-32 bg-gray-100">
                <img 
                  src={tool.image} 
                  alt={tool.name}
                  className="w-full h-full object-cover"
                />
                {tool.featured && (
                  <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-0.5 rounded-full text-xs font-medium">
                    Featured
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-white bg-opacity-90 rounded-full px-1.5 py-0.5 flex items-center space-x-0.5">
                  <Star className="h-3 w-3 text-yellow-500 fill-current" />
                  <span className="text-xs font-medium">{tool.rating}</span>
                </div>
              </div>

              {/* Tool Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-base font-semibold text-gray-900">{tool.name}</h3>
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium ${getCategoryColor(tool.category)}`}>
                    {tool.category}
                  </span>
                </div>

                <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                  {tool.description}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span>{tool.users} users</span>
                  <span className="font-medium text-gray-700">{tool.pricing}</span>
                </div>

                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-blue-600 text-white py-1.5 px-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1 text-sm"
                >
                  <span>Try Now</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop View - Two Columns */}
      <div className="hidden lg:grid grid-cols-2 gap-6">
        {currentPair.map((tool) => (
          <div key={tool.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
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
                <span className="text-xs font-medium">{tool.rating}</span>
              </div>
            </div>

            {/* Tool Content */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">{tool.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(tool.category)}`}>
                  {tool.category}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {tool.description}
              </p>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center space-x-4">
                  <span>{tool.users} users</span>
                  <span className="font-medium text-gray-700">{tool.pricing}</span>
                </div>
              </div>

              <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <span>Try Tool</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {toolPairs.length > 1 && (
        <div className="flex justify-center space-x-4">
          
          
          
        </div>
      )}

      {/* View All Tools Button */}
      <div className="text-center pt-4">
        <a
          href="/dashboard?tab=tools"
          className="inline-flex items-center space-x-2 bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <span>View All AI Tools</span>
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
} 