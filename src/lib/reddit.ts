import { apiCache } from "./cache";

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

export async function fetchRedditAPI(url: string): Promise<any> {
  const cached = apiCache.get(url);
  if (cached) {
    return cached;
  }

  const fetchWithTimeout = async (targetUrl: string) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    try {
      return await fetch(targetUrl, {
        headers: {
          Accept: "application/json",
        },
        mode: "cors",
        credentials: "omit",
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }
  };

  try {
    const isBrowser = typeof window !== 'undefined';
    const isReddit = url.includes('reddit.com');
    const proxiedUrl = `/api/reddit-json?url=${encodeURIComponent(url)}`;

    let response: Response;

    // Prefer server proxy first (for compatibility), but if Vercel IP is blocked by Reddit,
    // automatically fall back to direct browser request.
    if (isBrowser && isReddit) {
      response = await fetchWithTimeout(proxiedUrl);
      if (!response.ok) {
        console.warn(`[API] Proxy failed (${response.status}), fallback to direct Reddit request.`);
        response = await fetchWithTimeout(url);
      }
    } else {
      response = await fetchWithTimeout(url);
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    apiCache.set(url, data);
    return data;
  } catch (error) {
    console.error("[API FETCH ERROR]:", error, { url });
    throw error;
  }
}

export function buildApiUrl(
  subreddit: string,
  time: string,
  sort: string = "top",
  limit = 100
): string {
  const sortPath = sort === "top" ? "top" : sort;
  const timeParam = ["top", "controversial"].includes(sort) ? `&t=${time}` : "";
  return `https://www.reddit.com/r/${subreddit}/${sortPath}/.json?${timeParam}&limit=${limit}`;
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
  return posts
    .filter(
      (post) =>
        post.post_hint === "image" ||
        (post.url &&
          (post.url.endsWith(".jpg") ||
            post.url.endsWith(".png") ||
            post.url.endsWith(".gif")))
    )
    .slice(0, limit);
}

export async function loadPopularSubreddits(
  limit: number = 8
): Promise<Array<{ name: string; displayName: string }> | null> {
  try {
    const json = await fetchRedditAPI(
      `https://www.reddit.com/subreddits/popular.json?limit=${limit * 3}`
    );
    const items =
      json?.data?.children
        ?.map((child: any) => child?.data)
        ?.filter(
          (data: any) =>
            data &&
            !data.over18 &&
            !data.quarantine &&
            !data.hide_ads &&
            !data.restrict_commenting
        )
        ?.slice(0, limit)
        ?.map((data: any) => ({
          name: data.display_name,
          displayName: `🔥 ${data.display_name_prefixed}`,
        })) || [];

    return items.length > 0 ? items : null;
  } catch (error) {
    console.warn("Unable to fetch popular subreddits:", error);
    return null;
  }
}
