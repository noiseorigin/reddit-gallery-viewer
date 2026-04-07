import type { Metadata } from 'next';
import Link from 'next/link';

import { SITE_NAME, SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: `About | ${SITE_NAME}`,
  description:
    'Learn what Reddit Gallery Viewer does, how it adds value on top of public subreddit content, and how the project is maintained.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: `About | ${SITE_NAME}`,
    description:
      'Learn what Reddit Gallery Viewer does, how it adds value on top of public subreddit content, and how the project is maintained.',
    type: 'website',
    url: `${SITE_URL}/about`,
    siteName: SITE_NAME,
  },
  twitter: {
    card: 'summary',
    title: `About | ${SITE_NAME}`,
    description:
      'Learn what Reddit Gallery Viewer does, how it adds value on top of public subreddit content, and how the project is maintained.',
  },
};

const sections = [
  {
    title: 'What the site does',
    body: (
      <>
        <p>
          Reddit Gallery Viewer is a simpler way to browse image-heavy subreddits without
          the clutter of a traditional feed. It turns public Reddit posts into a clean,
          responsive gallery that is easier to scan on both desktop and mobile.
        </p>
        <p>
          The site is designed for people who want a fast visual browsing experience with
          no login, no app, and no extra setup.
        </p>
      </>
    ),
  },
  {
    title: 'Who it is for',
    body: (
      <>
        <p>
          The tool is useful for people who care more about visual scanning than comment
          threads, such as designers collecting references, photographers reviewing popular
          shots, shoppers browsing style ideas, and casual visitors who want a simpler way to
          explore public communities.
        </p>
        <p>
          It is especially helpful on mobile devices, where a dense feed can be harder to
          browse quickly.
        </p>
      </>
    ),
  },
  {
    title: 'How the tool adds value',
    body: (
      <>
        <p>
          Rather than simply mirroring a Reddit page, the viewer adds practical utility on
          top of public subreddit content:
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li>A focused gallery layout for image-first browsing</li>
          <li>Quick filters for time range, sort order, and grid density</li>
          <li>Recent-search memory stored locally in your browser</li>
          <li>Mobile-friendly viewing and direct links back to the original Reddit posts</li>
        </ul>
      </>
    ),
  },
  {
    title: 'How to use it',
    body: (
      <>
        <ol className="list-decimal space-y-2 pl-6">
          <li>Start from a quick preset, a popular community, or any subreddit search.</li>
          <li>Adjust time range, sort order, and grid size to match what you want to browse.</li>
          <li>Open any image in the viewer, then jump to Reddit for the full thread if needed.</li>
        </ol>
      </>
    ),
  },
  {
    title: 'Content standards',
    body: (
      <>
        <p>
          Reddit Gallery Viewer is intended for public, image-first browsing. The tool avoids
          restricted community recommendations, filters adult-marked image posts from the
          gallery, and points visitors back to Reddit for discussion and source context.
        </p>
        <p>
          The goal is not to replace Reddit, but to offer a cleaner viewing layer for public
          content when a visual browsing workflow is more useful than a traditional feed.
        </p>
      </>
    ),
  },
  {
    title: 'Content sources and ownership',
    body: (
      <>
        <p>
          Reddit Gallery Viewer fetches public subreddit data on demand from Reddit and
          links visitors back to the original post for comments and community context.
        </p>
        <p>
          Images, post titles, usernames, and other Reddit content remain the property and
          responsibility of their original creators and Reddit. This project is an
          independent browsing tool and is not affiliated with or endorsed by Reddit.
        </p>
      </>
    ),
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white px-4 py-12 text-gray-800 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-8">
        <div>
          <Link
            href="/"
            className="text-sm font-medium text-orange-700 underline underline-offset-4"
          >
            Back to gallery
          </Link>
        </div>

        <header className="space-y-4 border-b border-orange-100 pb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
            {SITE_NAME}
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            About Reddit Gallery Viewer
          </h1>
          <p className="text-lg leading-relaxed text-gray-700">
            Reddit Gallery Viewer is built to make public Reddit image discovery faster,
            cleaner, and easier to use across devices.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {['Quick presets', 'Mobile-friendly', 'Public content only', 'Direct Reddit links'].map(
              (item) => (
                <span
                  key={item}
                  className="rounded-full border border-orange-100 bg-orange-50/70 px-3 py-1.5 text-xs font-medium text-gray-700"
                >
                  {item}
                </span>
              )
            )}
          </div>
        </header>

        {sections.map((section) => (
          <section key={section.title} className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">{section.title}</h2>
            <div className="space-y-4 leading-relaxed text-gray-700">{section.body}</div>
          </section>
        ))}
      </div>
    </main>
  );
}
