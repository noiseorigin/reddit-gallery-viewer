import { NextRequest, NextResponse } from 'next/server';

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const ALLOWED_HOSTS = new Set(['www.reddit.com', 'reddit.com', 'oauth.reddit.com']);

export async function GET(request: NextRequest) {
  try {
    const rawUrl = request.nextUrl.searchParams.get('url');
    if (!rawUrl) {
      return NextResponse.json({ error: 'url is required' }, { status: 400 });
    }

    const decodedUrl = decodeURIComponent(rawUrl);
    const target = new URL(decodedUrl);

    if (!ALLOWED_HOSTS.has(target.hostname.toLowerCase())) {
      return NextResponse.json({ error: 'host not allowed' }, { status: 400 });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    let response: Response;
    try {
      response = await fetch(target.toString(), {
        headers: {
          'User-Agent': USER_AGENT,
          Accept: 'application/json',
          'Accept-Language': 'en-US,en;q=0.9',
          Referer: 'https://www.reddit.com/',
        },
        redirect: 'follow',
        signal: controller.signal,
        cache: 'no-store',
      });
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: `upstream HTTP ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error('[REDDIT JSON PROXY ERROR]:', error);
    return NextResponse.json({ error: 'failed to fetch reddit data' }, { status: 500 });
  }
}
