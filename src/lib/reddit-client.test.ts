import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { apiCache } from './cache';
import {
  buildApiUrl,
  buildDirectPopularSubredditsUrl,
  buildDirectRedditFeedUrl,
  fetchRedditAPI,
  loadPopularSubreddits,
} from './reddit';

describe('client Reddit API access', () => {
  beforeEach(() => {
    apiCache.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('builds local feed URLs instead of Reddit URLs', () => {
    expect(buildApiUrl('EarthPorn', 'month', 'top', 40)).toBe(
      '/api/reddit-feed?kind=feed&subreddit=EarthPorn&time=month&sort=top&limit=40'
    );
  });

  it('fetches subreddit data through the local API route', async () => {
    const payload = { data: { children: [] } };
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(payload), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );

    await expect(
      fetchRedditAPI('/api/reddit-feed?kind=feed&subreddit=EarthPorn&time=month&sort=top&limit=40')
    ).resolves.toEqual(payload);

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/reddit-feed?kind=feed&subreddit=EarthPorn&time=month&sort=top&limit=40',
      expect.objectContaining({
        signal: expect.any(AbortSignal),
      })
    );
  });

  it('loads popular subreddits through the local API route', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          items: [{ name: 'EarthPorn', displayName: '🔥 r/EarthPorn' }],
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    );

    await expect(loadPopularSubreddits(8)).resolves.toEqual([
      { name: 'EarthPorn', displayName: '🔥 r/EarthPorn' },
    ]);

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/reddit-feed?kind=popular&limit=8',
      expect.objectContaining({
        signal: expect.any(AbortSignal),
      })
    );
  });

  it('falls back to direct reddit feed requests when the local feed route is blocked', async () => {
    const payload = { data: { children: [] } };
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ error: 'Failed to fetch Reddit feed' }), {
          status: 502,
          headers: { 'Content-Type': 'application/json' },
        })
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify(payload), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

    await expect(
      fetchRedditAPI('/api/reddit-feed?kind=feed&subreddit=EarthPorn&time=month&sort=top&limit=40')
    ).resolves.toEqual(payload);

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      '/api/reddit-feed?kind=feed&subreddit=EarthPorn&time=month&sort=top&limit=40',
      expect.objectContaining({ signal: expect.any(AbortSignal) })
    );

    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      buildDirectRedditFeedUrl('EarthPorn', 'month', 'top', 40),
      expect.objectContaining({
        headers: expect.objectContaining({ Accept: 'application/json' }),
        mode: 'cors',
        credentials: 'omit',
        signal: expect.any(AbortSignal),
      })
    );
  });

  it('falls back to direct popular subreddit requests when the local route is blocked', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ error: 'Failed to fetch Reddit feed' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        })
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            data: {
              children: [
                { data: { display_name: 'EarthPorn', display_name_prefixed: 'r/EarthPorn' } },
              ],
            },
          }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          }
        )
      );

    await expect(loadPopularSubreddits(8)).resolves.toEqual([
      { name: 'EarthPorn', displayName: '🔥 r/EarthPorn' },
    ]);

    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      buildDirectPopularSubredditsUrl(8),
      expect.objectContaining({
        headers: expect.objectContaining({ Accept: 'application/json' }),
        mode: 'cors',
        credentials: 'omit',
        signal: expect.any(AbortSignal),
      })
    );
  });
});
