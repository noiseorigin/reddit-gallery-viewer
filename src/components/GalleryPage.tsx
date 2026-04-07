'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

import { DropdownMenu } from './DropdownMenu';
import { FAQSection } from './FAQSection';
import { GalleryGrid } from './GalleryGrid';
import { ImageModal } from './ImageModal';
import { SubredditButtons } from './SubredditButtons';
import { FALLBACK_POPULAR_SUBREDDITS } from '@/lib/reddit-feed';
import {
  buildApiUrl,
  fetchRedditAPI,
  filterImagePosts,
  loadPopularSubreddits,
  parseSubredditName,
  type RedditPost,
  type RedditResponse,
} from '@/lib/reddit';
import { getMobileOptimizations, logMobileOptimizations } from '@/lib/mobile';
import {
  addToSearchHistory,
  getSearchHistory,
  readCachedPopularSubreddits,
  storePopularSubreddits,
} from '@/lib/storage';
import { GRID_SIZES } from './GridSizeButtons';
import { SORT_OPTIONS, type SortOption } from './SortFilterButtons';
import type { TimeFilter } from './TimeFilterButtons';

const TIME_FILTERS: TimeFilter[] = [
  { name: 'day', displayName: 'Today' },
  { name: 'week', displayName: 'This Week' },
  { name: 'month', displayName: 'This Month' },
];

const PRIMARY_COLOR = '#FF4500';

type SearchHistoryItem = {
  name: string;
  displayName: string;
};

type QuickView = {
  title: string;
  subtitle: string;
  subreddit: string;
  time: TimeFilter['name'];
  sort: SortOption['name'];
};

interface QuickViewButtonProps {
  isActive: boolean;
  onClick: () => void;
  view: QuickView;
}

const QUICK_VIEWS: QuickView[] = [
  {
    title: 'Nature picks',
    subtitle: 'EarthPorn · Top · This Month',
    subreddit: 'EarthPorn',
    time: 'month',
    sort: 'top',
  },
  {
    title: 'Fresh interiors',
    subtitle: 'InteriorDesign · New · This Week',
    subreddit: 'InteriorDesign',
    time: 'week',
    sort: 'new',
  },
  {
    title: 'Cats now',
    subtitle: 'CatsStandingUp · Hot · Today',
    subreddit: 'CatsStandingUp',
    time: 'day',
    sort: 'hot',
  },
  {
    title: 'Food highlights',
    subtitle: 'FoodPorn · Best · This Week',
    subreddit: 'FoodPorn',
    time: 'week',
    sort: 'best',
  },
];

function QuickViewButton({ isActive, onClick, view }: QuickViewButtonProps) {
  return (
    <button
      onClick={onClick}
      className="rounded-2xl border px-4 py-3 text-left transition-all hover:-translate-y-0.5"
      style={{
        backgroundColor: isActive ? PRIMARY_COLOR : '#fffaf5',
        borderColor: isActive ? PRIMARY_COLOR : '#fed7aa',
        color: isActive ? '#ffffff' : '#9a3412',
      }}
    >
      <span className="block text-sm font-semibold">{view.title}</span>
      <span
        className="mt-1 block text-xs"
        style={{ color: isActive ? 'rgba(255,255,255,0.82)' : '#7c2d12' }}
      >
        {view.subtitle}
      </span>
    </button>
  );
}

