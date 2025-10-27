import { NextRequest, NextResponse } from 'next/server';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

// Redirect to direct image URL as fallback
export async function GET(request: NextRequest) {
  try {
    // Get image URL from query parameter
    const url = request.nextUrl.searchParams.get('url');
    const fallback = request.nextUrl.searchParams.get('fallback') === 'true';

    if (!url) {
      return NextResponse.json(
        { error: 'URL parameter is required' },
        { status: 400 }
      );
    }

    // Decode the URL
    const decodedUrl = decodeURIComponent(url);

    // Validate that the URL is from allowed domains
    const allowedDomains = [
      'preview.redd.it',
      'i.redd.it',
      'i.imgur.com',
      'imgur.com',
      'external-preview.redd.it',
      'redditmedia.com',
      'reddit.com',
    ];

    let isAllowed = false;
    for (const domain of allowedDomains) {
      if (decodedUrl.includes(domain)) {
        isAllowed = true;
        break;
      }
    }

    if (!isAllowed) {
      // Return 400 to signal client to use direct URL
      return NextResponse.json(
        { error: 'URL domain not allowed' },
        { status: 400 }
      );
    }

    // If fallback flag is set, just return a redirect (for browser direct access)
    if (fallback) {
      return NextResponse.redirect(decodedUrl, { status: 307 });
    }

    // Fetch the image from the source with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
      const response = await fetch(decodedUrl, {
        headers: {
          'User-Agent': USER_AGENT,
          'Accept': 'image/*',
          'Accept-Language': 'en-US,en;q=0.9',
          'Referer': 'https://www.reddit.com/',
        },
        redirect: 'follow',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.warn(`[PROXY] Failed to fetch ${decodedUrl}: ${response.status}`);
        // Return the direct URL for fallback
        return NextResponse.json(
          { url: decodedUrl },
          { status: 200 }
        );
      }

      // Get the content type
      const contentType = response.headers.get('content-type') || 'image/jpeg';

      // Create a new response with the image data
      const imageBuffer = await response.arrayBuffer();

      const responseHeaders = new Headers();
      responseHeaders.set('Content-Type', contentType);
      // Cache for 7 days on the client and CDN
      responseHeaders.set('Cache-Control', 'public, max-age=604800, immutable');
      responseHeaders.set('Access-Control-Allow-Origin', '*');

      return new NextResponse(imageBuffer, {
        status: 200,
        headers: responseHeaders,
      });
    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.warn(`[PROXY] Fetch failed for ${decodedUrl}:`, fetchError);
      // Return direct URL as fallback
      return NextResponse.json(
        { url: decodedUrl },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error('[PROXY IMAGE ERROR]:', error);
    // Return error but don't fail completely
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
