/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: false, // Enable Next.js image optimization
    domains: [
      'images.pexels.com',
      'cdn.prod.website-files.com',
      'ieudhbmxouyclzkzecrw.supabase.co',
      'www.hubspot.com',
      '53.fs1.hubspotusercontent-na1.net',
      'cdn2.hubspot.net',
      'f.hubspotusercontent00.net',
      'offers.hubspot.com',
      'www.huify.com',
      'www.articulatemarketing.com',
      '455263.fs1.hubspotusercontent-na1.net',
      '6minded.com',
      'www.sagefrog.com',
      'www.npws.net'
    ]
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs'],
  },
  swcMinify: false, // Disable SWC minification to fix Radix UI build issues
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value:
              "default-src 'self'; " +
              "img-src 'self' blob: data: https://images.pexels.com https://cdn.prod.website-files.com https://ieudhbmxouyclzkzecrw.supabase.co https://www.hubspot.com https://53.fs1.hubspotusercontent-na1.net https://cdn2.hubspot.net https://f.hubspotusercontent00.net https://offers.hubspot.com https://www.huify.com https://www.articulatemarketing.com https://455263.fs1.hubspotusercontent-na1.net https://6minded.com https://www.sagefrog.com https://www.npws.net; " +
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
              "style-src 'self' 'unsafe-inline'; " +
              "font-src 'self' data:; " +
              "connect-src 'self' https://ieudhbmxouyclzkzecrw.supabase.co https://ieudhbmxouyclzkzecrw.supabase.co/storage/v1/object; " +
              "frame-src 'self' https://ieudhbmxouyclzkzecrw.supabase.co; " +
              "frame-ancestors 'self'; " +
              "object-src 'none'; " +
              "base-uri 'self'; " +
              "form-action 'self'; " +
              "upgrade-insecure-requests"
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;