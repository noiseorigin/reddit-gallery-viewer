import { NextRequest } from 'next/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { GET } from './route';

describe('GET /api/proxy-image', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns 400 when the url parameter is missing', async () => {
    const response = await GET(new NextRequest('http://localhost:3000/api/proxy-image'));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: 'URL parameter is required',
    });
  });

  it('returns 400 when the domain is not allowed', async () => {
    const response = await GET(
      new NextRequest(
        'http://localhost:3000/api/proxy-image?url=https%3A%2F%2Fexample.com%2Fimage.jpg'
      )
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: 'URL domain not allowed',
    });
  });

  it('returns a redirect when fallback mode is explicitly requested', async () => {
    const response = await GET(
      new NextRequest(
        'http://localhost:3000/api/proxy-image?url=https%3A%2F%2Fi.redd.it%2Fimage.jpg&fallback=true'
      )
    );

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('https://i.redd.it/image.jpg');
  });

  it('returns image bytes on upstream success', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('image-bytes', {
        status: 200,
        headers: { 'Content-Type': 'image/jpeg' },
      })
    );

    const response = await GET(
      new NextRequest(
        'http://localhost:3000/api/proxy-image?url=https%3A%2F%2Fi.redd.it%2Fimage.jpg'
      )
    );

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('image/jpeg');

    const body = await response.arrayBuffer();
    expect(new TextDecoder().decode(body)).toBe('image-bytes');
  });

  it('returns 502 when the upstream image request is not ok', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('upstream unavailable', { status: 503 })
    );

    const response = await GET(
      new NextRequest(
        'http://localhost:3000/api/proxy-image?url=https%3A%2F%2Fi.redd.it%2Fimage.jpg'
      )
    );

    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toEqual({
      error: 'Failed to fetch upstream image',
    });
  });
});
