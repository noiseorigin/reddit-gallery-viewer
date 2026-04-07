import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { buildGalleryLandingPath } from '@/lib/gallery-routes';
import {
  getAllSubredditPageConfigs,
  getRelatedSubredditPageConfigs,
  getSubredditPageConfigBySlug,
} from '@/lib/subreddit-pages';
import { SITE_NAME, SITE_URL } from '@/lib/site';

import { PageWrapper } from '../../page-wrapper';

interface GalleryLandingPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllSubredditPageConfigs().map((page) => ({
    slug: page.slug,
  }));
}

export async function generateMetadata({
  params,
}: GalleryLandingPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getSubredditPageConfigBySlug(slug);

  if (!page) {
    return {
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const canonicalPath = buildGalleryLandingPath(page.slug);
  const title = `${page.seoTitle} | ${SITE_NAME}`;

  return {
    title,
    description: page.metaDescription,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title,
      description: page.metaDescription,
      type: 'website',
      url: `${SITE_URL}${canonicalPath}`,
      siteName: SITE_NAME,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: page.metaDescription,
    },
  };
}

export default async function GalleryLandingPage({ params }: GalleryLandingPageProps) {
  const { slug } = await params;
  const page = getSubredditPageConfigBySlug(slug);

  if (!page) {
    notFound();
  }

  return (
    <PageWrapper
      initialSubreddit={page.subredditName}
      landingPage={{
        page,
        relatedPages: getRelatedSubredditPageConfigs(page),
      }}
    />
  );
}
