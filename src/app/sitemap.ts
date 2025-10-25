import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://reddit-gallery-viewer.vercel.app';

  // 主要页面
  const mainPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
  ];

  // 热门 subreddit 页面
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
    url: `${baseUrl}/?sub=${subreddit.name}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: subreddit.priority,
  }));

  // 合并所有页面
  return [...mainPages, ...subredditPages];
}
