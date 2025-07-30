'use client';

import { useState, useEffect } from 'react';
import { Quote, User, Twitter } from 'lucide-react';

interface FounderInsight {
  id: string;
  quote: string;
  author: string;
  title: string;
  company: string;
  twitter?: string;
  category: 'growth' | 'fundraising' | 'product' | 'team' | 'mindset';
}

const founderInsights: FounderInsight[] = [
  {
    id: '1',
    quote: "The best way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
    title: "Founder",
    company: "The Walt Disney Company",
    category: 'mindset'
  },
  {
    id: '2',
    quote: "Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work.",
    author: "Steve Jobs",
    title: "Co-founder",
    company: "Apple",
    category: 'mindset'
  },
  {
    id: '3',
    quote: "The biggest risk is not taking any risk. In a world that's changing really quickly, the only strategy that is guaranteed to fail is not taking risks.",
    author: "Mark Zuckerberg",
    title: "Founder & CEO",
    company: "Meta",
    category: 'growth'
  },
  {
    id: '4',
    quote: "It's not about ideas. It's about making ideas happen.",
    author: "Scott Belsky",
    title: "Founder",
    company: "Behance",
    category: 'product'
  },
  {
    id: '5',
    quote: "The most important single ingredient in the formula of success is knowing how to get along with people.",
    author: "Theodore Roosevelt",
    title: "Former President",
    company: "United States",
    category: 'team'
  },
  {
    id: '6',
    quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
    title: "Former Prime Minister",
    company: "United Kingdom",
    category: 'mindset'
  }
];

export default function FounderInsights() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % founderInsights.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const currentInsight = founderInsights[currentIndex];

  const getCategoryColor = (category: string) => {
    const colors = {
      growth: 'bg-green-100 text-green-800',
      fundraising: 'bg-blue-100 text-blue-800',
      product: 'bg-purple-100 text-purple-800',
      team: 'bg-orange-100 text-orange-800',
      mindset: 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || colors.mindset;
  };

  return (
    <div className="relative">
      {/* Insight Card */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center">
              <Quote className="h-6 w-6 text-white" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <blockquote className="text-lg text-gray-900 mb-4 leading-relaxed">
              "{currentInsight.quote}"
            </blockquote>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{currentInsight.author}</p>
                  <p className="text-xs text-gray-600">{currentInsight.title} at {currentInsight.company}</p>
                </div>
              </div>
              
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(currentInsight.category)}`}>
                {currentInsight.category}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center mt-6 space-x-2">
        {founderInsights.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index);
              setIsAutoPlaying(false);
            }}
            className={`h-2 w-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      {/* Auto-play Toggle */}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className="text-xs text-gray-500 hover:text-gray-700 flex items-center space-x-1"
        >
          <div className={`h-2 w-2 rounded-full ${isAutoPlaying ? 'bg-green-500' : 'bg-gray-400'}`} />
          <span>{isAutoPlaying ? 'Auto-playing' : 'Paused'}</span>
        </button>
      </div>
    </div>
  );
} 