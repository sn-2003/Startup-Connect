import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const toolsData = [
  // Development Tools
  {
    name: 'v0.dev',
    description: 'AI-powered code generation for React components and full-stack applications.',
    category: 'DEVELOPMENT',
    image: 'https://www.google.com/imgres?q=vo%20dev&imgurl=https%3A%2F%2Fv0.dev%2Fchat-static%2Fsign-in-visual-dark.svg&imgrefurl=https%3A%2F%2Fv0.dev%2Fpricing&docid=4ONYI6gp6bn4UM&tbnid=jw8utsJI1my0nM&vet=12ahUKEwidsNbc2eWOAxWdRmwGHe_6I7oQM3oECCIQAA..i&w=800&h=438&hcb=2&ved=2ahUKEwidsNbc2eWOAxWdRmwGHe_6I7oQM3oECCIQAA',
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
    image: 'https://www.google.com/imgres?q=github%20copilot&imgurl=https%3A%2F%2Fimages.prismic.io%2Fhatica%2F71cb7f49-5483-46ad-bfa5-87b07622e943_8%2Bthings%2Byou%2Bdidn%25E2%2580%2599t%2Bknow%2Byou%2Bcould%2Bdo%2Bwith%2BGitHub%2BCopilot.png%3Fauto%3Dcompress%2Cformat%26rect%3D0%2C0%2C1800%2C1151%26w%3D1200%26h%3D767&imgrefurl=https%3A%2F%2Fwww.hatica.io%2Fblog%2Fgithub-copilot%2F&docid=RnP_XZiHsTuRkM&tbnid=57YLJYWHirXioM&vet=12ahUKEwjkoNyx2uWOAxVWZWwGHZm6BmMQM3oECEgQAA..i&w=1199&h=767&hcb=2&ved=2ahUKEwjkoNyx2uWOAxVWZWwGHZm6BmMQM3oECEgQAA',
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
    image: 'https://www.google.com/imgres?q=vercel&imgurl=https%3A%2F%2Fimages.ctfassets.net%2Fq95r71b1uue1%2FCZM8YFlF9RPBFqn4IW1km%2F1b490ec8796f11dc4491fdc81fadcccd%2FVercel_OG_Image.png&imgrefurl=https%3A%2F%2Fwww.mwskwong.com%2Fblog%2Fenforcing-coding-style-with-vercel-style-guide&docid=UdM5J2mfCkgKIM&tbnid=a_RtfK-STG3kdM&vet=12ahUKEwi855_C2uWOAxV5S3ADHeQNAx4QM3oECBgQAA..i&w=2560&h=1440&hcb=2&ved=2ahUKEwi855_C2uWOAxV5S3ADHeQNAx4QM3oECBgQAA',
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
    image: 'https://www.google.com/imgres?q=netlify&imgurl=https%3A%2F%2Fmarketplace.commercetools.com%2Fimg%2Fcontainers%2Fassets%2Fintegrations%2Fnetlify%2Flogo-450px-1703162977.png%2F0f6b7fef7b7e798ec3669c265e33e6eb.png&imgrefurl=https%3A%2F%2Fmarketplace.commercetools.com%2Fintegration%2Fnetlify&docid=DaBA5tmLZQrwxM&tbnid=mhvrYuLLH7CNAM&vet=12ahUKEwi1pcDn2uWOAxUFT2wGHSZrMmEQM3oECE4QAA..i&w=450&h=450&hcb=2&ved=2ahUKEwi1pcDn2uWOAxUFT2wGHSZrMmEQM3oECE4QAA',
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
    image: 'https://www.google.com/imgres?q=figma&imgurl=https%3A%2F%2Fcdn.sanity.io%2Fimages%2F599r6htc%2Fregionalized%2Fa22136347164d79bf408377a75232169c4837a11-3840x2160.png%3Fw%3D1632%26h%3D918%26q%3D75%26fit%3Dmax%26auto%3Dformat&imgrefurl=https%3A%2F%2Fwww.figma.com%2Fblog%2Fipo-pricing%2F&docid=XBDMrx_0be7jpM&tbnid=dETkDfikCAVh6M&vet=12ahUKEwiU14fR2-WOAxULSmwGHbJNKDsQM3oECFQQAA..i&w=1632&h=918&hcb=2&itg=1&ved=2ahUKEwiU14fR2-WOAxULSmwGHbJNKDsQM3oECFQQAA',
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
    image: 'https://www.google.com/imgres?q=canva&imgurl=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1561070791-2526d30994b5%3Fw%3D400%26h%3D200%26fit%3Dcrop&imgrefurl=https%3A%2F%2Fcanva.com%2F&docid=4ONYI6gp6bn4UM&tbnid=jw8utsJI1my0nM&vet=12ahUKEwidsNbc2eWOAxWdRmwGHe_6I7oQM3oECCIQAA..i&w=800&h=438&hcb=2&ved=2ahUKEwidsNbc2eWOAxWdRmwGHe_6I7oQM3oECCIQAA',
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