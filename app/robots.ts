import type { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ghanasevent.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/events', '/hotels', '/tourist-areas', '/about', '/blog', '/community-guidelines', '/contact', '/pricing', '/how-it-works', '/faqs'],
        disallow: [
          '/admin/',
          '/account/',
          '/organiser/',
          '/attendee/',
          '/auth/',
          '/api/',
          '/saved/',
          '/login',
          '/register',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
