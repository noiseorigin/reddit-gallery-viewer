'use client';

import { Suspense } from 'react';
import { GalleryPage } from '@/components/GalleryPage';
import type { SubredditPageConfig } from '@/lib/subreddit-pages';

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">Loading gallery...</p>
      </div>
    </div>
  );
}

interface PageWrapperProps {
  initialSubreddit?: string | null;
  landingPage?: {
    page: SubredditPageConfig;
    relatedPages: SubredditPageConfig[];
  };
}

export function PageWrapper({ initialSubreddit, landingPage }: PageWrapperProps) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <GalleryPage initialSubreddit={initialSubreddit} landingPage={landingPage} />
    </Suspense>
  );
}
