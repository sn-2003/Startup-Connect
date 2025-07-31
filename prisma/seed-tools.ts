import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const toolsData = [
  // Development Tools
  {
    name: 'v0.dev',
    description: 'AI-powered code generation for React components and full-stack applications.',
    category: 'DEVELOPMENT',
    image: 'https://v0.dev/og.png',
    url: 'https://v0.dev',
    rating: 4.8,
    users: '50K+',
    pricing: 'Free',
    featured: true,
    tags: ['AI', 'React', 'Code Generation']
  },
  {
    name: 'GitHub Copilot',
    description: 'AI pair programmer that helps you write code faster and with fewer errors.',
    category: 'DEVELOPMENT',
    image: 'https://github.githubassets.com/images/modules/site/copilot/enterprise/copilot-enterprise.png',
    url: 'https://github.com/features/copilot',
    rating: 4.3,
    users: '1M+',
    pricing: '$10/mo',
    featured: false,
    tags: ['AI', 'Code Assistant', 'GitHub']
  },
  {
    name: 'Vercel',
    description: 'Deploy and host your applications with zero configuration.',
    category: 'DEVELOPMENT',
    image: 'https://assets.vercel.com/image/upload/f_auto/q_auto/front/vercel/og.png',
    url: 'https://vercel.com',
    rating: 4.7,
    users: '500K+',
    pricing: 'Free',
    featured: false,
    tags: ['Deployment', 'Hosting', 'Next.js']
  },
  {
    name: 'Netlify',
    description: 'All-in-one platform for web projects with continuous deployment.',
    category: 'DEVELOPMENT',
    image: 'https://www.netlify.com/v3/static/0ee4f76141f0fcc9e3b582f78fe35a67/8d1fc/og-default.jpg',
    url: 'https://netlify.com',
    rating: 4.6,
    users: '300K+',
    pricing: 'Free',
    featured: false,
    tags: ['Deployment', 'Hosting', 'Static Sites']
  },

  // Design Tools
  {
    name: 'Figma',
    description: 'Collaborative interface design tool for teams.',
    category: 'DESIGN',
    image: 'https://cdn.sanity.io/images/599r6htc/production/46a0cbb605f3b04395064a2ecce1c71b59931e5b-1200x630.png',
    url: 'https://figma.com',
    rating: 4.6,
    users: '2M+',
    pricing: 'Free',
    featured: false,
    tags: ['Design', 'UI/UX', 'Collaboration']
  },
  {
    name: 'Canva',
    description: 'Easy-to-use design tool for creating graphics, presentations, and more.',
    category: 'DESIGN',
    image: 'https://static-cdn.canva.com/web-images/8e9c2e3f9b0c8b2a8a0b4d5c6b8a9f7e/hero/og-canva.jpg',
    url: 'https://canva.com',
    rating: 4.5,
    users: '100M+',
    pricing: 'Free',
    featured: false,
    tags: ['Design', 'Graphics', 'Templates']
  },
  {
    name: 'Sketch',
    description: 'Professional digital design for Mac with powerful vector editing.',
    category: 'DESIGN',
    image: 'https://www.sketch.com/images/pages/home/og-image.jpg',
    url: 'https://sketch.com',
    rating: 4.4,
    users: '500K+',
    pricing: '$99/year',
    featured: false,
    tags: ['Design', 'UI/UX', 'Mac']
  },

  // Marketing Tools
  {
    name: 'Jasper',
    description: 'AI content creation platform for marketing copy and content.',
    category: 'MARKETING',
    image: 'https://www.jasper.ai/hs-fs/hubfs/Jasper-OG-Image.png',
    url: 'https://jasper.ai',
    rating: 4.7,
    users: '100K+',
    pricing: 'From $39/mo',
    featured: true,
    tags: ['AI', 'Content', 'Marketing']
  },
  {
    name: 'Mailchimp',
    description: 'Email marketing platform for growing businesses.',
    category: 'MARKETING',
    image: 'https://mailchimp.com/releases/wp-content/uploads/2023/10/Mailchimp-OG-Image-1200x630-1.png',
    url: 'https://mailchimp.com',
    rating: 4.4,
    users: '15M+',
    pricing: 'From $10/mo',
    featured: false,
    tags: ['Email', 'Marketing', 'Automation']
  },
  {
    name: 'HubSpot',
    description: 'All-in-one inbound marketing, sales, and CRM platform.',
    category: 'MARKETING',
    image: 'https://www.hubspot.com/hubfs/HubSpot_Logos/HSLogo_color.svg',
    url: 'https://hubspot.com',
    rating: 4.5,
    users: '150K+',
    pricing: 'From $45/mo',
    featured: false,
    tags: ['CRM', 'Marketing', 'Sales']
  },

  // Productivity Tools
  {
    name: 'Notion',
    description: 'All-in-one workspace for notes, docs, and project management.',
    category: 'PRODUCTIVITY',
    image: 'https://www.notion.so/cdn-cgi/image/format=webp,width=1200,quality=80/front-static/pages/home/notion-app-meta-image.png',
    url: 'https://notion.so',
    rating: 4.5,
    users: '500K+',
    pricing: 'From $8/mo',
    featured: false,
    tags: ['Productivity', 'Notes', 'Project Management']
  },
  {
    name: 'Trello',
    description: 'Visual project management tool for teams.',
    category: 'PRODUCTIVITY',
    image: 'https://d2k1ftgv7pobq7.cloudfront.net/meta/u/res/images/trello-header-logos/167dcb0a9401d0f0a1e8f8e89c84ac3e/trello-logo-blue.png',
    url: 'https://trello.com',
    rating: 4.3,
    users: '50M+',
    pricing: 'Free',
    featured: false,
    tags: ['Project Management', 'Kanban', 'Collaboration']
  },
  {
    name: 'Asana',
    description: 'Work management platform for teams to organize and track work.',
    category: 'PRODUCTIVITY',
    image: 'https://assets.asana.biz/m/3a3f1c79eac74b9d/original/Asana-og-image.png',
    url: 'https://asana.com',
    rating: 4.4,
    users: '100K+',
    pricing: 'From $10.99/mo',
    featured: false,
    tags: ['Project Management', 'Task Management', 'Team']
  },

  // Communication Tools
  {
    name: 'Slack',
    description: 'Team communication platform for modern businesses.',
    category: 'COMMUNICATION',
    image: 'https://a.slack-edge.com/80588/marketing/img/meta/og-image.png',
    url: 'https://slack.com',
    rating: 4.3,
    users: '10M+',
    pricing: 'From $7.25/mo',
    featured: false,
    tags: ['Communication', 'Team', 'Chat']
  },
  {
    name: 'Discord',
    description: 'Voice, video, and text communication platform for communities.',
    category: 'COMMUNICATION',
    image: 'https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0b5491d06b60c587c405_what_is_discord_og_image.png',
    url: 'https://discord.com',
    rating: 4.2,
    users: '150M+',
    pricing: 'Free',
    featured: false,
    tags: ['Communication', 'Voice', 'Gaming']
  },
  {
    name: 'Zoom',
    description: 'Video conferencing platform for meetings and webinars.',
    category: 'COMMUNICATION',
    image: 'https://www.zoom.com/zoom-og-image.png',
    url: 'https://zoom.us',
    rating: 4.1,
    users: '300M+',
    pricing: 'From $14.99/mo',
    featured: false,
    tags: ['Video Conferencing', 'Meetings', 'Webinars']
  },

  // Analytics Tools
  {
    name: 'Mixpanel',
    description: 'Product analytics platform for understanding user behavior.',
    category: 'ANALYTICS',
    image: 'https://cdn.mixpanel.com/wp-content/uploads/2021/06/17133014/og-image.png',
    url: 'https://mixpanel.com',
    rating: 4.4,
    users: '200K+',
    pricing: 'From $25/mo',
    featured: false,
    tags: ['Analytics', 'User Behavior', 'Product']
  },
  {
    name: 'Google Analytics',
    description: 'Web analytics service to track and report website traffic.',
    category: 'ANALYTICS',
    image: 'https://www.google.com/analytics/about/static/assets/images/analytics-4/ga4-og-image.jpg',
    url: 'https://analytics.google.com',
    rating: 4.6,
    users: '50M+',
    pricing: 'Free',
    featured: false,
    tags: ['Analytics', 'Web', 'Google']
  },
  {
    name: 'Hotjar',
    description: 'Website heatmaps and user behavior analytics.',
    category: 'ANALYTICS',
    image: 'https://www.hotjar.com/og-image.png',
    url: 'https://hotjar.com',
    rating: 4.3,
    users: '500K+',
    pricing: 'From $32/mo',
    featured: false,
    tags: ['Analytics', 'Heatmaps', 'User Behavior']
  },

  // Finance Tools
  {
    name: 'Stripe',
    description: 'Payment processing platform for internet businesses.',
    category: 'FINANCE',
    image: 'https://stripe.com/img/v3/home/social.png',
    url: 'https://stripe.com',
    rating: 4.8,
    users: '1M+',
    pricing: '2.9% + 30¢',
    featured: false,
    tags: ['Payments', 'Finance', 'E-commerce']
  },
  {
    name: 'QuickBooks',
    description: 'Accounting software for small businesses.',
    category: 'FINANCE',
    image: 'https://quickbooks.intuit.com/oidam/intuit/sbseg/en_us/Blog/Graphic/quickbooks-online-logo-og-image.png',
    url: 'https://quickbooks.intuit.com',
    rating: 4.2,
    users: '7M+',
    pricing: 'From $30/mo',
    featured: false,
    tags: ['Accounting', 'Finance', 'Small Business']
  },
  {
    name: 'Plaid',
    description: 'Financial data API for connecting bank accounts to apps.',
    category: 'FINANCE',
    image: 'https://plaid.com/assets/og-image.jpg',
    url: 'https://plaid.com',
    rating: 4.5,
    users: '10K+',
    pricing: 'From $500/mo',
    featured: false,
    tags: ['API', 'Banking', 'Financial Data']
  },

  // AI Tools
  {
    name: 'ChatGPT',
    description: 'AI language model for conversation and content generation.',
    category: 'AI',
    image: 'https://openai.com/images/chatgpt-share-og.png',
    url: 'https://chat.openai.com',
    rating: 4.7,
    users: '100M+',
    pricing: 'From $20/mo',
    featured: true,
    tags: ['AI', 'Language Model', 'Chat']
  },
  {
    name: 'Midjourney',
    description: 'AI image generation tool for creating stunning visuals.',
    category: 'AI',
    image: 'https://www.midjourney.com/og-image.png',
    url: 'https://midjourney.com',
    rating: 4.6,
    users: '1M+',
    pricing: 'From $10/mo',
    featured: true,
    tags: ['AI', 'Image Generation', 'Art']
  },
  {
    name: 'Claude',
    description: 'AI assistant for writing, analysis, and coding.',
    category: 'AI',
    image: 'https://www.anthropic.com/og-image.jpg',
    url: 'https://claude.ai',
    rating: 4.5,
    users: '500K+',
    pricing: 'From $20/mo',
    featured: false,
    tags: ['AI', 'Writing', 'Analysis']
  }
];

export async function seedTools() {
  console.log('🌱 Seeding tools...');

  for (const toolData of toolsData) {
    // Check if tool already exists by name
    const existingTool = await prisma.tool.findFirst({
      where: { name: toolData.name }
    });

    // Prepare data with proper category type
    const toolDataWithCategory = {
      ...toolData,
      category: toolData.category as any // Cast to ToolCategory enum
    };

    if (existingTool) {
      // Update existing tool
      await prisma.tool.update({
        where: { id: existingTool.id },
        data: toolDataWithCategory,
      });
    } else {
      // Create new tool
      await prisma.tool.create({
        data: toolDataWithCategory,
      });
    }
  }

  console.log('✅ Tools seeded successfully!');
}