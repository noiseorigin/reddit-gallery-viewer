import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';

import { SiteFooter } from '@/components/SiteFooter';
import { ADSENSE_CLIENT, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site';

import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${SITE_NAME} - Free Online Image Gallery Tool | Browse Subreddits`,
  description: SITE_DESCRIPTION,
  keywords:
    'reddit gallery, subreddit gallery, reddit image viewer, reddit photo gallery, free reddit tool, browse reddit images, image gallery maker, reddit browser, top reddit posts',
  authors: [{ name: `${SITE_NAME} Team` }],
  creator: SITE_NAME,
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
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
  icons: {
    icon: '/rgv_logo.png',
    apple: '/rgv_logo.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#FF4500',
  width: 'device-width',
  initialScale: 1,
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

        {/* Additional SEO Meta Tags */}
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="author" content={SITE_NAME} />
        <meta name="distribution" content="global" />
        <meta name="rating" content="general" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />

        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://www.reddit.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: SITE_NAME,
              description: SITE_DESCRIPTION,
              url: SITE_URL,
              applicationCategory: 'UtilityApplication',
              image: {
                '@type': 'ImageObject',
                url: `${SITE_URL}/rgv_logo.png`,
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
                name: SITE_NAME,
                url: SITE_URL,
                logo: `${SITE_URL}/rgv_logo.png`,
              },
              operatingSystem: 'Web',
              browserRequirements: 'Requires JavaScript',
              isAccessibleForFree: true,
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: `${SITE_URL}/r/{search_term_string}`,
                },
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />

        {/* Google Analytics */}
      </head>
      <body className="bg-white text-gray-800">
        <Script
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-SSS54C3THS"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-SSS54C3THS');`}
        </Script>
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
