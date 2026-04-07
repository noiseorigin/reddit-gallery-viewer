import { describe, expect, it } from 'vitest';

import {
  buildGalleryHref,
  buildSubredditPath,
  DEFAULT_GALLERY_SORT,
  DEFAULT_GALLERY_TIME,
} from './gallery-routes';

describe('gallery routes', () => {
  it('builds subreddit paths', () => {
    expect(buildSubredditPath('EarthPorn')).toBe('/r/EarthPorn');
  });

  it('keeps default gallery URLs clean', () => {
    expect(
      buildGalleryHref('photography', {
        time: DEFAULT_GALLERY_TIME,
        sort: DEFAULT_GALLERY_SORT,
      })
    ).toBe('/r/photography');
  });

  it('includes non-default filters in the gallery URL', () => {
    expect(
      buildGalleryHref('photography', {
        time: 'month',
        sort: 'top',
      })
    ).toBe('/r/photography?time=month&sort=top');
  });

  it('can keep default filters when explicitly requested', () => {
    expect(
      buildGalleryHref('photography', {
        time: DEFAULT_GALLERY_TIME,
        sort: DEFAULT_GALLERY_SORT,
        includeDefaults: true,
      })
    ).toBe('/r/photography?time=day&sort=new');
  });
});
