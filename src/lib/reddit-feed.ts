const REDDIT_USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

export interface PopularSubredditItem {
  name: string;
  displayName: string;
}

export const FALLBACK_POPULAR_SUBREDDITS: PopularSubredditItem[] = [
  { name: 'photography', displayName: '📸 Photography' },
  { name: 'EarthPorn', displayName: '🌍 Nature' },
  { name: 'CatsStandingUp', displayName: '🐱 Cats' },
  { name: 'InteriorDesign', displayName: '🏠 Interior Design' },
  { name: 'Art', displayName: '🎨 Art' },
  { name: 'FoodPorn', displayName: '🍕 Food' },
  { name: 'houseplants', displayName: '🌱 Houseplants' },
];

export interface RedditPopularListing {
  data?: {
    children?: Array<{
      data?: {
        display_name?: string;
        display_name_prefixed?: string;
        over18?: boolean;
        quarantine?: boolean;
        hide_ads?: boolean;
        restrict_commenting?: boolean;
      };
    }>;
  };
}

type FetchImplementation = typeof fetch;

const RESERVED_SUBREDDIT_NAMES = new Set(['all', 'friends', 'mod', 'popular', 'users']);

export function buildRedditFeedUrl(
  subreddit: string,
  time: string,
  sort: string = 'top',
  limit: number = 100
): string {
  const sortPath = sort === 'top' ? 'top' : sort;
  const timeParam = ['top', 'controversial'].includes(sort) ? `&t=${time}` : '';
  return `https://www.reddit.com/r/${subreddit}/${sortPath}/.json?${timeParam}&limit=${limit}`;
}

export function buildPopularSubredditsUrl(limit: number = 8): string {
  return `https://www.reddit.com/subreddits/popular.json?limit=${limit * 3}`;
}

export function buildExploreCommunitiesUrl(): string {
  return 'https://www.reddit.com/explore/';
}

export async function fetchRedditJson<T>(
  url: string,
  fetchImplementation: FetchImplementation = fetch
): Promise<T> {
  const response = await fetchImplementation(url, {
    headers: {
      'User-Agent': REDDIT_USER_AGENT,
      Accept: 'application/json',
      'Accept-Language': 'en-US,en;q=0.9',
    },
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function fetchRedditText(
  url: string,
  fetchImplementation: FetchImplementation = fetch
): Promise<string> {
  const response = await fetchImplementation(url, {
    headers: {
      'User-Agent': REDDIT_USER_AGENT,
      Accept: 'text/html,application/xhtml+xml',
      'Accept-Language': 'en-US,en;q=0.9',
    },
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.text();
}

export function extractPopularSubreddits(
  payload: RedditPopularListing,
  limit: number = 8
): PopularSubredditItem[] {
  return (
    payload.data?.children
      ?.map((child) => child.data)
      ?.filter(
        (item): item is NonNullable<typeof item> =>
          Boolean(item?.display_name) &&
          Boolean(item?.display_name_prefixed) &&
          !item?.over18 &&
          !item?.quarantine &&
          !item?.hide_ads &&
          !item?.restrict_commenting
      )
      ?.slice(0, limit)
      ?.map((item) => ({
        name: item.display_name!,
        displayName: `🔥 ${item.display_name_prefixed!}`,
      })) ?? []
  );
}

export function extractExploreSubreddits(
  html: string,
  limit: number = 8
): PopularSubredditItem[] {
  const normalizedHtml = html
    .replace(/\\u002F/gi, '/')
    .replace(/\\\//g, '/')
    .replace(/&amp;/g, '&');

  const matches = normalizedHtml.matchAll(
    /(?:https?:\/\/(?:www\.)?reddit\.com)?\/r\/([A-Za-z0-9][A-Za-z0-9_]{1,20})\b/g
  );
  const items: PopularSubredditItem[] = [];
  const seen = new Set<string>();

  for (const match of matches) {
    const subredditName = match[1];
    const normalizedName = subredditName.toLowerCase();

    if (RESERVED_SUBREDDIT_NAMES.has(normalizedName) || seen.has(normalizedName)) {
      continue;
    }

    seen.add(normalizedName);
    items.push({
      name: subredditName,
      displayName: `🔥 r/${subredditName}`,
    });

    if (items.length >= limit) {
      break;
    }
  }

  return items;
}

export function mergePopularSubreddits(
  limit: number,
  ...lists: PopularSubredditItem[][]
): PopularSubredditItem[] {
  const merged: PopularSubredditItem[] = [];
  const seen = new Set<string>();

  for (const list of lists) {
    for (const item of list) {
      const normalizedName = item.name.toLowerCase();

      if (seen.has(normalizedName)) {
        continue;
      }

      seen.add(normalizedName);
      merged.push(item);

      if (merged.length >= limit) {
        return merged;
      }
    }
  }

  return merged;
}
