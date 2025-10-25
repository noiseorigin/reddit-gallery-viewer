'use client';

import { useState, useEffect } from 'react';
import { RedditPost, sanitizeRedditImageUrl } from '@/lib/reddit';

interface ImageModalProps {
  isOpen: boolean;
  currentIndex: number;
  posts: RedditPost[];
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
  primaryColor: string;
}

export function ImageModal({
  isOpen,
  currentIndex,
  posts,
  onClose,
  onNext,
  onPrevious,
  primaryColor,
}: ImageModalProps) {
  const [imageKey, setImageKey] = useState(0);

  const currentPost = posts[currentIndex];
  const canPrevious = currentIndex > 0;
  const canNext = currentIndex < posts.length - 1;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft' && canPrevious) onPrevious();
      else if (e.key === 'ArrowRight' && canNext) onNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, canPrevious, canNext, onClose, onNext, onPrevious]);

  useEffect(() => {
    setImageKey((k) => k + 1);
  }, [currentIndex]);

  if (!isOpen || !currentPost) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 transition-opacity duration-300"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto transform transition-transform duration-300">
        <div className="p-4 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-800 text-4xl leading-none font-bold"
            aria-label="Close modal"
          >
            &times;
          </button>

          <h3 className="text-xl font-semibold text-gray-800 mb-4 pr-8 line-clamp-2">
            {currentPost.title}
          </h3>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={onPrevious}
              disabled={!canPrevious}
              className="text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-3xl leading-none font-bold p-2 hover:bg-gray-100 rounded transition-colors"
              style={{ color: primaryColor }}
              title="Previous image (Left arrow)"
            >
              &#10094;
            </button>

            <div className="flex justify-center bg-gray-100 rounded flex-1">
              <img
                key={imageKey}
                src={sanitizeRedditImageUrl(currentPost.url)}
                alt={currentPost.title}
                className="max-h-[70vh] w-auto mx-auto rounded"
              />
            </div>

            <button
              onClick={onNext}
              disabled={!canNext}
              className="text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-3xl leading-none font-bold p-2 hover:bg-gray-100 rounded transition-colors"
              style={{ color: primaryColor }}
              title="Next image (Right arrow)"
            >
              &#10095;
            </button>
          </div>

          <div className="mt-5 text-center">
            <a
              href={`https://www.reddit.com${currentPost.permalink}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-white font-bold py-2 px-6 rounded-lg transition-colors shadow hover:shadow-lg"
              style={{ backgroundColor: primaryColor }}
            >
              View on Reddit
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
