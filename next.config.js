/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: false, // Enable Next.js image optimization
    domains: ['images.pexels.com']
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs'],
  },
  swcMinify: true, // Enable SWC minification for production builds
};

module.exports = nextConfig;