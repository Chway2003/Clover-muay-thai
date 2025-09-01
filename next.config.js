/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['clovermuaythai.com', 'localhost'],
    unoptimized: false,
  },
  // Optimize for production
  compress: true,
  poweredByHeader: false,
  // Ensure proper static generation
  trailingSlash: false,
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig
