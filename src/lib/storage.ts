// Local storage utilities for search history

const SEARCH_HISTORY_KEY = 'reddit_gallery_history';
const MAX_HISTORY = 10;
const POPULAR_SUBREDDITS_KEY = 'reddit_gallery_popular_subreddits';
const POPULAR_SUBREDDITS_TTL = 1000 * 60 * 60 * 24; // 24 hours

export interface SearchHistoryItem {
  name: string;
  displayName: string;
}

export function getSearchHistory(): SearchHistoryItem[] {
  try {
    if (typeof window === 'undefined') return [];
    const history = localStorage.getItem(SEARCH_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (e) {
    return [];
  }
}

export function addToSearchHistory(subreddit: SearchHistoryItem): void {
  try {
    if (typeof window === 'undefined') return;
    let history = getSearchHistory();
    // Remove duplicates
    history = history.filter((item) => item.name !== subreddit.name);
    // Add to beginning
    history.unshift(subreddit);
    // Limit history
    history = history.slice(0, MAX_HISTORY);
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history));
  } catch (e) {
    console.warn('Unable to save search history:', e);
  }
}

export function readCachedPopularSubreddits(): SearchHistoryItem[] | null {
  try {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(POPULAR_SUBREDDITS_KEY);
    if (!raw) return null;
    const payload = JSON.parse(raw);
    if (!payload?.items?.length) return null;
    if (Date.now() - payload.timestamp > POPULAR_SUBREDDITS_TTL) {
      return null;
    }
    return payload.items;
  } catch (error) {
    console.warn('Failed to read cached popular subreddits:', error);
    return null;
  }
}

export function storePopularSubreddits(items: SearchHistoryItem[]): void {
  try {
    if (typeof window === 'undefined') return;
    localStorage.setItem(
      POPULAR_SUBREDDITS_KEY,
      JSON.stringify({ items, timestamp: Date.now() })
    );
  } catch (error) {
    console.warn('Unable to persist popular subreddits:', error);
  }
}
