import { NextRequest, NextResponse } from 'next/server';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

export async function GET(request: NextRequest) {
  try {
    // Get image URL from query parameter
    const url = request.nextUrl.searchParams.get('url');

    if (!url) {
      return NextResponse.json(
        { error: 'URL parameter is required' },
        { status: 400 }
      );
    }

    // Validate that the URL is from allowed domains
    const allowedDomains = [
      'preview.redd.it',
      'i.redd.it',
      'i.imgur.com',
      'imgur.com',
      'external-preview.redd.it',
    ];

    let isAllowed = false;
    for (const domain of allowedDomains) {
      if (url.includes(domain)) {
        isAllowed = true;
        break;
      }
    }

    if (!isAllowed) {
      return NextResponse.json(
        { error: 'URL domain not allowed' },
        { status: 403 }
      );
    }

    // Decode the URL
    let decodedUrl = decodeURIComponent(url);

    // Fetch the image from the source
    const response = await fetch(decodedUrl, {
      headers: {
        'User-Agent': USER_AGENT,
        'Accept': 'image/*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://www.reddit.com/',
      },
      // Don't follow redirects for images
      redirect: 'follow',
      cache: 'force-cache',
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch image: ${response.status}` },
        { status: response.status }
      );
    }

    // Get the content type
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    // Create a new response with the image data
    const imageBuffer = await response.arrayBuffer();

    const headers = new Headers();
    headers.set('Content-Type', contentType);
    // Cache for 7 days on the client and CDN
    headers.set('Cache-Control', 'public, max-age=604800, s-maxage=604800, immutable');
    // Prevent CORS issues
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');

    return new NextResponse(imageBuffer, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('[PROXY IMAGE ERROR]:', error);
    return NextResponse.json(
      { error: 'Failed to proxy image' },
      { status: 500 }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
