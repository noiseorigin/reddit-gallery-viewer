const fallbackSiteUrl = 'https://reddit-gallery-viewer.vercel.app';

function normalizeUrl(url: string) {
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

export const SITE_NAME = 'Reddit Gallery Viewer';
export const SITE_URL = normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL ?? fallbackSiteUrl);
export const SITE_DESCRIPTION =
  'Turn any Reddit subreddit into a beautiful image gallery instantly. Browse photography, nature, art, memes and more with dynamic color themes. Fast, free, no sign-up needed.';
export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? 'discostrawberrycat@outlook.com';
export const ADSENSE_CLIENT = 'ca-pub-3491512248260741';
export const ADSENSE_PUBLISHER_ID = ADSENSE_CLIENT.replace('ca-', '');
