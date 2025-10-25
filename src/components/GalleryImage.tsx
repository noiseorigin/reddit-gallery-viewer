'use client';

import { useState, useEffect, useRef } from 'react';
import { getPostImageSources, RedditPost, sanitizeRedditImageUrl } from '@/lib/reddit';

interface GalleryImageProps {
  post: RedditPost;
  index: number;
  onImageError: (index: number) => void;
  onImageLoad: (index: number) => void;
  onClick: () => void;
}

const EAGER_IMAGE_COUNT = 6;

export function GalleryImage({
  post,
  index,
  onImageError,
  onImageLoad,
  onClick,
}: GalleryImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const sources = getPostImageSources(post);

    // Load placeholder first
    img.src = sources.placeholder;

    // If we have a full resolution image and it's different from placeholder, upgrade
    if (sources.full !== sources.placeholder && index < EAGER_IMAGE_COUNT) {
      const highRes = new Image();
      highRes.src = sources.full;

      const timeoutMs = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ? 15000 : 10000;
      const timeoutId = setTimeout(() => {
        if (highRes.complete === false) {
          img.src = sources.full;
          setIsLoading(false);
          onImageLoad(index);
        }
      }, timeoutMs);

      highRes.onload = () => {
        clearTimeout(timeoutId);
        img.src = sources.full;
        setIsLoading(false);
        onImageLoad(index);
      };

      highRes.onerror = () => {
        clearTimeout(timeoutId);
        setIsLoading(false);
        onImageLoad(index);
      };
    } else {
      setIsLoading(false);
    }
  }, [post, index, onImageLoad]);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
    onImageLoad(index);
  };

  const handleError = () => {
    setHasError(true);
    onImageError(index);
  };

  return (
    <div
      className="relative bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300 group cursor-pointer"
      onClick={onClick}
    >
      <div className="relative aspect-square bg-gray-100">
        {isLoading && (
          <div className="absolute inset-0 bg-gradient-to-r from-red-200 via-red-400 to-red-200 bg-[length:200%_100%] animate-shimmer" />
        )}

        <img
          ref={imgRef}
          alt={post.title}
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

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-60 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-2">
        {post.title}
      </div>
    </div>
  );
}
