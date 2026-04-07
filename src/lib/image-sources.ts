import { getProxyImageUrl, type RedditPost, sanitizeRedditImageUrl } from './reddit';

export interface StableImageSources {
  placeholderProxyUrl: string;
  fullProxyUrl: string;
  directFallbackUrl: string;
}

export function buildStableImageSources(post: RedditPost): StableImageSources {
  const directFallbackUrl = sanitizeRedditImageUrl(post.url);
  const previewImage = post.preview?.images?.[0];

  if (!previewImage) {
    const proxiedFallback = getProxyImageUrl(directFallbackUrl);

    return {
      placeholderProxyUrl: proxiedFallback,
      fullProxyUrl: proxiedFallback,
      directFallbackUrl,
    };
  }

  const resolutions = previewImage.resolutions ?? [];
  const targetWidth = 320;

  const placeholderCandidate =
    resolutions.find((resolution) => resolution.width >= targetWidth)?.url ??
    previewImage.source?.url ??
    directFallbackUrl;

  const fullCandidate = previewImage.source?.url ?? directFallbackUrl;

  return {
    placeholderProxyUrl: getProxyImageUrl(sanitizeRedditImageUrl(placeholderCandidate)),
    fullProxyUrl: getProxyImageUrl(sanitizeRedditImageUrl(fullCandidate)),
    directFallbackUrl,
  };
}
