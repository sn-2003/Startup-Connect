import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const toolsData = [
  // Development Tools
  {
    name: 'v0.dev',
    description: 'AI-powered code generation for React components and full-stack applications.',
    category: 'DEVELOPMENT',
    image: '/tools/v0.jpeg',
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
    image: '/tools/github.jpeg',
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
    image: '/tools/vercel.jpeg',
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
    image: '/tools/netlify.png',
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
    image: '/tools/figma.png',
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
    image: '/tools/canva.jpeg',
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
    image: '/tools/sketch.png',
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
    image: '/tools/jasper.jpeg',
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
    image: '/tools/mailchimp.png',
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
    image: '/tools/hubspot.png',
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
    image: '/tools/notion.png',
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
    image: '/tools/trello.jpeg',
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
    image: '/tools/asana.jpeg',
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
    image: '/tools/slack.jpeg',
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
    image: '/tools/discord.jpeg',
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
    image: '/tools/zoom.png',
    url: 'https://zoom.us',
    rating: 4.1,
    users: '300M+',
    pricing: 'Free',
    featured: false,
    tags: ['Video', 'Meetings', 'Webinars']
  },
  
  // AI Tools
  {
    name: 'ChatGPT',
    description: 'AI language model for natural language conversations and tasks.',
    category: 'AI',
    image: '/tools/chatgpt.jpeg',
    url: 'https://chat.openai.com',
    rating: 4.7,
    users: '100M+',
    pricing: 'Free',
    featured: true,
    tags: ['AI', 'Chatbot', 'Language Model']
  },
  {
    name: 'Claude',
    description: 'AI assistant for writing, analysis, and coding.',
    category: 'AI',
    image: '/tools/claude.jpeg',
    url: 'https://claude.ai',
    rating: 4.5,
    users: '10M+',
    pricing: 'Free',
    featured: false,
    tags: ['AI', 'Writing', 'Coding']
  },
  {
    name: 'Midjourney',
    description: 'AI-powered image generation from text prompts.',
    category: 'AI',
    image: '/tools/midjourney.jpeg',
    url: 'https://midjourney.com',
    rating: 4.6,
    users: '5M+',
    pricing: 'From $10/mo',
    featured: false,
    tags: ['AI', 'Image Generation', 'Art']
  },
  
  // Analytics Tools
  {
    name: 'Google Analytics',
    description: 'Web analytics service to track and report website traffic.',
    category: 'ANALYTICS',
    image: '/tools/goole_analytics.png',
    url: 'https://analytics.google.com',
    rating: 4.5,
    users: '50M+',
    pricing: 'Free',
    featured: true,
    tags: ['Analytics', 'Web', 'Google']
  },
  {
    name: 'Mixpanel',
    description: 'Advanced analytics platform for tracking user interactions.',
    category: 'ANALYTICS',
    image: '/tools/mixpanel.png',
    url: 'https://mixpanel.com',
    rating: 4.4,
    users: '10K+',
    pricing: 'From $25/mo',
    featured: false,
    tags: ['Analytics', 'User Tracking', 'Product']
  },
  {
    name: 'Hotjar',
    description: 'Behavior analytics and user feedback tools.',
    category: 'ANALYTICS',
    image: '/tools/hotjar.jpeg',
    url: 'https://hotjar.com',
    rating: 4.3,
    users: '500K+',
    pricing: 'Free',
    featured: false,
    tags: ['Analytics', 'Heatmaps', 'User Feedback']
  },
  
  // Finance Tools
  {
    name: 'Stripe',
    description: 'Payment processing platform for internet businesses.',
    category: 'FINANCE',
    image: '/tools/stripe.jpeg',
    url: 'https://stripe.com',
    rating: 4.8,
    users: '1M+',
    pricing: '2.9% + 30¢',
    featured: false,
    tags: ['Payments', 'Finance', 'E-commerce']
  },
  {
    name: 'Plaid',
    description: 'API for connecting bank accounts to financial applications.',
    category: 'FINANCE',
    image: '/tools/plaid.jpeg',
    url: 'https://plaid.com',
    rating: 4.2,
    users: '10K+',
    pricing: 'Pay as you go',
    featured: false,
    tags: ['Finance', 'Banking', 'API']
  },
  {
    name: 'QuickBooks',
    description: 'Accounting software for small and medium-sized businesses.',
    category: 'FINANCE',
    image: '/tools/quickbooks.png',
    url: 'https://quickbooks.intuit.com',
    rating: 4.3,
    users: '5M+',
    pricing: 'From $15/mo',
    featured: false,
    tags: ['Accounting', 'Finance', 'Invoicing']
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