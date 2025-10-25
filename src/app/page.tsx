import type { Metadata } from 'next';
import { Suspense } from 'react';
import { GalleryPage } from '@/components/GalleryPage';

// Generate metadata
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Reddit Gallery Viewer - Browse Any Subreddit as Image Gallery | Free',
    description:
      'Turn any Reddit subreddit into a beautiful image gallery instantly. Browse photography, nature, art, memes and more with dynamic color themes. Fast, free, no sign-up needed.',
    openGraph: {
      title: 'Reddit Gallery Viewer - Free Image Gallery Tool',
      description:
        'Transform any subreddit into a stunning image gallery. Perfect for photography, art, nature, and memes. No sign-up required!',
      type: 'website',
      url: 'https://reddit-gallery-viewer.vercel.app/',
      siteName: 'Reddit Gallery Viewer',
      locale: 'en_US',
      images: [
        {
          url: 'https://reddit-gallery-viewer.vercel.app/rgv_logo.png',
          width: 1200,
          height: 630,
          alt: 'Reddit Gallery Viewer - Browse Reddit Subreddits as Image Galleries',
          type: 'image/png',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Reddit Gallery Viewer - Free Online Image Gallery',
      description:
        'Browse any Reddit subreddit as a beautiful image gallery. Photography, art, nature, memes and more!',
      images: [
        'https://reddit-gallery-viewer.vercel.app/rgv_logo.png',
      ],
      creator: '@RedditGallery',
    },
  };
}

function GalleryPageWrapper() {
  return <GalleryPage />;
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading gallery...</p>
          </div>
        </div>
      }
    >
      <GalleryPageWrapper />
    </Suspense>
  );
}
