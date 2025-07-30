const { PrismaClient } = require('@prisma/client');
const Parser = require('rss-parser');

const prisma = new PrismaClient();
const parser = new Parser();

const RSS_FEEDS = [
  // Indian News Sources (Priority)
  {
    name: 'YourStory',
    url: 'https://yourstory.com/feed',
    category: 'STARTUP',
    tags: ['india', 'startups', 'entrepreneurship', 'investment']
  },
  {
    name: 'Inc42',
    url: 'https://inc42.com/feed/',
    category: 'STARTUP',
    tags: ['india', 'startups', 'tech', 'investment']
  },
  {
    name: 'Livemint Technology',
    url: 'https://www.livemint.com/rss/technology',
    category: 'TECHNOLOGY',
    tags: ['india', 'tech', 'startups', 'investment']
  },
  {
    name: 'The Hindu BusinessLine',
    url: 'https://www.thehindubusinessline.com/news/national/?service=rss',
    category: 'STARTUP',
    tags: ['india', 'business', 'startups', 'investment']
  },
  {
    name: 'Times of India Business',
    url: 'https://timesofindia.indiatimes.com/rssfeedstopstories.cms',
    category: 'STARTUP',
    tags: ['india', 'business', 'startups', 'investment']
  },
  {
    name: 'Hindustan Times Business',
    url: 'https://www.hindustantimes.com/feeds/rss/business-news/rssfeed.xml',
    category: 'STARTUP',
    tags: ['india', 'business', 'startups', 'investment']
  },
  {
    name: 'The Ken',
    url: 'https://the-ken.com/feed/',
    category: 'STARTUP',
    tags: ['india', 'startups', 'analysis', 'investment']
  },
  {
    name: 'FactorDaily',
    url: 'https://factordaily.com/feed/',
    category: 'TECHNOLOGY',
    tags: ['india', 'tech', 'startups', 'innovation']
  },
  // International Sources (Secondary)
  {
    name: 'TechCrunch',
    url: 'https://techcrunch.com/feed/',
    category: 'TECHNOLOGY',
    tags: ['tech', 'startups', 'funding', 'investment']
  },
  {
    name: 'VentureBeat',
    url: 'https://venturebeat.com/feed/',
    category: 'TECHNOLOGY',
    tags: ['tech', 'startups', 'ai', 'investment']
  },
  {
    name: 'Crunchbase News',
    url: 'https://news.crunchbase.com/feed/',
    category: 'INVESTMENT',
    tags: ['investment', 'funding', 'startups', 'venture-capital']
  },
  {
    name: 'Tech.eu',
    url: 'https://tech.eu/feed/',
    category: 'TECHNOLOGY',
    tags: ['europe', 'tech', 'startups', 'investment']
  },

  {
    name: 'Product Hunt',
    url: 'https://www.producthunt.com/feed',
    category: 'TECHNOLOGY',
    tags: ['products', 'launch', 'startups', 'tech']
  }
];

