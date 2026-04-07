'use client';

import { useMemo } from 'react';
import { RedditPost } from '@/lib/reddit';
import { buildStableImageSources } from '@/lib/image-sources';
import { getOptimalPreloadCount } from '@/lib/mobile';
import { useStableImage } from '@/lib/use-stable-image';
import { DownloadButton } from './DownloadButton';

interface GalleryImageProps {
  post: RedditPost;
  index: number;
  onImageError: (index: number) => void;
  onImageLoad: (index: number) => void;
  onClick: () => void;
}

const EAGER_IMAGE_COUNT = typeof window !== 'undefined' ? getOptimalPreloadCount() : 6;

export function GalleryImage({
  post,
  index,
  onImageError,
  onImageLoad,
  onClick,
}: GalleryImageProps) {
  const sources = useMemo(() => buildStableImageSources(post), [post]);
  const { src, isLoading, hasError, handleLoad, handleError } = useStableImage({
    sources,
    preloadFull: index < EAGER_IMAGE_COUNT,
    onLoadSuccess: () => onImageLoad(index),
    onTerminalError: () => onImageError(index),
  });

  return (
    <div
      className="group overflow-hidden rounded-2xl bg-white shadow-md transition-transform duration-300 hover:scale-[1.01] cursor-pointer"
      onClick={onClick}
    >
      <div className="relative aspect-square bg-gray-100">
        {isLoading && (
          <div className="absolute inset-0 bg-gradient-to-r from-red-200 via-red-400 to-red-200 bg-[length:200%_100%] animate-shimmer" />
        )}

        <img
          alt={post.title}
          src={src}
          className={`w-full h-full object-cover ${
            isLoading ? 'blur-sm opacity-60' : 'blur-0 opacity-100'
          } transition-all duration-300`}
          loading={index < EAGER_IMAGE_COUNT ? 'eager' : 'lazy'}
          onLoad={handleLoad}
          onError={handleError}
        />

        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-600 text-sm text-center p-4">
            Failed to load image
          </div>
        )}
      </div>

      <div className="space-y-3 border-t border-orange-100 bg-white p-4">
        <p className="line-clamp-2 text-sm font-medium leading-relaxed text-gray-800">{post.title}</p>
        <DownloadButton
          downloadUrl={sources.fullProxyUrl || src}
          originalUrl={sources.directFallbackUrl || post.url}
          title={post.title}
        />
      </div>
    </div>
  );
}
