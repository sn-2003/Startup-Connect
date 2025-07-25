/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: false, // Enable Next.js image optimization
    domains: ['images.pexels.com','cdn.prod.website-files.com','https://ieudhbmxouyclzkzecrw.supabase.co']
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs'],
  },
  swcMinify: true, // Enable SWC minification for production builds
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value:
              "default-src 'self'; " +
              "img-src 'self' blob: data: https://images.pexels.com https://cdn.prod.website-files.com https://ieudhbmxouyclzkzecrw.supabase.co; " +
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
              "style-src 'self' 'unsafe-inline'; " +
              "font-src 'self' data:; " +
              "connect-src 'self' https://ieudhbmxouyclzkzecrw.supabase.co https://ieudhbmxouyclzkzecrw.supabase.co/storage/v1/object; " +
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