async function processRSSItem(item, feed) {
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

    // Extract content and strip HTML tags
    const rawContent = item.content || item.contentSnippet || item.description || '';
    
    // Strip HTML tags for clean text
    const cleanContent = rawContent.replace(/<[^>]*>/g, '');
    
    // Generate summary from clean content (ensure it's clean)
    let summary = cleanContent.length > 200 
      ? cleanContent.substring(0, 200) + '...'
      : cleanContent;
    
    // Double-check summary is clean
    summary = summary.replace(/<[^>]*>/g, '');

    // Estimate read time
    const wordCount = cleanContent.split(' ').length;
    const readTime = Math.ceil(wordCount / 200); // 200 words per minute

    // Smart category detection based on content
    let detectedCategory = feed.category;
    const titleAndContent = (item.title + ' ' + cleanContent).toLowerCase();
    
    if (titleAndContent.includes('funding') || titleAndContent.includes('investment') || 
        titleAndContent.includes('series') || titleAndContent.includes('raise') ||
        titleAndContent.includes('venture') || titleAndContent.includes('capital') ||
        titleAndContent.includes('crore') || titleAndContent.includes('rs') ||
        titleAndContent.includes('rupee') || titleAndContent.includes('dollar')) {
      detectedCategory = 'INVESTMENT';
    } else if (titleAndContent.includes('acquisition') || titleAndContent.includes('merger') ||
               titleAndContent.includes('buyout') || titleAndContent.includes('exit') ||
               titleAndContent.includes('takeover')) {
      detectedCategory = 'INVESTMENT';
    } else if (titleAndContent.includes('ai') || titleAndContent.includes('artificial intelligence') ||
               titleAndContent.includes('machine learning') || titleAndContent.includes('ml') ||
               titleAndContent.includes('blockchain') || titleAndContent.includes('fintech') ||
               titleAndContent.includes('edtech') || titleAndContent.includes('healthtech')) {
      detectedCategory = 'TECHNOLOGY';
    } else if (titleAndContent.includes('marketing') || titleAndContent.includes('growth') ||
               titleAndContent.includes('customer') || titleAndContent.includes('user') ||
               titleAndContent.includes('revenue') || titleAndContent.includes('sales')) {
      detectedCategory = 'MARKETING';
    } else if (titleAndContent.includes('design') || titleAndContent.includes('ui') ||
               titleAndContent.includes('ux') || titleAndContent.includes('interface') ||
               titleAndContent.includes('product')) {
      detectedCategory = 'DESIGN';
    }

    // Enhanced tags based on content
    let enhancedTags = [...feed.tags, ...(item.categories || [])];
    
    // Add investment-related tags
    if (titleAndContent.includes('funding') || titleAndContent.includes('investment')) {
      enhancedTags.push('investment', 'funding');
    }
    if (titleAndContent.includes('series a') || titleAndContent.includes('series b') || 
        titleAndContent.includes('series c') || titleAndContent.includes('seed')) {
      enhancedTags.push('funding-round');
    }
    if (titleAndContent.includes('venture capital') || titleAndContent.includes('vc')) {
      enhancedTags.push('venture-capital');
    }
    if (titleAndContent.includes('acquisition') || titleAndContent.includes('exit')) {
      enhancedTags.push('acquisition', 'exit');
    }
    
    // Add Indian-specific tags
    if (titleAndContent.includes('india') || titleAndContent.includes('indian') ||
        titleAndContent.includes('bangalore') || titleAndContent.includes('mumbai') ||
        titleAndContent.includes('delhi') || titleAndContent.includes('hyderabad') ||
        titleAndContent.includes('chennai') || titleAndContent.includes('pune')) {
      enhancedTags.push('india', 'indian-startup');
    }
    
    // Add sector-specific tags
    if (titleAndContent.includes('fintech') || titleAndContent.includes('financial')) {
      enhancedTags.push('fintech', 'financial-services');
    }
    if (titleAndContent.includes('edtech') || titleAndContent.includes('education')) {
      enhancedTags.push('edtech', 'education');
    }
    if (titleAndContent.includes('healthtech') || titleAndContent.includes('healthcare')) {
      enhancedTags.push('healthtech', 'healthcare');
    }
    if (titleAndContent.includes('ecommerce') || titleAndContent.includes('e-commerce')) {
      enhancedTags.push('ecommerce', 'retail');
    }
    if (titleAndContent.includes('logistics') || titleAndContent.includes('supply chain')) {
      enhancedTags.push('logistics', 'supply-chain');
    }

    // Create news article
    await prisma.news.create({
      data: {
        title: item.title,
        summary: summary,
        content: cleanContent,
        source: feed.name,
        url: item.link,
        publishedAt: new Date(item.pubDate),
        category: detectedCategory,
        readTime: `${readTime} min read`,
        image: imageUrl,
        author: item.author,
        tags: enhancedTags,
        sourceType: 'RSS'
      }
    });

  } catch (error) {
    console.error('Error processing RSS item:', error);
  }
}

