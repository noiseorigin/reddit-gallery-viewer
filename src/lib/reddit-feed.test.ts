import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  buildPopularSubredditsUrl,
  buildRedditFeedUrl,
  extractPopularSubreddits,
  fetchRedditJson,
} from './reddit-feed';

describe('buildRedditFeedUrl', () => {
  it('builds a top feed URL with a time parameter', () => {
    expect(buildRedditFeedUrl('EarthPorn', 'month', 'top', 40)).toBe(
      'https://www.reddit.com/r/EarthPorn/top/.json?&t=month&limit=40'
    );
  });

  it('builds a non-top feed URL without a time parameter', () => {
    expect(buildRedditFeedUrl('photography', 'day', 'new', 100)).toBe(
      'https://www.reddit.com/r/photography/new/.json?&limit=100'
    );
  });
});

describe('buildPopularSubredditsUrl', () => {
  it('requests extra upstream results before filtering', () => {
    expect(buildPopularSubredditsUrl(8)).toBe(
      'https://www.reddit.com/subreddits/popular.json?limit=24'
    );
  });
});

describe('extractPopularSubreddits', () => {
  it('filters restricted subreddits and limits the result set', () => {
    const items = extractPopularSubreddits(
      {
        data: {
          children: [
            { data: { display_name: 'EarthPorn', display_name_prefixed: 'r/EarthPorn' } },
            { data: { display_name: 'pics', display_name_prefixed: 'r/pics', over18: true } },
            { data: { display_name: 'FoodPorn', display_name_prefixed: 'r/FoodPorn' } },
            { data: { display_name: 'quarantined', display_name_prefixed: 'r/quarantined', quarantine: true } },
          ],
        },
      },
      2
    );

    expect(items).toEqual([
      { name: 'EarthPorn', displayName: '🔥 r/EarthPorn' },
      { name: 'FoodPorn', displayName: '🔥 r/FoodPorn' },
    ]);
  });
});

describe('fetchRedditJson', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns parsed JSON for a successful upstream response', async () => {
    const payload = { data: { children: [] } };
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(payload),
    });

    await expect(
      fetchRedditJson('https://www.reddit.com/r/EarthPorn/top/.json?&t=month&limit=100', fetchMock)
    ).resolves.toEqual(payload);

    expect(fetchMock).toHaveBeenCalledWith(
      'https://www.reddit.com/r/EarthPorn/top/.json?&t=month&limit=100',
      expect.objectContaining({
        headers: expect.objectContaining({
          Accept: 'application/json',
          'Accept-Language': 'en-US,en;q=0.9',
          'User-Agent': expect.any(String),
        }),
        signal: expect.any(AbortSignal),
      })
    );
  });

  it('throws when the upstream response is not ok', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
    });

    await expect(
      fetchRedditJson('https://www.reddit.com/subreddits/popular.json?limit=24', fetchMock)
    ).rejects.toThrow('HTTP 503');
  });
});
