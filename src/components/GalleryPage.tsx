"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import {
  buildApiUrl,
  fetchRedditAPI,
  filterImagePosts,
  loadPopularSubreddits,
  parseSubredditName,
  RedditPost,
  RedditResponse,
} from "@/lib/reddit";
import {
  addToSearchHistory,
  getSearchHistory,
  readCachedPopularSubreddits,
  storePopularSubreddits,
} from "@/lib/storage";
import {
  getOptimalBackgroundColor,
  lightenColor,
  darkenColor,
  getColorBrightness,
  getTextColorForBackground,
} from "@/lib/colors";
import { GalleryGrid } from "./GalleryGrid";
import { SubredditButtons } from "./SubredditButtons";
import { TimeFilterButtons, TimeFilter } from "./TimeFilterButtons";
import { SortFilterButtons, SortOption, SORT_OPTIONS } from "./SortFilterButtons";
import { ImageModal } from "./ImageModal";
import { FAQSection } from "./FAQSection";

const DEFAULT_SUBREDDITS = [
  { name: "photography", displayName: "📸 Photography" },
  { name: "EarthPorn", displayName: "🌍 Nature" },
  { name: "CatsStandingUp", displayName: "🐱 Cats" },
  { name: "InteriorDesign", displayName: "🏠 Interior Design" },
  { name: "Art", displayName: "🎨 Art" },
  { name: "FoodPorn", displayName: "🍕 Food" },
  { name: "houseplants", displayName: "🌱 Houseplants" },
];

const TIME_FILTERS: TimeFilter[] = [
  { name: "day", displayName: "📆 Today" },
  { name: "week", displayName: "📅 This Week" },
  { name: "month", displayName: "📊 This Month" },
];

const PRIMARY_COLOR = "#FF4500";

