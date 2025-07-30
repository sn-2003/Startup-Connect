import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const newsData = [
  {
    title: "AI Startup Anthropic Raises $450M in Series C Funding",
    summary: "The AI safety company behind Claude has secured major funding to expand its research and product development capabilities.",
    content: "Anthropic, the AI safety company behind the Claude chatbot, has raised $450 million in Series C funding. The round was led by Spark Capital and included participation from Google, Salesforce Ventures, and other prominent investors. The funding will be used to expand Anthropic's research capabilities and accelerate product development across its AI safety initiatives. This represents a significant milestone in the AI industry, highlighting the growing importance of responsible AI development.",
    source: "TechCrunch",
    url: "https://techcrunch.com/2024/01/15/anthropic-series-c-funding",
    publishedAt: new Date('2024-01-15T10:00:00Z'),
    category: 'STARTUP' as const,
    readTime: "3 min read",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop",
    author: "Sarah Johnson",
    tags: ['AI', 'Funding', 'Series C', 'Anthropic', 'Claude'],
    featured: true,
    sourceType: 'CURATED' as const
  },
  {
    title: "5 Indian SaaS Startups That Just Raised Seed Funding",
    summary: "A curated list of promising early-stage startups in the Indian SaaS ecosystem that secured funding this week.",
    content: "The Indian SaaS ecosystem continues to show strong growth with several promising startups securing seed funding this week. These companies are leveraging India's strong engineering talent and addressing global market needs. The funding rounds range from $500K to $2M, with investors showing increasing confidence in Indian SaaS startups. Key areas include developer tools, enterprise software, and vertical SaaS solutions.",
    source: "YourStory",
    url: "https://yourstory.com/2024/01/15/indian-saas-seed-funding",
    publishedAt: new Date('2024-01-15T08:00:00Z'),
    category: 'STARTUP' as const,
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop",
    author: "Rahul Sharma",
    tags: ['India', 'SaaS', 'Seed Funding', 'Startups', 'B2B'],
    featured: false,
    sourceType: 'CURATED' as const
  },
  {
    title: "Stripe Acquires AI-Powered Fraud Detection Startup",
    summary: "The fintech giant expands its security capabilities with the acquisition of a machine learning startup.",
    content: "Stripe has announced the acquisition of an AI-powered fraud detection startup, marking its continued expansion into advanced security solutions. The acquisition will enhance Stripe's existing fraud prevention capabilities and help merchants reduce chargebacks and fraudulent transactions. This move underscores the growing importance of AI in financial services and fraud prevention.",
    source: "Crunchbase News",
    url: "https://news.crunchbase.com/2024/01/15/stripe-acquisition-fraud-detection",
    publishedAt: new Date('2024-01-15T06:00:00Z'),
    category: 'TECHNOLOGY' as const,
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop",
    author: "Mike Chen",
    tags: ['Stripe', 'Acquisition', 'AI', 'Fraud Detection', 'Fintech'],
    featured: false,
    sourceType: 'CURATED' as const
  },
  {
    title: "This Week's Top Pitch Decks: What Investors Loved",
    summary: "Analysis of successful pitch decks from startups that recently closed funding rounds.",
    content: "We've analyzed dozens of successful pitch decks from startups that recently closed funding rounds. The common themes include clear problem statements, strong market validation, and compelling growth metrics. Investors are particularly drawn to startups that can demonstrate product-market fit and have a clear path to scale. This analysis provides valuable insights for founders preparing their own pitch decks.",
    source: "StartupGram Editorial",
    url: "https://StartupGram.com/2024/01/15/top-pitch-decks-analysis",
    publishedAt: new Date('2024-01-14T12:00:00Z'),
    category: 'STARTUP' as const,
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop",
    author: "StartupGram Team",
    tags: ['Pitch Decks', 'Funding', 'Investors', 'Startups', 'Analysis'],
    featured: true,
    sourceType: 'CURATED' as const
  },
  {
    title: "Startup Failure Lessons: Why 90% of EdTech Startups Fail",
    summary: "Deep dive into common pitfalls and lessons learned from failed education technology startups.",
    content: "The education technology sector has seen tremendous growth, but with that growth comes a high failure rate. We've analyzed hundreds of failed EdTech startups to identify common patterns and lessons learned. Key failure factors include poor product-market fit, inadequate user engagement, and challenges with monetization. This comprehensive analysis provides valuable insights for EdTech entrepreneurs.",
    source: "Inc42",
    url: "https://inc42.com/2024/01/14/edtech-startup-failures-analysis",
    publishedAt: new Date('2024-01-14T10:00:00Z'),
    category: 'STARTUP' as const,
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop",
    author: "Priya Patel",
    tags: ['EdTech', 'Failure Analysis', 'Lessons Learned', 'Education', 'Startups'],
    featured: false,
    sourceType: 'CURATED' as const
  },
  {
    title: "Founder Spotlight: How This Startup Scaled to 1M Users in 6 Months",
    summary: "Exclusive interview with the founder of a rapidly growing SaaS platform.",
    content: "In this exclusive interview, we sit down with the founder of a SaaS platform that achieved 1 million users in just 6 months. Learn about their growth strategy, challenges faced, and key insights that helped them scale rapidly. The founder shares valuable lessons about product development, marketing, and team building that can help other entrepreneurs.",
    source: "StartupGram Editorial",
    url: "https://StartupGram.com/2024/01/13/founder-spotlight-1m-users",
    publishedAt: new Date('2024-01-13T14:00:00Z'),
    category: 'STARTUP' as const,
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop",
    author: "StartupGram Team",
    tags: ['Founder Interview', 'Growth', 'SaaS', 'Scaling', 'Success Story'],
    featured: true,
    sourceType: 'CURATED' as const
  },
  {
    title: "The Rise of No-Code Platforms: Democratizing Software Development",
    summary: "How no-code platforms are changing the startup landscape and enabling non-technical founders.",
    content: "No-code platforms are revolutionizing how startups are built, enabling non-technical founders to create sophisticated applications without writing code. This trend is democratizing software development and opening up entrepreneurship to a wider audience. We explore the top no-code platforms and how they're being used by successful startups.",
    source: "TechCrunch",
    url: "https://techcrunch.com/2024/01/13/no-code-platforms-startup-landscape",
    publishedAt: new Date('2024-01-13T12:00:00Z'),
    category: 'TECHNOLOGY' as const,
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop",
    author: "Alex Thompson",
    tags: ['No-Code', 'Software Development', 'Startups', 'Technology', 'Democratization'],
    featured: false,
    sourceType: 'CURATED' as const
  },
  {
    title: "Remote Work Tools: The New Frontier for SaaS Startups",
    summary: "How the remote work revolution is creating opportunities for new SaaS startups.",
    content: "The remote work revolution has created unprecedented opportunities for SaaS startups building tools for distributed teams. From communication platforms to project management tools, the market for remote work solutions continues to grow. We examine the key trends and opportunities in this space.",
    source: "VentureBeat",
    url: "https://venturebeat.com/2024/01/13/remote-work-tools-saas-opportunities",
    publishedAt: new Date('2024-01-13T10:00:00Z'),
    category: 'TECHNOLOGY' as const,
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop",
    author: "Lisa Wang",
    tags: ['Remote Work', 'SaaS', 'Tools', 'Distributed Teams', 'Productivity'],
    featured: false,
    sourceType: 'CURATED' as const
  }
];

export async function seedNews() {
  console.log('🌱 Seeding news...');

  for (const newsItem of newsData) {
    // Check if news already exists by URL
    const existingNews = await prisma.news.findFirst({
      where: { url: newsItem.url }
    });

    if (existingNews) {
      // Update existing news
      await prisma.news.update({
        where: { id: existingNews.id },
        data: newsItem,
      });
    } else {
      // Create new news
      await prisma.news.create({
        data: newsItem,
      });
    }
  }

  console.log('✅ News seeded successfully!');
} 