export function GalleryPage() {
  const searchParams = useSearchParams();

  const [subreddits, setSubreddits] = useState(FALLBACK_POPULAR_SUBREDDITS);
  const [currentSubreddit, setCurrentSubreddit] = useState('photography');
  const [currentTimeFilter, setCurrentTimeFilter] = useState(TIME_FILTERS[0]);
  const [currentSort, setCurrentSort] = useState(SORT_OPTIONS[2]);
  const [currentGridSize, setCurrentGridSize] = useState(GRID_SIZES[1]);
  const [posts, setPosts] = useState<RedditPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalIndex, setModalIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [shareMessage, setShareMessage] = useState('');
  const requestIdRef = useRef(0);

  useEffect(() => {
    const requestedSubreddit = parseSubredditName(searchParams.get('sub') ?? '');

    if (typeof window !== 'undefined') {
      logMobileOptimizations();
      const optimizations = getMobileOptimizations();
      console.log(`[APP] Running on ${optimizations.isMobileDevice ? 'mobile' : 'desktop'} device`);
    }

    const loadPopular = async () => {
      const cached = readCachedPopularSubreddits();
      if (cached) {
        setSubreddits(cached);
        if (!requestedSubreddit) {
          setCurrentSubreddit(cached[0].name);
        }
      }

      const popular = await loadPopularSubreddits();
      if (popular) {
        setSubreddits(popular);
        if (!requestedSubreddit && !cached) {
          setCurrentSubreddit(popular[0].name);
        }
        storePopularSubreddits(popular);
      }
    };

    loadPopular();
  }, [searchParams]);

  useEffect(() => {
    const sub = searchParams.get('sub');
    const time = searchParams.get('time');
    const sort = searchParams.get('sort');

    if (sub) {
      const parsed = parseSubredditName(sub);
      if (parsed) {
        setCurrentSubreddit(parsed);
      }
    }

    if (time) {
      const filter = TIME_FILTERS.find((item) => item.name === time);
      if (filter) {
        setCurrentTimeFilter(filter);
      }
    }

    if (sort) {
      const nextSort = SORT_OPTIONS.find((item) => item.name === sort);
      if (nextSort) {
        setCurrentSort(nextSort);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    setSearchHistory(getSearchHistory());
  }, []);

  useEffect(() => {
    const matched = subreddits.find((item) => item.name === currentSubreddit);
    const displayLabel = matched?.displayName || `/r/${currentSubreddit}`;
    const title = `r/${currentSubreddit} Gallery - ${currentSort.displayName} Images | Reddit Gallery Viewer`;
    const description = `Browse ${displayLabel} as a clean gallery. View ${currentSort.displayName.toLowerCase()} images from ${currentTimeFilter.displayName.toLowerCase()} without the clutter of a standard Reddit feed.`;

    document.title = title;

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
      return;
    }

    const nextMeta = document.createElement('meta');
    nextMeta.name = 'description';
    nextMeta.content = description;
    document.head.appendChild(nextMeta);
  }, [currentSubreddit, currentSort, currentTimeFilter, subreddits]);

  const fetchImages = useCallback(async () => {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    setIsLoading(true);
    setError(null);

    try {
      const url = buildApiUrl(currentSubreddit, currentTimeFilter.name, currentSort.name);
      const data: RedditResponse = await fetchRedditAPI(url);

      if (requestId !== requestIdRef.current) {
        return;
      }

      const filteredPosts = filterImagePosts(
        data.data.children.map((child) => child.data),
        40
      );

      setPosts(filteredPosts);

      const matched = subreddits.find((item) => item.name === currentSubreddit);
      const displayLabel = matched?.displayName || `/r/${currentSubreddit}`;
      addToSearchHistory({ name: currentSubreddit, displayName: displayLabel });
      setSearchHistory(getSearchHistory());

      const nextUrl = new URL(window.location.href);
      nextUrl.searchParams.set('sub', currentSubreddit);
      nextUrl.searchParams.set('time', currentTimeFilter.name);
      nextUrl.searchParams.set('sort', currentSort.name);
      window.history.replaceState(null, '', nextUrl.toString());
    } catch {
      if (requestId !== requestIdRef.current) {
        return;
      }

      setError('Failed to load images. Please try again later.');
      setPosts([]);
    } finally {
      if (requestId === requestIdRef.current) {
        setIsLoading(false);
      }
    }
  }, [currentSubreddit, currentTimeFilter, currentSort, subreddits]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleCustomSubreddit = (input: string) => {
    const parsed = parseSubredditName(input);
    if (parsed) {
      setCurrentSubreddit(parsed);
      return;
    }

    alert('Invalid subreddit name or link format.');
  };

  const submitInputValue = (input: HTMLInputElement | null) => {
    const value = input?.value?.trim() ?? '';
    if (!value) {
      return;
    }

    handleCustomSubreddit(value);
    if (input) {
      input.value = '';
    }
  };

  const handleClearHistory = () => {
    localStorage.removeItem('searchHistory');
    setSearchHistory([]);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setShareMessage('Link copied to clipboard.');
      window.setTimeout(() => setShareMessage(''), 2000);
    });
  };

  const handleQuickView = (view: QuickView) => {
    setCurrentSubreddit(view.subreddit);

    const nextTimeFilter = TIME_FILTERS.find((item) => item.name === view.time);
    if (nextTimeFilter) {
      setCurrentTimeFilter(nextTimeFilter);
    }

    const nextSort = SORT_OPTIONS.find((item) => item.name === view.sort);
    if (nextSort) {
      setCurrentSort(nextSort);
    }
  };

  const matchedSubreddit = subreddits.find((item) => item.name === currentSubreddit);
  const displayLabel = matchedSubreddit?.displayName || `/r/${currentSubreddit}`;
  const showFallbackPanel = Boolean(error) || (!isLoading && posts.length === 0);
  const fallbackTitle = error ? 'Reddit is slow right now' : 'No safe image posts found yet';
  const fallbackDescription = error
    ? 'The gallery can temporarily hit Reddit rate limits. Try a preset below or switch to a broader time range.'
    : 'Some communities are text-heavy or quiet at the moment. Try one of these visual-first presets to keep exploring.';
  const fallbackViews = QUICK_VIEWS.filter((view) => view.subreddit !== currentSubreddit).slice(0, 3);

  return (
    <div
      className="min-h-screen text-gray-800"
      style={{
        backgroundColor: '#fcfaf7',
        backgroundImage:
          'radial-gradient(circle at top left, rgba(255, 132, 76, 0.12), transparent 28%), linear-gradient(180deg, #fcfaf7 0%, #ffffff 24%, #fff7ef 100%)',
      }}
    >
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:py-10 lg:px-8">
        <header className="space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="h-14 w-14 shrink-0 rounded-2xl border border-orange-200 bg-white p-2 shadow-sm">
                <img
                  src="/rgv_logo.png"
                  alt="Reddit Gallery Viewer logo"
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
                  Search a subreddit and view it as a gallery.
                </h1>
                <p className="max-w-3xl text-base leading-relaxed text-gray-700">
                  Browse public image posts in a cleaner layout and open Reddit only when you want the full thread.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-orange-100 bg-white/90 px-4 py-3 text-sm leading-relaxed text-gray-700">
              No login required. Public communities only.
            </div>
          </div>

          <div className="grid gap-4 rounded-[28px] border border-orange-100 bg-white/92 p-4 shadow-[0_12px_40px_rgba(163,73,20,0.08)] lg:grid-cols-[minmax(0,1.3fr)_auto] lg:items-end md:p-6">
            <div className="space-y-3">
              <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                Search
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="photography, r/Art, reddit URL..."
                  className="min-w-0 flex-1 rounded-2xl border border-orange-200 bg-[#fffaf5] px-4 py-3 text-sm text-gray-800 outline-none transition-shadow focus:ring-2 focus:ring-orange-200"
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      submitInputValue(event.currentTarget);
                    }
                  }}
                />
                <button
                  onClick={(event) => {
                    submitInputValue(
                      event.currentTarget.previousElementSibling as HTMLInputElement | null
                    );
                  }}
                  className="rounded-2xl px-4 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
                  style={{ backgroundColor: PRIMARY_COLOR }}
                >
                  Go
                </button>
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-3 lg:min-w-[340px] lg:grid-cols-3">
              <DropdownMenu
                icon=""
                label={`Time: ${currentTimeFilter.displayName}`}
                items={TIME_FILTERS}
                currentItem={currentTimeFilter}
                onSelect={setCurrentTimeFilter}
                primaryColor={PRIMARY_COLOR}
              />
              <DropdownMenu
                icon=""
                label={`Sort: ${currentSort.displayName}`}
                items={SORT_OPTIONS}
                currentItem={currentSort}
                onSelect={setCurrentSort}
                primaryColor={PRIMARY_COLOR}
              />
              <DropdownMenu
                icon=""
                label={`Size: ${currentGridSize.displayName}`}
                items={GRID_SIZES}
                currentItem={currentGridSize}
                onSelect={setCurrentGridSize}
                primaryColor={PRIMARY_COLOR}
              />
            </div>

            <div className="border-t border-orange-100 pt-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                  Quick views
                </p>
                <p className="text-sm text-gray-600">
                  Useful starting points for inspiration browsing.
                </p>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {QUICK_VIEWS.map((view) => {
                  const isActive =
                    currentSubreddit === view.subreddit &&
                    currentTimeFilter.name === view.time &&
                    currentSort.name === view.sort;

                  return (
                    <QuickViewButton
                      key={`${view.subreddit}-${view.time}-${view.sort}`}
                      isActive={isActive}
                      onClick={() => handleQuickView(view)}
                      view={view}
                    />
                  );
                })}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  'Design inspiration',
                  'Photography references',
                  'Moodboard browsing',
                  'Shareable filtered URLs',
                ].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-orange-100 bg-white px-3 py-1.5 text-xs font-medium text-gray-700"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </header>

        <section className="mt-8 rounded-[28px] border border-orange-100 bg-white/90 p-4 shadow-[0_12px_40px_rgba(163,73,20,0.08)] md:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                Popular communities
              </p>
              <div className="mt-3">
                <SubredditButtons
                  subreddits={subreddits}
                  currentSubreddit={currentSubreddit}
                  onSelect={setCurrentSubreddit}
                  primaryColor={PRIMARY_COLOR}
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleShare}
                className="rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white"
                style={{ backgroundColor: PRIMARY_COLOR }}
              >
                Share view
              </button>
              {shareMessage ? (
                <p className="text-sm font-medium text-green-700">{shareMessage}</p>
              ) : null}
            </div>
          </div>

          {searchHistory.length > 0 ? (
            <div className="mt-6">
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                  Recent searches
                </p>
                <button
                  onClick={handleClearHistory}
                  className="text-sm font-medium text-gray-500 underline underline-offset-4 hover:text-red-600"
                >
                  Clear history
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {searchHistory.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => setCurrentSubreddit(item.name)}
                    className="rounded-full border border-gray-200 bg-[#f8f6f2] px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:border-orange-200 hover:text-orange-700"
                  >
                    {item.displayName}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </section>

        <section className="mt-8 space-y-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">
                Live gallery
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900">
                {displayLabel}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-700">
                {currentSort.displayName} posts from {currentTimeFilter.displayName}.
              </p>
            </div>
            <div className="max-w-md rounded-2xl border border-orange-100 bg-white/80 px-4 py-3 text-sm leading-relaxed text-gray-700">
              {error
                ? 'Reddit may be rate-limiting requests right now. Try again shortly.'
                : 'Click an image to open it in the full viewer.'}
            </div>
          </div>

          <div className="rounded-[28px] border border-orange-100 bg-white/92 p-4 shadow-[0_18px_50px_rgba(163,73,20,0.08)] md:p-6">
            <GalleryGrid
              posts={posts}
              onImageClick={(index) => {
                setModalIndex(index);
                setIsModalOpen(true);
              }}
              onImageError={() => {}}
              onImageLoad={() => {}}
              isLoading={isLoading}
              error={error}
              gridCols={currentGridSize.cols}
            />
          </div>

          {showFallbackPanel ? (
            <div className="rounded-[24px] border border-orange-100 bg-[#fff8f1] p-5 shadow-[0_12px_32px_rgba(163,73,20,0.06)]">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-2xl">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">
                    Keep browsing
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-gray-900">{fallbackTitle}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-700">
                    {fallbackDescription}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-4 text-sm">
                    <Link
                      href="/about"
                      className="font-medium text-orange-700 underline underline-offset-4"
                    >
                      How this viewer works
                    </Link>
                    <Link
                      href="/contact"
                      className="font-medium text-orange-700 underline underline-offset-4"
                    >
                      Report a loading issue
                    </Link>
                  </div>
                </div>

                <div className="lg:max-w-lg">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                    Suggested presets
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {fallbackViews.map((view) => {
                      const isActive =
                        currentSubreddit === view.subreddit &&
                        currentTimeFilter.name === view.time &&
                        currentSort.name === view.sort;

                      return (
                        <QuickViewButton
                          key={`fallback-${view.subreddit}-${view.time}-${view.sort}`}
                          isActive={isActive}
                          onClick={() => handleQuickView(view)}
                          view={view}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </section>

        <section className="mt-10 grid gap-8 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
          <aside className="rounded-[28px] border border-orange-100 bg-white/92 p-6 shadow-[0_16px_50px_rgba(163,73,20,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">
              Why this tool helps
            </p>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-gray-700">
              <p>This tool makes image-heavy communities easier to scan, compare, and revisit.</p>
              <ul className="space-y-2">
                <li>Start from quick presets or popular communities instead of a blank search.</li>
                <li>Keep a cleaner gallery view, then open Reddit only for full thread context.</li>
                <li>Recent searches stay in your browser, not in a user account.</li>
              </ul>
              <div className="rounded-2xl border border-orange-100 bg-[#fff8f1] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                  Common uses
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {[
                    'Creative inspiration',
                    'Interior ideas',
                    'Food discovery',
                    'Casual image browsing',
                  ].map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-orange-100 bg-white px-3 py-1.5 text-xs font-medium text-gray-700"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-orange-100 bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                  Content standards
                </p>
                <p className="mt-3">
                  The viewer is built for public, image-first communities. It filters restricted
                  community lists, excludes NSFW image posts from the gallery, and links every
                  browse session back to the original Reddit thread for context.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link href="/about" className="font-medium text-orange-700 underline underline-offset-4">
                  About
                </Link>
                <Link href="/privacy" className="font-medium text-orange-700 underline underline-offset-4">
                  Privacy Policy
                </Link>
                <Link href="/contact" className="font-medium text-orange-700 underline underline-offset-4">
                  Contact
                </Link>
              </div>
            </div>
          </aside>

          <FAQSection primaryColor={PRIMARY_COLOR} />
        </section>
      </main>

      <ImageModal
        isOpen={isModalOpen}
        currentIndex={modalIndex}
        posts={posts}
        onClose={() => setIsModalOpen(false)}
        onNext={() => setModalIndex((index) => Math.min(index + 1, posts.length - 1))}
        onPrevious={() => setModalIndex((index) => Math.max(index - 1, 0))}
        primaryColor={PRIMARY_COLOR}
      />
    </div>
  );
}
