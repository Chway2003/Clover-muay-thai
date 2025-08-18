/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://clovermuaythai.com',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
    ],
    additionalSitemaps: [
      'https://clovermuaythai.com/sitemap.xml',
    ],
  },
  exclude: ['/api/*', '/admin/*'],
  generateIndexSitemap: true,
  changefreq: 'weekly',
  priority: 0.7,
  // Add structured data for business location
  additionalPaths: async (config) => [
    {
      loc: '/contact',
      changefreq: 'monthly',
      priority: 0.8,
      lastmod: new Date().toISOString(),
    }
  ],
}