async function fetchRSSFeeds() {
  console.log('🔄 Fetching RSS feeds...');
  
  let totalNewArticles = 0;
  
  for (const feed of RSS_FEEDS) {
    try {
      console.log(`📡 Fetching ${feed.name}...`);
      
      const rssFeed = await parser.parseURL(feed.url);
      
      let feedNewArticles = 0;
      for (const item of rssFeed.items.slice(0, 10)) { // Limit to 10 latest articles
        const existingNews = await prisma.news.findFirst({
          where: { url: item.link }
        });
        
        if (!existingNews) {
          await processRSSItem(item, feed);
          feedNewArticles++;
        }
      }
      
      totalNewArticles += feedNewArticles;
      console.log(`✅ Processed ${feed.name} (${feedNewArticles} new articles)`);
    } catch (error) {
      console.error(`❌ Error fetching ${feed.name}:`, error);
    }
  }
  
  console.log(`✅ RSS feed fetching completed (${totalNewArticles} total new articles)`);
  return totalNewArticles;
}

async function cleanOldArticles() {
  try {
    console.log('🧹 Cleaning up old articles...');
    
    // Remove articles older than 30 days
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 30);
    
    const oldArticlesCount = await prisma.news.count({
      where: {
        publishedAt: {
          lt: cutoffDate
        }
      }
    });
    
    if (oldArticlesCount > 0) {
      await prisma.news.deleteMany({
        where: {
          publishedAt: {
            lt: cutoffDate
          }
        }
      });
      console.log(`🗑️ Deleted ${oldArticlesCount} articles older than 30 days`);
    }
    
    // Also limit total articles to 500
    const totalArticles = await prisma.news.count();
    
    if (totalArticles > 500) {
      const excessArticles = totalArticles - 500;
      
      const oldestArticles = await prisma.news.findMany({
        select: { id: true },
        orderBy: { publishedAt: 'asc' },
        take: excessArticles
      });
      
      await prisma.news.deleteMany({
        where: {
          id: {
            in: oldestArticles.map(article => article.id)
          }
        }
      });
      
      console.log(`🗑️ Deleted ${excessArticles} excess articles (keeping 500 total)`);
    }
    
    const remainingArticles = await prisma.news.count();
    console.log(`📊 Total articles remaining: ${remainingArticles}`);
    
  } catch (error) {
    console.error('Error cleaning old articles:', error);
  }
}

async function fetchNews() {
  try {
    console.log(`\n🕐 [${new Date().toLocaleString()}] Starting news fetch...`);
    
    const newArticles = await fetchRSSFeeds();
    await cleanOldArticles();
    
    if (newArticles > 0) {
      console.log(`🎉 Successfully added ${newArticles} new articles!`);
    } else {
      console.log('📰 No new articles found');
    }
    
    console.log(`✅ News fetch completed at ${new Date().toLocaleString()}`);
  } catch (error) {
    console.error('❌ Error in news fetch:', error);
  }
}

// Configuration
const FETCH_INTERVAL = 4 * 60 * 60 * 1000; // 4 hours in milliseconds
const INITIAL_DELAY = 30 * 1000; // 30 seconds delay before first fetch

console.log('🚀 Starting continuous news service...');
console.log(`📅 Fetch interval: ${FETCH_INTERVAL / (60 * 60 * 1000)} hours`);
console.log(`⏰ Initial delay: ${INITIAL_DELAY / 1000} seconds`);

// Start the service
async function startService() {
  try {
    // Initial fetch after delay
    setTimeout(async () => {
      await fetchNews();
      
      // Set up recurring fetches
      setInterval(async () => {
        await fetchNews();
      }, FETCH_INTERVAL);
      
    }, INITIAL_DELAY);
    
    console.log('✅ News service started successfully!');
    console.log('💡 Press Ctrl+C to stop the service');
    
  } catch (error) {
    console.error('❌ Error starting news service:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down news service...');
  await prisma.$disconnect();
  console.log('✅ News service stopped');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down news service...');
  await prisma.$disconnect();
  console.log('✅ News service stopped');
  process.exit(0);
});

// Start the service
startService(); 