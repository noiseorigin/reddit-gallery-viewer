import { describe, expect, it } from 'vitest';

import { generateMetadata } from './page';

describe('SubredditPage metadata', () => {
  it('builds canonical metadata for subreddit routes', async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ subreddit: 'EarthPorn' }),
    });

    expect(metadata.title).toBe('r/EarthPorn Image Gallery | Reddit Gallery Viewer');
    expect(metadata.alternates?.canonical).toBe('/gallery/earthporn');
    expect(metadata.description).toContain('r/EarthPorn');
  });

  it('marks invalid subreddit routes as noindex', async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ subreddit: 'bad/url' }),
    });

    expect(metadata.robots).toEqual({
      index: false,
      follow: false,
    });
  });
});
