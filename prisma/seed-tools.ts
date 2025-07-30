import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const toolsData = [
  // Development Tools
  {
    name: 'v0.dev',
    description: 'AI-powered code generation for React components and full-stack applications.',
    category: 'DEVELOPMENT',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=200&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=200&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=200&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=200&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=200&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=200&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=200&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop',
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