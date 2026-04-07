import { NextRequest } from 'next/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { GET } from './route';

describe('GET /api/reddit-feed', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns 400 when subreddit is missing for feed requests', async () => {
    const request = new NextRequest('http://localhost:3000/api/reddit-feed?kind=feed');

    const response = await GET(request);

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: 'subreddit is required for feed requests',
    });
  });

  it('returns normalized popular subreddits', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          data: {
            children: [
              { data: { display_name: 'EarthPorn', display_name_prefixed: 'r/EarthPorn' } },
              { data: { display_name: 'pics', display_name_prefixed: 'r/pics', over18: true } },
              { data: { display_name: 'FoodPorn', display_name_prefixed: 'r/FoodPorn' } },
            ],
          },
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    );

    const request = new NextRequest('http://localhost:3000/api/reddit-feed?kind=popular&limit=2');
    const response = await GET(request);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      items: [
        { name: 'EarthPorn', displayName: '🔥 r/EarthPorn' },
        { name: 'FoodPorn', displayName: '🔥 r/FoodPorn' },
      ],
    });
  });

  it('returns feed payloads for subreddit requests', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          data: {
            children: [{ data: { id: '1', title: 'Aurora', url: 'https://i.redd.it/example.jpg' } }],
          },
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    );

    const request = new NextRequest(
      'http://localhost:3000/api/reddit-feed?kind=feed&subreddit=EarthPorn&sort=top&time=month&limit=40'
    );
    const response = await GET(request);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      data: {
        children: [{ data: { id: '1', title: 'Aurora', url: 'https://i.redd.it/example.jpg' } }],
      },
    });
  });

  it('returns 502 when the upstream request fails', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('upstream unavailable', { status: 503 })
    );

    const request = new NextRequest(
      'http://localhost:3000/api/reddit-feed?kind=feed&subreddit=EarthPorn&sort=top&time=month&limit=40'
    );
    const response = await GET(request);

    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toEqual({
      error: 'Failed to fetch Reddit feed',
    });
  });
});
