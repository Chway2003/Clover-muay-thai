/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://mydomain.com',
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
      'https://mydomain.com/sitemap.xml',
    ],
  },
  exclude: ['/api/*', '/admin/*'],
  generateIndexSitemap: true,
  changefreq: 'weekly',
  priority: 0.7,
}
