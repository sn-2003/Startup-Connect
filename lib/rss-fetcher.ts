import { prisma } from './prisma';
import Parser from 'rss-parser';

const parser = new Parser();

interface RSSItem {
  title: string;
  link: string;
  pubDate: string;
  content?: string;
  contentSnippet?: string;
  categories?: string[];
  author?: string;
  'media:content'?: { $: { url: string } };
  'media:thumbnail'?: { $: { url: string } };
}

interface RSSFeed {
  title: string;
  description: string;
  link: string;
  items: RSSItem[];
}

const RSS_FEEDS = [
  {
    name: 'TechCrunch',
    url: 'https://techcrunch.com/feed/',
    category: 'TECHNOLOGY' as const,
    tags: ['tech', 'startups', 'funding']
  },
  {
    name: 'YourStory',
    url: 'https://yourstory.com/feed',
    category: 'STARTUP' as const,
    tags: ['india', 'startups', 'entrepreneurship']
  },
  {
    name: 'Inc42',
    url: 'https://inc42.com/feed/',
    category: 'STARTUP' as const,
    tags: ['india', 'startups', 'tech']
  },
  {
    name: 'VentureBeat',
    url: 'https://venturebeat.com/feed/',
    category: 'TECHNOLOGY' as const,
    tags: ['tech', 'startups', 'ai']
  }
];

export async function fetchRSSFeeds() {
  console.log('🔄 Fetching RSS feeds...');
  
  for (const feed of RSS_FEEDS) {
    try {
      console.log(`📡 Fetching ${feed.name}...`);
      
      const rssFeed: RSSFeed = await parser.parseURL(feed.url);
      
      for (const item of rssFeed.items.slice(0, 10)) { // Limit to 10 latest articles
        await processRSSItem(item, feed);
      }
      
      console.log(`✅ Processed ${feed.name}`);
    } catch (error) {
      console.error(`❌ Error fetching ${feed.name}:`, error);
    }
  }
  
  console.log('✅ RSS feed fetching completed');
}

async function processRSSItem(item: RSSItem, feed: typeof RSS_FEEDS[0]) {
  try {
    // Check if article already exists
    const existingNews = await prisma.news.findFirst({
      where: { url: item.link }
    });

    if (existingNews) {
      return; // Skip if already exists
    }

    // Extract image URL
    let imageUrl = null;
    if (item['media:content']?.$?.url) {
      imageUrl = item['media:content'].$.url;
    } else if (item['media:thumbnail']?.$?.url) {
      imageUrl = item['media:thumbnail'].$.url;
    }

    // Extract content
    const content = item.content || item.contentSnippet || '';

    // Generate summary from content
    const summary = content.length > 200 
      ? content.substring(0, 200) + '...'
      : content;

    // Estimate read time
    const wordCount = content.split(' ').length;
    const readTime = Math.ceil(wordCount / 200); // 200 words per minute

    // Create news article
    await prisma.news.create({
      data: {
        title: item.title,
        summary: summary,
        content: content,
        source: feed.name,
        url: item.link,
        publishedAt: new Date(item.pubDate),
        category: feed.category,
        readTime: `${readTime} min read`,
        image: imageUrl,
        author: item.author,
        tags: [...feed.tags, ...(item.categories || [])],
        sourceType: 'RSS'
      }
    });

  } catch (error) {
    console.error('Error processing RSS item:', error);
  }
}

// Function to clean old articles (keep last 1000)
export async function cleanOldArticles() {
  try {
    const totalArticles = await prisma.news.count();
    
    if (totalArticles > 1000) {
      const articlesToDelete = totalArticles - 1000;
      
      // Delete oldest articles
      await prisma.news.deleteMany({
        where: {
          id: {
            in: (
              await prisma.news.findMany({
                select: { id: true },
                orderBy: { publishedAt: 'asc' },
                take: articlesToDelete
              })
            ).map(article => article.id)
          }
        }
      });
      
      console.log(`🗑️ Deleted ${articlesToDelete} old articles`);
    }
  } catch (error) {
    console.error('Error cleaning old articles:', error);
  }
} 