import type { MetadataRoute } from 'next';

import { buildSubredditPath } from '@/lib/gallery-routes';
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

  const subreddits = [
    { name: 'photography', priority: 0.9 },
    { name: 'EarthPorn', priority: 0.9 },
    { name: 'CatsStandingUp', priority: 0.8 },
    { name: 'InteriorDesign', priority: 0.8 },
    { name: 'Art', priority: 0.9 },
    { name: 'FoodPorn', priority: 0.8 },
    { name: 'houseplants', priority: 0.8 },
    { name: 'MostBeautiful', priority: 0.8 },
    { name: 'GetMotivated', priority: 0.7 },
    { name: 'Cyberpunk', priority: 0.7 },
    { name: 'VaporwaveAesthetics', priority: 0.7 },
    { name: 'amoledbackgrounds', priority: 0.7 },
  ];

  const subredditPages: MetadataRoute.Sitemap = subreddits.map((subreddit) => ({
    url: `${SITE_URL}${buildSubredditPath(subreddit.name)}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: subreddit.priority,
  }));

  return [...mainPages, ...subredditPages];
}
