import { apiCache } from "./cache";
import {
  extractPopularSubreddits,
  FALLBACK_POPULAR_SUBREDDITS,
  type PopularSubredditItem,
  type RedditPopularListing,
} from "./reddit-feed";

export interface RedditPost {
  id: string;
  title: string;
  url: string;
  permalink: string;
  post_hint?: string;
  over_18?: boolean;
  thumbnail?: string;
  preview?: {
    images: Array<{
      source: { url: string; width: number; height: number };
      resolutions: Array<{ url: string; width: number; height: number }>;
    }>;
  };
}

export interface RedditResponse {
  data: {
    children: Array<{ data: RedditPost }>;
  };
}

export async function fetchRedditAPI(url: string): Promise<any> {
  const cached = apiCache.get(url);
  if (cached) {
    return cached;
  }

  const fetchJson = async (targetUrl: string, useBrowserHeaders: boolean = false) => {
    const response = await fetch(targetUrl, {
      headers: useBrowserHeaders
        ? {
            Accept: 'application/json',
          }
        : undefined,
      mode: useBrowserHeaders ? 'cors' : undefined,
      credentials: useBrowserHeaders ? 'omit' : undefined,
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      const error = new Error(`HTTP ${response.status}`) as Error & {
        status?: number;
        url?: string;
      };
      error.status = response.status;
      error.url = targetUrl;
      throw error;
    }

    return response.json();
  };

  try {
    const data = await fetchJson(url, url.startsWith('https://www.reddit.com/'));
    apiCache.set(url, data);
    return data;
  } catch (error) {
    const fallbackUrl = getDirectRedditFallbackUrl(url);

    if (fallbackUrl && shouldRetryDirectly(error)) {
      try {
        const data = await fetchJson(fallbackUrl, true);
        apiCache.set(url, data);
        return data;
      } catch (fallbackError) {
        console.error('[API FETCH FALLBACK ERROR]:', fallbackError, {
          url,
          fallbackUrl,
        });
        throw fallbackError;
      }
    }

    console.error("[API FETCH ERROR]:", error, { url });
    throw error;
  }
}

export function buildDirectRedditFeedUrl(
  subreddit: string,
  time: string,
  sort: string = 'top',
  limit = 100
): string {
  const sortPath = sort === 'top' ? 'top' : sort;
  const timeParam = ['top', 'controversial'].includes(sort) ? `&t=${time}` : '';
  return `https://www.reddit.com/r/${subreddit}/${sortPath}/.json?${timeParam}&limit=${limit}`;
}

export function buildDirectPopularSubredditsUrl(limit: number = 8): string {
  return `https://www.reddit.com/subreddits/popular.json?limit=${limit * 3}`;
}

export function buildApiUrl(
  subreddit: string,
  time: string,
  sort: string = "top",
  limit = 100
): string {
  const params = new URLSearchParams({
    kind: "feed",
    subreddit,
    time,
    sort,
    limit: String(limit),
  });

  return `/api/reddit-feed?${params.toString()}`;
}

export function parseSubredditName(input: string): string | null {
  input = input.trim();

  const urlPatterns = [
    /https?:\/\/(?:www\.)?reddit\.com\/r\/([a-zA-Z0-9_-]+)/i,
    /https?:\/\/(?:www\.)?reddit\.com\/r\/([a-zA-Z0-9_-]+)\//i,
    /^r\/([a-zA-Z0-9_-]+)/i,
  ];

  for (const pattern of urlPatterns) {
    const match = input.match(pattern);
    if (match) {
      return match[1];
    }
  }

  if (/^[a-zA-Z0-9_-]+$/.test(input)) {
    return input;
  }

  return null;
}

export function sanitizeRedditImageUrl(url: string): string {
  if (!url) return "";

  let decoded = url.replace(/&amp;/g, "&");

  if (decoded.includes("reddit.com") || decoded.includes("redditmedia.com")) {
    const separator = decoded.includes("?") ? "&" : "?";
    decoded += separator + "t=" + Date.now();
  }

  return decoded;
}

export function getProxyImageUrl(imageUrl: string, useFallback: boolean = false): string {
  if (!imageUrl) return "";

  try {
    const encodedUrl = encodeURIComponent(imageUrl);

    // If useFallback is true, try proxy but have fallback
    if (useFallback) {
      return `/api/proxy-image?url=${encodedUrl}&fallback=true`;
    }

    return `/api/proxy-image?url=${encodedUrl}`;
  } catch (error) {
    console.error("[PROXY URL ERROR]:", error);
    return imageUrl;
  }
}

export function getPostImageSources(postData: RedditPost): {
  placeholder: string;
  full: string;
} {
  const fallback = sanitizeRedditImageUrl(postData.url);
  const previewImage = postData.preview?.images?.[0];

  if (!previewImage) {
    return {
      placeholder: getProxyImageUrl(fallback),
      full: getProxyImageUrl(fallback)
    };
  }

  const resolutions = previewImage.resolutions || [];
  const targetWidth = 320;

  let placeholderRes = resolutions[0];
  for (const res of resolutions) {
    if (res.width >= targetWidth) {
      placeholderRes = res;
      break;
    }
  }

  const placeholder = sanitizeRedditImageUrl(
    placeholderRes?.url || previewImage.source?.url || fallback
  );
  const full = sanitizeRedditImageUrl(previewImage.source?.url || fallback);

  return {
    placeholder: getProxyImageUrl(placeholder || full || fallback),
    full: getProxyImageUrl(full || fallback),
  };
}

export function filterImagePosts(
  posts: RedditPost[],
  limit: number = 40
): RedditPost[] {
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

  return posts
    .filter(
      (post) =>
        !post.over_18 &&
        post.thumbnail !== 'nsfw' &&
        (
          post.post_hint === "image" ||
          (post.url &&
            allowedExtensions.some((extension) =>
              post.url.toLowerCase().split('?')[0]?.endsWith(extension)
            ))
        )
    )
    .slice(0, limit);
}

export async function loadPopularSubreddits(
  limit: number = 8
): Promise<PopularSubredditItem[] | null> {
  try {
    const localUrl = `/api/reddit-feed?kind=popular&limit=${limit}`;

    try {
      const response = await fetch(localUrl, {
        signal: AbortSignal.timeout(15000),
      });

      if (!response.ok) {
        const error = new Error(`HTTP ${response.status}`) as Error & { status?: number };
        error.status = response.status;
        throw error;
      }

      const json = (await response.json()) as {
        items?: Array<{ name: string; displayName: string }>;
      };

      const items = json.items ?? [];
      return items.length > 0 ? items : null;
    } catch (error) {
      if (!shouldRetryDirectly(error)) {
        throw error;
      }

      const json = await fetchRedditAPI(buildDirectPopularSubredditsUrl(limit));
      const items = extractPopularSubreddits(json as RedditPopularListing, limit);

      return items.length > 0 ? items : FALLBACK_POPULAR_SUBREDDITS.slice(0, limit);
    }
  } catch (error) {
    console.warn("Unable to fetch popular subreddits:", error);
    return FALLBACK_POPULAR_SUBREDDITS.slice(0, limit);
  }
}

function shouldRetryDirectly(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  const status = (error as Error & { status?: number }).status;
  return status === 403 || status === 429 || status === 500 || status === 502 || status === 504;
}

function getDirectRedditFallbackUrl(url: string): string | null {
  if (!url.startsWith('/api/reddit-feed?')) {
    return null;
  }

  const params = new URLSearchParams(url.split('?')[1] ?? '');
  const kind = params.get('kind') ?? 'feed';

  if (kind === 'popular') {
    return buildDirectPopularSubredditsUrl(Number(params.get('limit') ?? '8'));
  }

  const subreddit = params.get('subreddit');
  if (!subreddit) {
    return null;
  }

  return buildDirectRedditFeedUrl(
    subreddit,
    params.get('time') ?? 'day',
    params.get('sort') ?? 'top',
    Number(params.get('limit') ?? '100')
  );
}
