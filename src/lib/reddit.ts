import { apiCache } from './cache';

export interface RedditPost {
  id: string;
  title: string;
  url: string;
  permalink: string;
  post_hint?: string;
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

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

export async function fetchRedditAPI(url: string): Promise<any> {
  const cached = apiCache.get(url);
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': USER_AGENT,
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      mode: 'cors',
      credentials: 'omit',
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    apiCache.set(url, data);
    return data;
  } catch (error) {
    console.error('[API FETCH ERROR]:', error, { url });
    throw error;
  }
}

export function buildApiUrl(subreddit: string, time: string, limit = 100): string {
  return `https://www.reddit.com/r/${subreddit}/top/.json?t=${time}&limit=${limit}`;
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
  if (!url) return '';

  let decoded = url.replace(/&amp;/g, '&');

  if (decoded.includes('reddit.com') || decoded.includes('redditmedia.com')) {
    const separator = decoded.includes('?') ? '&' : '?';
    decoded += separator + 't=' + Date.now();
  }

  return decoded;
}

export function getPostImageSources(postData: RedditPost): { placeholder: string; full: string } {
  const fallback = sanitizeRedditImageUrl(postData.url);
  const previewImage = postData.preview?.images?.[0];

  if (!previewImage) {
    return { placeholder: fallback, full: fallback };
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
    placeholder: placeholder || full || fallback,
    full: full || fallback,
  };
}

export function filterImagePosts(posts: RedditPost[], limit: number = 40): RedditPost[] {
  return posts
    .filter(
      (post) =>
        post.post_hint === 'image' ||
        (post.url && (post.url.endsWith('.jpg') || post.url.endsWith('.png') || post.url.endsWith('.gif')))
    )
    .slice(0, limit);
}

export async function loadPopularSubreddits(limit: number = 8): Promise<Array<{ name: string; displayName: string }> | null> {
  try {
    const response = await fetch(
      `https://www.reddit.com/subreddits/popular.json?limit=${limit * 3}`,
      {
        headers: {
          'User-Agent': USER_AGENT,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const json = await response.json();
    const items =
      json?.data?.children
        ?.map((child: any) => child?.data)
        ?.filter(
          (data: any) =>
            data && !data.over18 && !data.quarantine && !data.hide_ads && !data.restrict_commenting
        )
        ?.slice(0, limit)
        ?.map((data: any) => ({
          name: data.display_name,
          displayName: `🔥 ${data.display_name_prefixed}`,
        })) || [];

    return items.length > 0 ? items : null;
  } catch (error) {
    console.warn('Unable to fetch popular subreddits:', error);
    return null;
  }
}
