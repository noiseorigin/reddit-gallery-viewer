const REDDIT_USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

export interface PopularSubredditItem {
  name: string;
  displayName: string;
}

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
