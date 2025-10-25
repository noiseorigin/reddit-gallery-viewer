'use client';

import { RedditPost } from '@/lib/reddit';
import { GalleryImage } from './GalleryImage';

interface GalleryGridProps {
  posts: RedditPost[];
  onImageClick: (index: number) => void;
  onImageError: (index: number) => void;
  onImageLoad: (index: number) => void;
  isLoading: boolean;
  error: string | null;
}

export function GalleryGrid({
  posts,
  onImageClick,
  onImageError,
  onImageLoad,
  isLoading,
  error,
}: GalleryGridProps) {
  if (error) {
    return (
      <div className="text-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
        <strong className="font-bold">Failed to Load!</strong>
        <span className="block sm:inline ml-2">{error}</span>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="flex justify-center items-center">
          <svg
            className="animate-spin -ml-1 mr-3 h-8 w-8 text-reddit-orange"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <p className="text-xl text-reddit-orange">
            Loading images from Reddit...
          </p>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12 text-gray-600">
        <p>No images found. Try a different subreddit or time period.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {posts.map((post, index) => (
        <GalleryImage
          key={post.id}
          post={post}
          index={index}
          onImageError={onImageError}
          onImageLoad={onImageLoad}
          onClick={() => onImageClick(index)}
        />
      ))}
    </div>
  );
}
