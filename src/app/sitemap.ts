import type { MetadataRoute } from 'next';

import { buildGalleryLandingPath } from '@/lib/gallery-routes';
import { getAllSubredditPageConfigs } from '@/lib/subreddit-pages';
import { SITE_URL } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const mainPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  const subredditPages: MetadataRoute.Sitemap = getAllSubredditPageConfigs().map((page) => ({
    url: `${SITE_URL}${buildGalleryLandingPath(page.slug)}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: page.adsenseRisk === 'review' ? 0.7 : 0.8,
  }));

  return [...mainPages, ...subredditPages];
}
