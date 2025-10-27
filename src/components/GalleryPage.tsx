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
import { GridSizeButtons, GridSize, GRID_SIZES } from "./GridSizeButtons";
import { DropdownMenu } from "./DropdownMenu";
import { ImageModal } from "./ImageModal";
import { FAQSection } from "./FAQSection";
import { getMobileOptimizations, logMobileOptimizations } from "@/lib/mobile";

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
  const [currentGridSize, setCurrentGridSize] = useState(GRID_SIZES[1]); // Default to "Medium"
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
    // Log mobile optimizations on first load
    if (typeof window !== 'undefined') {
      logMobileOptimizations();
      const optimizations = getMobileOptimizations();
      console.log(`[APP] Running on ${optimizations.isMobileDevice ? 'mobile' : 'desktop'} device`);
    }

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

  // Update document title dynamically based on current subreddit
  useEffect(() => {
    const matched = subreddits.find((s) => s.name === currentSubreddit);
    const displayLabel = matched?.displayName || `/r/${currentSubreddit}`;

    // Update page title for SEO
    const title = `r/${currentSubreddit} Gallery - ${currentSort.displayName} Images | Reddit Gallery Viewer`;
    const description = `Browse ${displayLabel} subreddit as a beautiful image gallery. View ${currentSort.displayName.toLowerCase()} images from the last ${currentTimeFilter.displayName.toLowerCase()}. Free, no sign-up needed.`;

    document.title = title;

    // Update meta description dynamically
    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    } else {
      const newMeta = document.createElement('meta') as HTMLMetaElement;
      newMeta.name = 'description';
      newMeta.content = description;
      document.head.appendChild(newMeta);
    }
  }, [currentSubreddit, currentSort, currentTimeFilter, subreddits]);

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

  const handleClearHistory = () => {
    localStorage.removeItem("searchHistory");
    setSearchHistory([]);
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
        {/* Header with Search & Dropdowns */}
        <header className="mb-6">
          <div className="flex items-start justify-between gap-3 mb-6">
            <div className="flex items-center gap-4">
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

            {/* Right Controls - Search + Dropdowns */}
            <div className="flex flex-col gap-3 flex-shrink-0">
              {/* Search Input */}
              <div className="w-64">
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">
                  🔍 Search
                </label>
                <div className="flex gap-1">
                  <input
                    type="text"
                    placeholder="photography..."
                    className="flex-1 px-3 py-2 border-2 rounded-lg focus:outline-none text-sm text-gray-800"
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
                    className="px-4 text-white font-semibold rounded-lg transition-colors text-sm"
                    style={{ backgroundColor: PRIMARY_COLOR }}
                  >
                    Go
                  </button>
                </div>
              </div>

              {/* Dropdowns */}
              <div className="flex gap-2">
                <DropdownMenu
                  icon="📅"
                  label="Time"
                  items={TIME_FILTERS}
                  currentItem={currentTimeFilter}
                  onSelect={setCurrentTimeFilter}
                  primaryColor={PRIMARY_COLOR}
                />
                <DropdownMenu
                  icon="✨"
                  label="Sort"
                  items={SORT_OPTIONS}
                  currentItem={currentSort}
                  onSelect={setCurrentSort}
                  primaryColor={PRIMARY_COLOR}
                />
                <DropdownMenu
                  icon="📐"
                  label="Size"
                  items={GRID_SIZES}
                  currentItem={currentGridSize}
                  onSelect={setCurrentGridSize}
                  primaryColor={PRIMARY_COLOR}
                />
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            View top images from any Reddit subreddit with beautiful galleries
            and dynamic color themes.
          </p>
        </header>

        {/* Filters Section */}
        <div className="mb-6 bg-gray-50 p-4 rounded-lg">
          {/* Popular Subreddits */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs font-semibold text-gray-500 uppercase">
                Popular Subreddits
              </p>
              <button
                onClick={handleShare}
                className="px-2 py-1 rounded text-xs font-semibold transition-colors text-white"
                style={{ backgroundColor: PRIMARY_COLOR }}
                title="Share current gallery"
              >
                🔗
              </button>
            </div>
            <SubredditButtons
              subreddits={subreddits}
              currentSubreddit={currentSubreddit}
              onSelect={handleSubredditSelect}
              primaryColor={PRIMARY_COLOR}
            />
            {shareMessage && (
              <p className="text-xs text-green-600 font-semibold mt-2">
                {shareMessage}
              </p>
            )}
          </div>

          {/* Recently Viewed */}
          {searchHistory.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs font-semibold text-gray-500 uppercase">
                  Recently Viewed
                </p>
                <button
                  onClick={handleClearHistory}
                  className="text-xs font-medium text-gray-500 hover:text-red-600 transition-colors"
                >
                  Clear
                </button>
              </div>
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
          gridCols={currentGridSize.cols}
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
