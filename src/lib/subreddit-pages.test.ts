import { describe, expect, it } from 'vitest';

import {
  buildPreferredGalleryHref,
  getRelatedSubredditPageConfigs,
  getSubredditPageConfigBySlug,
  getSubredditPageConfigBySubredditName,
} from './subreddit-pages';

describe('subreddit landing-page config', () => {
  it('looks up configs by slug and subreddit name', () => {
    expect(getSubredditPageConfigBySlug('earthporn')?.subredditName).toBe('EarthPorn');
    expect(getSubredditPageConfigBySubredditName('EarthPorn')?.slug).toBe('earthporn');
  });

  it('resolves related subreddit configs in config order', () => {
    const config = getSubredditPageConfigBySlug('aww');

    expect(config).not.toBeNull();
    expect(getRelatedSubredditPageConfigs(config!).map((item) => item.slug)).toEqual([
      'cats',
      'earthporn',
      'wallpapers',
    ]);
  });

  it('builds preferred landing URLs for configured pages', () => {
    expect(buildPreferredGalleryHref('aww')).toBe('/gallery/aww');
    expect(
      buildPreferredGalleryHref('EarthPorn', {
        time: 'month',
        sort: 'top',
      })
    ).toBe('/gallery/earthporn?time=month&sort=top');
  });

  it('falls back to generic subreddit routes for unconfigured names', () => {
    expect(buildPreferredGalleryHref('photography')).toBe('/r/photography');
  });
});
