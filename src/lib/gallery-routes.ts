export const DEFAULT_GALLERY_TIME = 'day';
export const DEFAULT_GALLERY_SORT = 'new';

export interface GalleryRouteOptions {
  time?: string;
  sort?: string;
  includeDefaults?: boolean;
}

export function buildSubredditPath(subreddit: string): string {
  return `/r/${encodeURIComponent(subreddit)}`;
}

export function buildGalleryLandingPath(slug: string): string {
  return `/gallery/${encodeURIComponent(slug.toLowerCase())}`;
}

function buildGalleryQueryString(options: GalleryRouteOptions = {}): string {
  const { time, sort, includeDefaults = false } = options;
  const params = new URLSearchParams();

  if (time && (includeDefaults || time !== DEFAULT_GALLERY_TIME)) {
    params.set('time', time);
  }

  if (sort && (includeDefaults || sort !== DEFAULT_GALLERY_SORT)) {
    params.set('sort', sort);
  }

  return params.toString();
}

export function buildGalleryHref(
  subreddit: string,
  options: GalleryRouteOptions = {}
): string {
  const queryString = buildGalleryQueryString(options);
  return queryString ? `${buildSubredditPath(subreddit)}?${queryString}` : buildSubredditPath(subreddit);
}

export function buildGalleryLandingHref(
  slug: string,
  options: GalleryRouteOptions = {}
): string {
  const queryString = buildGalleryQueryString(options);
  return queryString ? `${buildGalleryLandingPath(slug)}?${queryString}` : buildGalleryLandingPath(slug);
}
