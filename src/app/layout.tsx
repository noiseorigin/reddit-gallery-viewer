import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  title: 'Reddit Gallery Viewer - Free Online Image Gallery Tool | Browse Subreddits',
  description:
    'Turn any Reddit subreddit into a beautiful image gallery instantly. Browse photography, nature, art, memes and more with dynamic color themes. Fast, free, no sign-up needed.',
  keywords:
    'reddit gallery, subreddit gallery, reddit image viewer, reddit photo gallery, free reddit tool, browse reddit images, image gallery maker, reddit browser, top reddit posts',
  authors: [{ name: 'Reddit Gallery Viewer Team' }],
  creator: 'Reddit Gallery Viewer',
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
  },
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
  icons: {
    icon: '/rgv_logo.png',
    apple: '/rgv_logo.png',
  },
  themeColor: '#FF4500',
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

        {/* Additional SEO Meta Tags */}
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="author" content="Reddit Gallery Viewer" />
        <meta name="distribution" content="global" />
        <meta name="rating" content="general" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />

        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://www.reddit.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'Reddit Gallery Viewer',
              description:
                'Transform any Reddit subreddit into a beautiful image gallery with dynamic color themes. Browse photography, art, nature, memes and more.',
              url: 'https://reddit-gallery-viewer.vercel.app/',
              applicationCategory: 'UtilityApplication',
              image: {
                '@type': 'ImageObject',
                url: 'https://reddit-gallery-viewer.vercel.app/rgv_logo.png',
                width: 1200,
                height: 630,
              },
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
                availability: 'https://schema.org/InStock',
              },
              author: {
                '@type': 'Organization',
                name: 'Reddit Gallery Viewer',
                url: 'https://reddit-gallery-viewer.vercel.app/',
                logo: 'https://reddit-gallery-viewer.vercel.app/rgv_logo.png',
              },
              operatingSystem: 'Web',
              browserRequirements: 'Requires JavaScript',
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.8',
                ratingCount: '250',
                bestRating: '5',
                worstRating: '1',
              },
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: 'https://reddit-gallery-viewer.vercel.app/?sub={search_term_string}',
                },
                'query-input': 'required name=search_term_string',
              },
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
