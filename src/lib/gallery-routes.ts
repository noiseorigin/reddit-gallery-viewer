export const DEFAULT_GALLERY_TIME = 'day';
export const DEFAULT_GALLERY_SORT = 'new';

export function buildSubredditPath(subreddit: string): string {
  return `/r/${encodeURIComponent(subreddit)}`;
}

export function buildGalleryHref(
  subreddit: string,
  options: {
    time?: string;
    sort?: string;
    includeDefaults?: boolean;
  } = {}
): string {
  const { time, sort, includeDefaults = false } = options;
  const params = new URLSearchParams();

  if (time && (includeDefaults || time !== DEFAULT_GALLERY_TIME)) {
    params.set('time', time);
  }

  if (sort && (includeDefaults || sort !== DEFAULT_GALLERY_SORT)) {
    params.set('sort', sort);
  }

  const queryString = params.toString();
  return queryString ? `${buildSubredditPath(subreddit)}?${queryString}` : buildSubredditPath(subreddit);
}
