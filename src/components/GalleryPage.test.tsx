import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { GalleryPage } from './GalleryPage';
import {
  buildApiUrl,
  fetchRedditAPI,
  filterImagePosts,
  loadPopularSubreddits,
} from '@/lib/reddit';
import {
  addToSearchHistory,
  getSearchHistory,
  readCachedPopularSubreddits,
  storePopularSubreddits,
} from '@/lib/storage';

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;

  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
}

const mockUseSearchParams = vi.fn();

vi.mock('next/navigation', () => ({
  useSearchParams: () => mockUseSearchParams(),
}));

vi.mock('@/lib/reddit', async () => {
  const actual = await vi.importActual<typeof import('@/lib/reddit')>('@/lib/reddit');

  return {
    ...actual,
    buildApiUrl: vi.fn(
      (subreddit: string, time: string, sort: string = 'top', limit: number = 100) =>
        `/api/reddit-feed?kind=feed&subreddit=${subreddit}&time=${time}&sort=${sort}&limit=${limit}`
    ),
    fetchRedditAPI: vi.fn(),
    filterImagePosts: vi.fn((posts: unknown[]) => posts),
    loadPopularSubreddits: vi.fn(),
  };
});

vi.mock('@/lib/storage', async () => {
  const actual = await vi.importActual<typeof import('@/lib/storage')>('@/lib/storage');

  return {
    ...actual,
    addToSearchHistory: vi.fn(),
    getSearchHistory: vi.fn(() => []),
    readCachedPopularSubreddits: vi.fn(() => null),
    storePopularSubreddits: vi.fn(),
  };
});

vi.mock('@/lib/mobile', async () => {
  const actual = await vi.importActual<typeof import('@/lib/mobile')>('@/lib/mobile');

  return {
    ...actual,
    getMobileOptimizations: vi.fn(() => ({
      isLowBandwidth: false,
      isSlowDevice: false,
      isMobileDevice: false,
      shouldReduceImages: false,
      imageLoadPriority: 'eager' as const,
      cacheAggressively: false,
      connectionType: 'unknown' as const,
    })),
    logMobileOptimizations: vi.fn(),
  };
});

vi.mock('./SubredditButtons', () => ({
  SubredditButtons: ({
    subreddits,
    onSelect,
  }: {
    subreddits: Array<{ name: string; displayName: string }>;
    onSelect: (name: string) => void;
  }) => (
    <div>
      {subreddits.map((subreddit) => (
        <button key={subreddit.name} onClick={() => onSelect(subreddit.name)}>
          {subreddit.displayName}
        </button>
      ))}
    </div>
  ),
}));

vi.mock('./DropdownMenu', () => ({
  DropdownMenu: () => <div data-testid="dropdown-menu" />,
}));

vi.mock('./ImageModal', () => ({
  ImageModal: () => null,
}));

vi.mock('./FAQSection', () => ({
  FAQSection: () => null,
}));

vi.mock('./GalleryGrid', () => ({
  GalleryGrid: ({
    posts,
    error,
    isLoading,
  }: {
    posts: Array<{ id: string; title: string }>;
    error: string | null;
    isLoading: boolean;
  }) => {
    if (error) {
      return <div>Failed to Load! {error}</div>;
    }

    if (isLoading) {
      return <div>Loading images from Reddit...</div>;
    }

    if (posts.length === 0) {
      return <div>No images found. Try a different subreddit or time period.</div>;
    }

    return (
      <ul>
        {posts.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    );
  },
}));

describe('GalleryPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    mockUseSearchParams.mockReturnValue(new URLSearchParams());
    vi.mocked(loadPopularSubreddits).mockResolvedValue(null);
    vi.mocked(readCachedPopularSubreddits).mockReturnValue(null);
    vi.mocked(getSearchHistory).mockReturnValue([]);
    vi.mocked(filterImagePosts).mockImplementation((posts) => posts);
  });

  it('ignores stale feed responses from an earlier request', async () => {
    const photographyRequest = deferred<{ data: { children: Array<{ data: { id: string; title: string } }> } }>();
    const earthRequest = deferred<{ data: { children: Array<{ data: { id: string; title: string } }> } }>();

    vi.mocked(fetchRedditAPI).mockImplementation((url: string) => {
      if (url.includes('subreddit=photography')) {
        return photographyRequest.promise;
      }

      if (url.includes('subreddit=EarthPorn')) {
        return earthRequest.promise;
      }

      throw new Error(`Unexpected URL: ${url}`);
    });

    render(<GalleryPage />);

    await waitFor(() => {
      expect(fetchRedditAPI).toHaveBeenCalledWith(
        buildApiUrl('photography', 'day', 'new')
      );
    });

    fireEvent.click(screen.getByRole('button', { name: '🌍 Nature' }));

    await waitFor(() => {
      expect(fetchRedditAPI).toHaveBeenCalledWith(
        buildApiUrl('EarthPorn', 'day', 'new')
      );
    });

    await act(async () => {
      earthRequest.resolve({
        data: {
          children: [{ data: { id: 'earth-1', title: 'Earth image' } }],
        },
      });
    });

    await waitFor(() => {
      expect(screen.getByText('Earth image')).toBeInTheDocument();
    });

    await act(async () => {
      photographyRequest.resolve({
        data: {
          children: [{ data: { id: 'photo-1', title: 'Photography image' } }],
        },
      });
    });

    await waitFor(() => {
      expect(screen.getByText('Earth image')).toBeInTheDocument();
    });

    expect(screen.queryByText('Photography image')).not.toBeInTheDocument();
  });

  it('shows the neutral empty state when no image posts are found', async () => {
    vi.mocked(filterImagePosts).mockReturnValue([]);
    vi.mocked(fetchRedditAPI).mockResolvedValue({
      data: {
        children: [],
      },
    } as never);

    render(<GalleryPage />);

    await waitFor(() => {
      expect(
        screen.getByText('No images found. Try a different subreddit or time period.')
      ).toBeInTheDocument();
    });

    expect(screen.queryByText(/Failed to Load!/)).not.toBeInTheDocument();
  });
});
