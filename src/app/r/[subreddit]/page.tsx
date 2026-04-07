import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { buildGalleryLandingPath, buildSubredditPath } from '@/lib/gallery-routes';
import { parseSubredditName } from '@/lib/reddit';
import { getSubredditPageConfigBySubredditName } from '@/lib/subreddit-pages';
import { SITE_NAME, SITE_URL } from '@/lib/site';

import { PageWrapper } from '../../page-wrapper';

interface SubredditPageProps {
  params: Promise<{
    subreddit: string;
  }>;
}

function getSubredditMetadata(subreddit: string): Metadata {
  const landingPage = getSubredditPageConfigBySubredditName(subreddit);
  const canonicalPath = landingPage
    ? buildGalleryLandingPath(landingPage.slug)
    : buildSubredditPath(subreddit);
  const title = `r/${subreddit} Image Gallery | ${SITE_NAME}`;
  const description = `Browse public images from r/${subreddit} in a clean gallery with filters, quick presets, and mobile-friendly viewing.`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${SITE_URL}${canonicalPath}`,
      siteName: SITE_NAME,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export async function generateMetadata({
  params,
}: SubredditPageProps): Promise<Metadata> {
  const { subreddit: rawSubreddit } = await params;
  const subreddit = parseSubredditName(rawSubreddit);

  if (!subreddit) {
    return {
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return getSubredditMetadata(subreddit);
}

export default async function SubredditPage({ params }: SubredditPageProps) {
  const { subreddit: rawSubreddit } = await params;
  const subreddit = parseSubredditName(rawSubreddit);

  if (!subreddit) {
    notFound();
  }

  return <PageWrapper initialSubreddit={subreddit} />;
}
