import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  title: 'Reddit Gallery Viewer - Browse Any Subreddit as Image Gallery | Free',
  description:
    'Reddit Gallery Viewer - Browse any subreddit as a beautiful image gallery. View top photos from photography, nature, memes, art and more. Fast, free, no app needed!',
  keywords:
    'reddit gallery viewer, reddit image gallery, subreddit gallery, free reddit tool, reddit browser, reddit photo gallery, reddit top posts, image viewer',
  authors: [{ name: 'Reddit Gallery Viewer' }],
  robots: {
    index: true,
    follow: true,
    maxImagePreview: 'large',
  },
  openGraph: {
    title: 'Reddit Gallery Viewer - Browse Any Subreddit as Image Gallery',
    description:
      'View any Reddit subreddit as a beautiful image gallery. Browse top photos from photography, nature, memes, art and more. Fast, free, no app needed!',
    type: 'website',
    url: 'https://reddit-gallery-viewer.vercel.app/',
    siteName: 'Reddit Gallery Viewer',
    locale: 'en_US',
    images: [
      {
        url: 'https://reddit-gallery-viewer.vercel.app/rgv_logo.png',
        width: 1200,
        height: 630,
        alt: 'Reddit Gallery Viewer Logo',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Reddit Gallery Viewer - Browse Any Subreddit as Image Gallery',
    description:
      'View any Reddit subreddit as a beautiful image gallery. Browse top photos from photography, nature, memes, art and more. Fast, free, no app needed!',
    images: {
      url: 'https://reddit-gallery-viewer.vercel.app/rgv_logo.png',
      alt: 'Reddit Gallery Viewer Logo',
    },
    site: '@RedditGallery',
  },
  icons: {
    icon: '/rgv_logo.png',
    apple: '/rgv_logo.png',
  },
  themeColor: '#FF4500',
  canonical: 'https://reddit-gallery-viewer.vercel.app/',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://reddit-gallery-viewer.vercel.app/" />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'Reddit Gallery Viewer',
              description:
                'Free online tool to browse any Reddit subreddit as a beautiful image gallery with dynamic color themes',
              url: 'https://reddit-gallery-viewer.vercel.app/',
              applicationCategory: 'UtilityApplication',
              image: 'https://reddit-gallery-viewer.vercel.app/rgv_logo.png',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
              author: {
                '@type': 'Organization',
                name: 'Reddit Gallery Viewer',
                url: 'https://reddit-gallery-viewer.vercel.app/',
              },
              operatingSystem: 'Web',
              browserRequirements: 'Requires JavaScript',
            }),
          }}
        />

        {/* Google Analytics */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-SSS54C3THS"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-SSS54C3THS');
            `,
          }}
        />
      </head>
      <body className="bg-white text-gray-800">{children}</body>
    </html>
  );
}
