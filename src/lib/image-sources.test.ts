import { describe, expect, it } from 'vitest';

import type { RedditPost } from './reddit';
import { buildStableImageSources } from './image-sources';

describe('buildStableImageSources', () => {
  it('builds proxy placeholder/full URLs and keeps a direct fallback URL', () => {
    const post: RedditPost = {
      id: '1',
      title: 'Aurora',
      permalink: '/r/EarthPorn/comments/1',
      post_hint: 'image',
      url: 'https://i.redd.it/full.jpg',
      preview: {
        images: [
          {
            source: {
              url: 'https://preview.redd.it/full-preview.jpg?auto=webp&amp;s=full',
              width: 1200,
              height: 800,
            },
            resolutions: [
              {
                url: 'https://preview.redd.it/320-preview.jpg?width=320&amp;crop=smart&amp;auto=webp&amp;s=small',
                width: 320,
                height: 213,
              },
            ],
          },
        ],
      },
    };

    expect(buildStableImageSources(post)).toEqual({
      placeholderProxyUrl:
        '/api/proxy-image?url=https%3A%2F%2Fpreview.redd.it%2F320-preview.jpg%3Fwidth%3D320%26crop%3Dsmart%26auto%3Dwebp%26s%3Dsmall',
      fullProxyUrl:
        '/api/proxy-image?url=https%3A%2F%2Fpreview.redd.it%2Ffull-preview.jpg%3Fauto%3Dwebp%26s%3Dfull',
      directFallbackUrl: 'https://i.redd.it/full.jpg',
    });
  });

  it('falls back to the direct image URL when preview data is missing', () => {
    const post: RedditPost = {
      id: '2',
      title: 'Lake',
      permalink: '/r/EarthPorn/comments/2',
      post_hint: 'image',
      url: 'https://i.redd.it/lake.jpg',
    };

    expect(buildStableImageSources(post)).toEqual({
      placeholderProxyUrl: '/api/proxy-image?url=https%3A%2F%2Fi.redd.it%2Flake.jpg',
      fullProxyUrl: '/api/proxy-image?url=https%3A%2F%2Fi.redd.it%2Flake.jpg',
      directFallbackUrl: 'https://i.redd.it/lake.jpg',
    });
  });
});
