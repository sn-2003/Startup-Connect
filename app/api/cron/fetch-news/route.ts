import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import Parser from 'rss-parser';

// Calculate estimated read time in minutes
function calculateReadTime(text: string): string {
  const wordsPerMinute = 200; // Average reading speed
  const wordCount = text.trim().split(/\s+/).length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);
  return readTime <= 1 ? '1 min read' : `${readTime} min read`;
}

const prisma = new PrismaClient();
const parser = new Parser();

import { NewsCategory } from '@prisma/client';

interface RssFeed {
  name: string;
  url: string;
  category: NewsCategory;
  tags: string[];
}

const RSS_FEEDS: RssFeed[] = [
  // Indian News Sources (Priority)
  {
    name: 'YourStory',
    url: 'https://yourstory.com/feed',
    category: NewsCategory.STARTUP,
    tags: ['india', 'startups', 'entrepreneurship', 'investment']
  },
  {
    name: 'Inc42',
    url: 'https://inc42.com/feed/',
    category: NewsCategory.STARTUP,
    tags: ['india', 'startups', 'tech', 'investment']
  },
  {
    name: 'Livemint Technology',
    url: 'https://www.livemint.com/rss/technology',
    category: NewsCategory.TECHNOLOGY,
    tags: ['india', 'tech', 'startups', 'investment']
  },
  // Add other feeds as needed
];

// Check if the request is authorized (using Vercel Cron Secret)
function isAuthorized(request: Request) {
  const authHeader = request.headers.get('authorization');
  return authHeader === `Bearer ${process.env.CRON_SECRET}`;
}

async function processRSSItem(item: any, feed: any) {
  try {
    const existingArticle = await prisma.news.findFirst({
      where: { url: item.link }
    });

    if (existingArticle) return;

    await prisma.news.create({
      data: {
        title: item.title?.substring(0, 200) || 'No title', // Ensure title is not too long
        summary: (item.contentSnippet || '').substring(0, 200) || 'No summary available',
        content: item.content || item.contentSnippet || '',
        url: item.link,
        source: feed.name,
        publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
        image: item.enclosure?.url || item.image?.url || null,
        category: feed.category,
        tags: feed.tags,
        sourceType: 'RSS' as const,
        readTime: calculateReadTime(item.content || item.contentSnippet || '')
      },
    });
  } catch (error) {
    console.error(`Error processing item from ${feed.name}:`, error);
  }
}

export async function GET(request: Request) {
  // Verify the request is from Vercel Cron
  if (!isAuthorized(request)) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    // Process each feed
    for (const feed of RSS_FEEDS) {
      try {
        const feedData = await parser.parseURL(feed.url);
        
        // Process each item in the feed
        for (const item of feedData.items.slice(0, 10)) { // Limit to 10 items per feed
          await processRSSItem(item, feed);
        }
      } catch (error) {
        console.error(`Error fetching feed ${feed.name}:`, error);
        continue;
      }
    }

    // Clean up old articles (older than 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    await prisma.news.deleteMany({
      where: {
        publishedAt: {
          lt: thirtyDaysAgo,
        },
      },
    });

    return NextResponse.json({ success: true, message: 'News updated successfully' });
  } catch (error) {
    console.error('Error in news fetch cron job:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update news' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
