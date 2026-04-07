import type { MetadataRoute } from 'next';

import { SITE_URL } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/api/proxy-image'],
        disallow: ['/api/reddit-feed', '/api/reddit-json', '/.next/', '/node_modules/'],
      },
      {
        userAgent: 'Googlebot',
        allow: ['/', '/api/proxy-image'],
        crawlDelay: 0,
      },
      {
        userAgent: 'Bingbot',
        allow: ['/', '/api/proxy-image'],
        crawlDelay: 1,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