export function GalleryPage() {
  const searchParams = useSearchParams();

  const [subreddits, setSubreddits] = useState(DEFAULT_SUBREDDITS);
  const [currentSubreddit, setCurrentSubreddit] = useState("photography");
  const [currentTimeFilter, setCurrentTimeFilter] = useState(TIME_FILTERS[0]);
  const [currentSort, setCurrentSort] = useState(SORT_OPTIONS[2]); // Default to "Top"
  const [posts, setPosts] = useState<RedditPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalIndex, setModalIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState<
    Array<{ name: string; displayName: string }>
  >([]);
  const [shareMessage, setShareMessage] = useState("");

  // Load popular subreddits on mount
  useEffect(() => {
    const loadPopular = async () => {
      const cached = readCachedPopularSubreddits();
      if (cached) {
        setSubreddits(cached);
        setCurrentSubreddit(cached[0].name);
        return;
      }

      const popular = await loadPopularSubreddits();
      if (popular) {
        setSubreddits(popular);
        setCurrentSubreddit(popular[0].name);
        storePopularSubreddits(popular);
      }
    };

    loadPopular();
  }, []);

  // Load URL parameters
  useEffect(() => {
    const sub = searchParams.get("sub");
    const time = searchParams.get("time");
    const sort = searchParams.get("sort");

    if (sub) {
      const parsed = parseSubredditName(sub);
      if (parsed) setCurrentSubreddit(parsed);
    }

    if (time) {
      const filter = TIME_FILTERS.find((f) => f.name === time);
      if (filter) setCurrentTimeFilter(filter);
    }

    if (sort) {
      const sortOption = SORT_OPTIONS.find((s) => s.name === sort);
      if (sortOption) setCurrentSort(sortOption);
    }
  }, [searchParams]);

  // Load search history
  useEffect(() => {
    setSearchHistory(getSearchHistory());
  }, []);

  // Fetch images
  const fetchImages = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const url = buildApiUrl(currentSubreddit, currentTimeFilter.name, currentSort.name);
      const data: RedditResponse = await fetchRedditAPI(url);

      const filteredPosts = filterImagePosts(
        data.data.children.map((child) => child.data),
        40
      );

      if (filteredPosts.length === 0) {
        setError(
          `No image posts found in /r/${currentSubreddit} (${currentSort.displayName}).`
        );
        setPosts([]);
      } else {
        setPosts(filteredPosts);
      }

      // Update search history
      const matched = subreddits.find((s) => s.name === currentSubreddit);
      const displayLabel = matched?.displayName || `/r/${currentSubreddit}`;
      addToSearchHistory({ name: currentSubreddit, displayName: displayLabel });
      setSearchHistory(getSearchHistory());

      // Update URL
      const url_obj = new URL(window.location.href);
      url_obj.searchParams.set("sub", currentSubreddit);
      url_obj.searchParams.set("time", currentTimeFilter.name);
      url_obj.searchParams.set("sort", currentSort.name);
      window.history.replaceState(null, "", url_obj.toString());
    } catch (err) {
      setError("Failed to load images. Please try again later.");
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentSubreddit, currentTimeFilter, currentSort, subreddits]);

  // Fetch images when parameters change
  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleSubredditSelect = (name: string) => {
    if (name === currentSubreddit) return;
    setCurrentSubreddit(name);
  };

  const handleCustomSubreddit = (input: string) => {
    const parsed = parseSubredditName(input);
    if (parsed) {
      setCurrentSubreddit(parsed);
    } else {
      alert("Invalid subreddit name or link format.");
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setShareMessage("✓ Copied to clipboard!");
      setTimeout(() => setShareMessage(""), 2000);
    });
  };

  const matchedSubreddit = subreddits.find((s) => s.name === currentSubreddit);
  const displayLabel =
    matchedSubreddit?.displayName || `/r/${currentSubreddit}`;

  // Apply theme colors
  const light = lightenColor(PRIMARY_COLOR, 30);
  const lighter = lightenColor(PRIMARY_COLOR, 60);
  const bgLight = getOptimalBackgroundColor(PRIMARY_COLOR);

  return (
    <div className="min-h-screen bg-white">
      <style>{`
        :root {
          --color-primary: ${PRIMARY_COLOR};
          --color-primary-light: ${light};
          --color-primary-lighter: ${lighter};
          --color-primary-bg: ${bgLight};
        }
      `}</style>

      <div className="container mx-auto p-4 md:p-8">
        {/* Header */}
        <header className="mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-12 w-12 flex-shrink-0 rounded-lg overflow-hidden">
              <img
                src="/rgv_logo.png"
                alt="Reddit Gallery Viewer Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1
                className="text-4xl font-bold"
                style={{ color: PRIMARY_COLOR }}
              >
                Reddit Gallery Viewer
              </h1>
              <p className="text-lg mt-1" style={{ color: "#ff6d00" }}>
                Free Online Tool to Browse Subreddits as Image Galleries
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            View top images from any Reddit subreddit with beautiful galleries
            and dynamic color themes.
          </p>
        </header>

        {/* Search Input */}
        <div className="flex justify-center mb-8">
          <div className="w-full max-w-md">
            <label className="block text-sm text-gray-600 mb-2">
              🔍 Search for any Subreddit
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g., photography, MostBeautiful..."
                className="flex-1 px-4 py-2 border-2 rounded-lg focus:outline-none text-gray-800"
                style={{ borderColor: PRIMARY_COLOR }}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    const target = e.target as HTMLInputElement;
                    handleCustomSubreddit(target.value);
                    target.value = "";
                  }
                }}
              />
              <button
                onClick={(e) => {
                  const input = (
                    e.currentTarget.previousElementSibling as HTMLInputElement
                  )?.value;
                  if (input) {
                    handleCustomSubreddit(input);
                    (
                      e.currentTarget.previousElementSibling as HTMLInputElement
                    ).value = "";
                  }
                }}
                className="px-6 text-white font-semibold rounded-lg transition-colors"
                style={{ backgroundColor: PRIMARY_COLOR }}
              >
                Go
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              💡 Tip: Search by name, URL, or r/name format
            </p>
          </div>
        </div>

        {/* Filters Section */}
        <div className="mb-6 bg-gray-50 p-4 rounded-lg">
          {/* Popular Subreddits */}
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-500 mb-2 uppercase">
              Popular Subreddits
            </p>
            <SubredditButtons
              subreddits={subreddits}
              currentSubreddit={currentSubreddit}
              onSelect={handleSubredditSelect}
              primaryColor={PRIMARY_COLOR}
            />
          </div>

          {/* Recently Viewed */}
          {searchHistory.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-semibold text-gray-500 mb-2 uppercase">
                Recently Viewed
              </p>
              <div className="flex flex-wrap gap-2">
                {searchHistory.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => setCurrentSubreddit(item.name)}
                    className="px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 bg-gray-100 text-gray-600 hover:bg-gray-200"
                    style={{ color: PRIMARY_COLOR }}
                  >
                    {item.displayName}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Time Filter */}
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-500 mb-2 uppercase">
              📅 Time Period
            </p>
            <TimeFilterButtons
              filters={TIME_FILTERS}
              currentFilter={currentTimeFilter}
              onSelect={setCurrentTimeFilter}
              primaryColor={PRIMARY_COLOR}
            />
          </div>

          {/* Sort Filter */}
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-2 uppercase">
              ✨ Sort By
            </p>
            <SortFilterButtons
              options={SORT_OPTIONS}
              currentSort={currentSort}
              onSelect={setCurrentSort}
              primaryColor={PRIMARY_COLOR}
            />
          </div>
        </div>

        {/* Share Button */}
        <div className="flex justify-center mb-6">
          <button
            onClick={handleShare}
            className="px-4 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center gap-2 text-white"
            style={{ backgroundColor: PRIMARY_COLOR }}
          >
            <span>🔗 Share Gallery</span>
          </button>
          {shareMessage && (
            <span className="ml-3 text-green-600 text-sm font-semibold">
              {shareMessage}
            </span>
          )}
        </div>

        {/* Title Section */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold" style={{ color: PRIMARY_COLOR }}>
            {`Reddit ${matchedSubreddit?.name || currentSubreddit} Gallery`}
          </h2>
          <p className="text-gray-600 mt-2">
            {`${currentSort.displayName} images from ${displayLabel} (${currentTimeFilter.displayName})`}
          </p>
        </div>

        {/* Gallery Grid */}
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
        />

        {/* FAQ Section */}
        <FAQSection primaryColor={PRIMARY_COLOR} />
      </div>

      {/* Image Modal */}
      <ImageModal
        isOpen={isModalOpen}
        currentIndex={modalIndex}
        posts={posts}
        onClose={() => setIsModalOpen(false)}
        onNext={() => setModalIndex((i) => Math.min(i + 1, posts.length - 1))}
        onPrevious={() => setModalIndex((i) => Math.max(i - 1, 0))}
        primaryColor={PRIMARY_COLOR}
      />
    </div>
  );
}
