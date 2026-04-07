import type { Metadata } from 'next';
import Link from 'next/link';

import { CONTACT_EMAIL, SITE_NAME, SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: `Contact | ${SITE_NAME}`,
  description:
    'Contact Reddit Gallery Viewer for support, privacy requests, bug reports, or business inquiries.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: `Contact | ${SITE_NAME}`,
    description:
      'Contact Reddit Gallery Viewer for support, privacy requests, bug reports, or business inquiries.',
    type: 'website',
    url: `${SITE_URL}/contact`,
    siteName: SITE_NAME,
  },
  twitter: {
    card: 'summary',
    title: `Contact | ${SITE_NAME}`,
    description:
      'Contact Reddit Gallery Viewer for support, privacy requests, bug reports, or business inquiries.',
  },
};

export default function ContactPage() {
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
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Contact</h1>
          <p className="text-lg leading-relaxed text-gray-700">
            Use the email below for support, privacy-related questions, bug reports, or
            business inquiries about Reddit Gallery Viewer.
          </p>
        </header>

        <section className="space-y-4 rounded-2xl border border-orange-100 bg-orange-50/60 p-6">
          <h2 className="text-2xl font-semibold text-gray-900">Email</h2>
          <p className="leading-relaxed text-gray-700">
            The fastest way to reach the site owner is by email:
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="inline-flex text-lg font-semibold text-orange-700 underline underline-offset-4"
          >
            {CONTACT_EMAIL}
          </a>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">What to include</h2>
          <ul className="list-disc space-y-2 pl-6 leading-relaxed text-gray-700">
            <li>The subreddit or page you were viewing</li>
            <li>A short description of the issue or request</li>
            <li>Your browser and device if you are reporting a bug</li>
            <li>Any relevant links or screenshots that can help reproduce the problem</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
