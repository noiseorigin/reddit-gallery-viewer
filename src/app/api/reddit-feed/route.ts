import { NextRequest, NextResponse } from 'next/server';

import {
  buildExploreCommunitiesUrl,
  buildPopularSubredditsUrl,
  buildRedditFeedUrl,
  extractExploreSubreddits,
  extractPopularSubreddits,
  FALLBACK_POPULAR_SUBREDDITS,
  fetchRedditText,
  fetchRedditJson,
  mergePopularSubreddits,
  type PopularSubredditItem,
  type RedditPopularListing,
} from '@/lib/reddit-feed';

function parsePositiveInt(value: string | null, fallback: number): number {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const kind = params.get('kind') ?? 'feed';

  try {
    if (kind === 'popular') {
      const limit = parsePositiveInt(params.get('limit'), 8);
      const sources: PopularSubredditItem[][] = [];

      try {
        const exploreHtml = await fetchRedditText(buildExploreCommunitiesUrl());
        const exploreItems = extractExploreSubreddits(exploreHtml, limit);
        if (exploreItems.length > 0) {
          sources.push(exploreItems);
        }
      } catch (error) {
        console.warn('[REDDIT FEED] Explore communities fetch failed:', error);
      }

      if (mergePopularSubreddits(limit, ...sources).length < limit) {
        try {
          const payload = await fetchRedditJson<RedditPopularListing>(
            buildPopularSubredditsUrl(limit)
          );
          const popularItems = extractPopularSubreddits(payload, limit);
          if (popularItems.length > 0) {
            sources.push(popularItems);
          }
        } catch (error) {
          console.warn('[REDDIT FEED] Popular communities fetch failed:', error);
        }
      }

      const items = mergePopularSubreddits(
        limit,
        ...sources,
        FALLBACK_POPULAR_SUBREDDITS.slice(0, limit)
      );

      return NextResponse.json({ items });
    }

    const subreddit = params.get('subreddit');

    if (!subreddit) {
      return NextResponse.json(
        { error: 'subreddit is required for feed requests' },
        { status: 400 }
      );
    }

    const sort = params.get('sort') ?? 'top';
    const time = params.get('time') ?? 'day';
    const limit = parsePositiveInt(params.get('limit'), 100);

    const payload = await fetchRedditJson<Record<string, unknown>>(
      buildRedditFeedUrl(subreddit, time, sort, limit)
    );

    return NextResponse.json(payload);
  } catch (error) {
    console.warn('[REDDIT FEED] Upstream fetch failed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Reddit feed' },
      { status: 502 }
    );
  }
}
