// Simple in-memory cache for API responses with mobile-aware duration
import { getCacheDuration, isMobile } from './mobile';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  cacheDuration: number;
}

class APICache {
  private cache: Map<string, CacheEntry<any>> = new Map();

  set<T>(key: string, data: T): void {
    const cacheDuration = getCacheDuration();
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      cacheDuration,
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > entry.cacheDuration) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  clear(): void {
    this.cache.clear();
  }

  getStats(): { size: number; entries: string[] } {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys()),
    };
  }
}

export const apiCache = new APICache();

// Log cache stats on mobile
if (typeof window !== 'undefined' && isMobile()) {
  console.log('[CACHE] Mobile-aware caching enabled');
}
