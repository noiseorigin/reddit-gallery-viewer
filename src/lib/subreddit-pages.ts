import {
  buildGalleryHref,
  buildGalleryLandingHref,
  type GalleryRouteOptions,
} from './gallery-routes';

export type AdsenseRiskLevel = 'low' | 'medium' | 'review';

export interface SubredditPageConfig {
  slug: string;
  subredditName: string;
  category: string;
  seoTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  adsenseRisk: AdsenseRiskLevel;
  relatedSubreddits: string[];
}

export const SUBREDDIT_PAGE_CONFIGS: SubredditPageConfig[] = [
  {
    slug: 'aww',
    subredditName: 'aww',
    category: 'Cute animals',
    seoTitle: 'Aww Gallery | Cute Animal Photos from Reddit',
    metaDescription:
      'Browse r/aww as a clean image gallery with cute pet photos, rescue stories, and wholesome animal moments in a lightweight Reddit viewer.',
    h1: 'Cute animal photos from r/aww in one clean gallery',
    intro:
      'Use this r/aww gallery to browse pet pictures, rescue updates, and wholesome animal posts in a faster layout that keeps the focus on the images.',
    adsenseRisk: 'low',
    relatedSubreddits: ['cats', 'earthporn', 'wallpapers'],
  },
  {
    slug: 'wallpapers',
    subredditName: 'wallpapers',
    category: 'Backgrounds',
    seoTitle: 'Wallpapers Gallery | Desktop and Phone Backgrounds from Reddit',
    metaDescription:
      'Explore r/wallpapers in a clean gallery view for desktop backgrounds, phone wallpapers, and high-resolution scenes without the usual Reddit clutter.',
    h1: 'Wallpapers and backgrounds from r/wallpapers',
    intro:
      'Open r/wallpapers as a focused gallery for desktop backgrounds, phone-ready artwork, and high-resolution scenes that are easy to scan on mobile or desktop.',
    adsenseRisk: 'low',
    relatedSubreddits: ['earthporn', 'aww', 'cats'],
  },
  {
    slug: 'earthporn',
    subredditName: 'EarthPorn',
    category: 'Nature photography',
    seoTitle: 'EarthPorn Gallery | Landscape and Nature Photos from Reddit',
    metaDescription:
      'Browse r/EarthPorn as a simple image gallery for landscape photography, mountains, forests, and travel-worthy nature scenes from Reddit.',
    h1: 'Landscape photography from r/EarthPorn',
    intro:
      'This r/EarthPorn gallery highlights landscape photography, dramatic skies, forests, coastlines, and wide natural scenes in a clean, image-first layout.',
    // Moderation awareness: the community is generally nature-safe, but the subreddit name can
    // trigger extra ad-policy review, so future monetization should keep placement conservative.
    adsenseRisk: 'review',
    relatedSubreddits: ['wallpapers', 'aww', 'cats'],
  },
  {
    slug: 'cats',
    subredditName: 'cats',
    category: 'Pet photography',
    seoTitle: 'Cats Gallery | Cat Photos and Posts from Reddit',
    metaDescription:
      'View r/cats as a clean gallery of cat photos, playful moments, and everyday pet posts in a fast Reddit image viewer.',
    h1: 'Cat photos from r/cats in a simple gallery',
    intro:
      'Browse r/cats in a cleaner format for cat portraits, playful moments, and everyday pet posts without getting pulled through a crowded feed.',
    adsenseRisk: 'low',
    relatedSubreddits: ['aww', 'memes', 'wallpapers'],
  },
  {
    slug: 'memes',
    subredditName: 'memes',
    category: 'Humor',
    seoTitle: 'Memes Gallery | Trending Meme Images from Reddit',
    metaDescription:
      'Browse r/memes in a lightweight image gallery to view popular meme formats, reaction images, and shareable humor posts from Reddit.',
    h1: 'Trending meme images from r/memes',
    intro:
      'Use this r/memes gallery to scan current meme posts and reaction images in a simple layout that keeps each image easy to open and share.',
    // Moderation awareness: meme content changes quickly and may need periodic review before
    // expanding monetization or adding more aggressive ad placements around user-generated text.
    adsenseRisk: 'review',
    relatedSubreddits: ['aww', 'cats', 'wallpapers'],
  },
];

const subredditPagesBySlug = new Map(
  SUBREDDIT_PAGE_CONFIGS.map((config) => [config.slug.toLowerCase(), config])
);
const subredditPagesByName = new Map(
  SUBREDDIT_PAGE_CONFIGS.map((config) => [config.subredditName.toLowerCase(), config])
);

export function getAllSubredditPageConfigs(): SubredditPageConfig[] {
  return SUBREDDIT_PAGE_CONFIGS;
}

export function getSubredditPageConfigBySlug(slug: string): SubredditPageConfig | null {
  return subredditPagesBySlug.get(slug.toLowerCase()) ?? null;
}

export function getSubredditPageConfigBySubredditName(
  subredditName: string
): SubredditPageConfig | null {
  return subredditPagesByName.get(subredditName.toLowerCase()) ?? null;
}

export function getRelatedSubredditPageConfigs(
  config: SubredditPageConfig
): SubredditPageConfig[] {
  return config.relatedSubreddits
    .map((slug) => getSubredditPageConfigBySlug(slug))
    .filter((item): item is SubredditPageConfig => Boolean(item));
}

export function buildPreferredGalleryHref(
  subredditName: string,
  options?: GalleryRouteOptions
): string {
  const config = getSubredditPageConfigBySubredditName(subredditName);

  if (config) {
    return buildGalleryLandingHref(config.slug, options);
  }

  return buildGalleryHref(subredditName, options);
}
