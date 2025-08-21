/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs'],
    esmExternals: 'loose',
  },
  webpack: (config, { isServer, dev }) => {
    // Fixes npm packages that depend on Node.js modules
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        child_process: false,
        bufferutil: false,
        'utf-8-validate': false,
        buffer: require.resolve('buffer/'),
        stream: require.resolve('stream-browserify'),
      };
    }

    // Add rule to handle .node files
    config.module.rules.push({
      test: /\.node$/,
      use: 'node-loader',
    });

    // Disable Terser for problematic files
    if (!dev) {
      config.optimization.minimizer = config.optimization.minimizer.map(plugin => {
        if (plugin.constructor.name === 'TerserPlugin') {
          plugin.options.parallel = true;
          plugin.options.include = /(?!node_modules[\\/]next[\\/]dist[\\/]esm[\\/]client[\\/]components[\\/]react-dev-overlay[\\/]pages[\\/]_error\.js)/;
          plugin.options.exclude = /node_modules/;
          plugin.options.terserOptions = {
            ...plugin.options.terserOptions,
            compress: {
              ...plugin.options.terserOptions?.compress,
              ecma: 2018,
            },
            output: {
              ...plugin.options.terserOptions?.output,
              ecma: 2018,
            },
            parse: {
              ...plugin.options.terserOptions?.parse,
              ecma: 2018,
            },
          };
        }
        return plugin;
      });
    }

    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: false, // Enable Next.js image optimization
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
    domains: [
      'images.pexels.com',
      'images.unsplash.com',
      'inc42.com',
      'asset.inc42.com',
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
    ignoreBuildErrors: true,
  },
  swcMinify: true, // Enable SWC minification
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value:
              "default-src 'self'; " +
              "img-src 'self' blob: data: * https://*.google-analytics.com https://*.googletagmanager.com; " +
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.instagram.com https://*.googletagmanager.com https://www.google-analytics.com; " +
              "script-src-elem 'self' 'unsafe-inline' https://www.googletagmanager.com https://*.google-analytics.com; " +
              "connect-src 'self' https://ieudhbmxouyclzkzecrw.supabase.co https://ieudhbmxouyclzkzecrw.supabase.co/storage/v1/object https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com; " +
              "style-src 'self' 'unsafe-inline' https://tagmanager.google.com; " +
              "font-src 'self' data: https://fonts.gstatic.com; " +
              "frame-src 'self' https://ieudhbmxouyclzkzecrw.supabase.co https://*.googletagmanager.com; " +
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