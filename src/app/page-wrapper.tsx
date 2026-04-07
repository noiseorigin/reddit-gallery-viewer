'use client';

import { Suspense } from 'react';
import { GalleryPage } from '@/components/GalleryPage';

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
}

export function PageWrapper({ initialSubreddit }: PageWrapperProps) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <GalleryPage initialSubreddit={initialSubreddit} />
    </Suspense>
  );
}
