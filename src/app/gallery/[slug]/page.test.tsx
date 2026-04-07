import { describe, expect, it } from 'vitest';

import {
  dynamicParams,
  generateMetadata,
  generateStaticParams,
} from './page';

describe('gallery landing page route', () => {
  it('generates static params for configured landing pages', () => {
    expect(generateStaticParams()).toEqual(
      expect.arrayContaining([
        { slug: 'aww' },
        { slug: 'wallpapers' },
        { slug: 'earthporn' },
        { slug: 'cats' },
        { slug: 'memes' },
      ])
    );
    expect(dynamicParams).toBe(false);
  });

  it('builds metadata from landing-page config', async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: 'earthporn' }),
    });

    expect(metadata.title).toBe(
      'EarthPorn Gallery | Landscape and Nature Photos from Reddit | Reddit Gallery Viewer'
    );
    expect(metadata.alternates?.canonical).toBe('/gallery/earthporn');
    expect(metadata.description).toContain('landscape photography');
  });

  it('marks unknown landing pages as noindex', async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: 'unknown' }),
    });

    expect(metadata.robots).toEqual({
      index: false,
      follow: false,
    });
  });
});
