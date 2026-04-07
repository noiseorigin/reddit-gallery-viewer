import type { Metadata } from 'next';

import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site';

import { PageWrapper } from './page-wrapper';

// Generate metadata
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `${SITE_NAME} - Browse Any Subreddit as Image Gallery | Free`,
    description: SITE_DESCRIPTION,
    alternates: {
      canonical: '/',
    },
    openGraph: {
      title: `${SITE_NAME} - Free Image Gallery Tool`,
      description: SITE_DESCRIPTION,
      type: 'website',
      url: SITE_URL,
      siteName: SITE_NAME,
      locale: 'en_US',
      images: [
        {
          url: `${SITE_URL}/rgv_logo.png`,
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} - Browse Reddit Subreddits as Image Galleries`,
          type: 'image/png',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${SITE_NAME} - Free Online Image Gallery`,
      description: SITE_DESCRIPTION,
      images: [`${SITE_URL}/rgv_logo.png`],
    },
  };
}

export default function Home() {
  return <PageWrapper />;
}
