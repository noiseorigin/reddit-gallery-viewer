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
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        `
          <a href="/r/photography/">Photography</a>
          <a href="https://www.reddit.com/r/houseplants/">Houseplants</a>
        `,
        {
          status: 200,
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        }
      )
    );

    const request = new NextRequest('http://localhost:3000/api/reddit-feed?kind=popular&limit=2');
    const response = await GET(request);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      items: [
        { name: 'photography', displayName: '🔥 r/photography' },
        { name: 'houseplants', displayName: '🔥 r/houseplants' },
      ],
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('falls back to popular listings when explore is empty', async () => {
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(
        new Response('<html><body>No subreddit links here</body></html>', {
          status: 200,
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        })
      )
      .mockResolvedValueOnce(
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

  it('falls back to safe defaults when upstream community sources fail', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(new Response('blocked', { status: 403 }))
      .mockResolvedValueOnce(new Response('upstream unavailable', { status: 503 }));

    const request = new NextRequest('http://localhost:3000/api/reddit-feed?kind=popular&limit=3');
    const response = await GET(request);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      items: [
        { name: 'photography', displayName: '📸 Photography' },
        { name: 'EarthPorn', displayName: '🌍 Nature' },
        { name: 'CatsStandingUp', displayName: '🐱 Cats' },
      ],
    });
  });

  it('returns feed payloads for subreddit requests', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          data: {
            children: [
              { data: { id: '1', title: 'Aurora', url: 'https://i.redd.it/example.jpg' } },
            ],
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
