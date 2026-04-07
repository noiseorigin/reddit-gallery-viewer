'use client';

import Link from 'next/link';

import { buildGalleryHref } from '@/lib/gallery-routes';

interface SubredditButtonsProps {
  subreddits: Array<{ name: string; displayName: string }>;
  currentSubreddit: string;
  onSelect: (name: string) => void;
  primaryColor: string;
}

export function SubredditButtons({
  subreddits,
  currentSubreddit,
  onSelect,
  primaryColor,
}: SubredditButtonsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {subreddits.map((sub) => (
        <Link
          key={sub.name}
          href={buildGalleryHref(sub.name)}
          onClick={() => onSelect(sub.name)}
          className={`px-3 py-1 text-sm rounded font-medium transition-colors duration-200 ${
            currentSubreddit === sub.name
              ? 'shadow-md text-white'
              : 'bg-white shadow-sm'
          }`}
          style={{
            backgroundColor: currentSubreddit === sub.name ? primaryColor : 'white',
            color: currentSubreddit === sub.name ? 'white' : primaryColor,
            borderColor: currentSubreddit === sub.name ? primaryColor : '#ff6d00',
            borderWidth: '1px',
          }}
        >
          {sub.displayName}
        </Link>
      ))}
    </div>
  );
}
