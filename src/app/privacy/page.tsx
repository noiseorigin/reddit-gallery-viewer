import type { Metadata } from 'next';

import { CONTACT_EMAIL, SITE_NAME, SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: `Privacy Policy | ${SITE_NAME}`,
  description:
    `Read the privacy policy for ${SITE_NAME}, including details about cookies, Google AdSense, analytics, local storage, and third-party services.`,
  alternates: {
    canonical: '/privacy',
  },
  openGraph: {
    title: `Privacy Policy | ${SITE_NAME}`,
    description:
      `Privacy information for ${SITE_NAME}, including advertising, analytics, cookies, and browser storage.`,
    type: 'website',
    url: `${SITE_URL}/privacy`,
    siteName: SITE_NAME,
  },
  twitter: {
    card: 'summary',
    title: `Privacy Policy | ${SITE_NAME}`,
    description:
      `Privacy information for ${SITE_NAME}, including advertising, analytics, cookies, and browser storage.`,
  },
};

const policySections = [
  {
    title: 'Information We Collect',
    content: (
      <>
        <p>
          Reddit Gallery Viewer does not require user accounts and does not directly ask you
          to submit personal information to use the site.
        </p>
        <p>
          When you visit the site, limited information may be collected automatically, such as
          your browser type, device information, pages viewed, approximate location, and IP
          address.
        </p>
        <p>
          We also store limited browser-side data in local storage to support the product,
          including your recent subreddit search history and a short-term cache of popular
          subreddit suggestions.
        </p>
      </>
    ),
  },
  {
    title: 'How We Use Information',
    content: (
      <>
        <p>We use this information to operate, maintain, and improve the website.</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Show Reddit content in a gallery format</li>
          <li>Remember recent searches on your device for convenience</li>
          <li>Measure site usage and improve performance</li>
          <li>Support advertising and understand ad performance</li>
          <li>Protect the site against misuse, abuse, and technical issues</li>
        </ul>
      </>
    ),
  },
  {
    title: 'Cookies and Advertising',
    content: (
      <>
        <p>
          Reddit Gallery Viewer uses Google AdSense to display advertising. Google and other
          third-party vendors may use cookies, web beacons, IP addresses, and similar
          technologies to serve ads, measure ad performance, and help prevent fraud.
        </p>
        <p>
          In short, Google AdSense may rely on cookies to understand visits, support ad
          delivery, and measure advertising performance on this site and across the web.
        </p>
        <p>
          Third-party vendors, including Google, may use cookies to serve ads based on your
          prior visits to this site and other websites. These technologies may support
          personalized or non-personalized advertising depending on your settings and region.
        </p>
        <p>
          You can learn more about how Google uses data from sites and apps that use its
          services at{' '}
          <a
            className="font-medium text-orange-700 underline underline-offset-4"
            href="https://policies.google.com/technologies/partner-sites"
          >
            https://policies.google.com/technologies/partner-sites
          </a>
          .
        </p>
        <p>
          You can manage Google&apos;s personalized advertising settings at{' '}
          <a
            className="font-medium text-orange-700 underline underline-offset-4"
            href="https://adssettings.google.com/"
          >
            https://adssettings.google.com/
          </a>
          . You can also control cookies through your browser settings.
        </p>
      </>
    ),
  },
  {
    title: 'Third-Party Services',
    content: (
      <>
        <p>We use third-party services to operate the website, including:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Google AdSense for advertising</li>
          <li>Google Analytics for traffic measurement and usage insights</li>
          <li>Vercel for hosting and infrastructure</li>
          <li>Reddit as the source of public subreddit content shown by the tool</li>
        </ul>
        <p>
          These services may collect and process information according to their own privacy
          policies.
        </p>
      </>
    ),
  },
  {
    title: 'Data Security',
    content: (
      <>
        <p>
          We take reasonable steps to protect the website and reduce the risk of unauthorized
          access, misuse, or disclosure of information.
        </p>
        <p>
          However, no website, browser storage mechanism, or internet transmission is fully
          secure, so we cannot guarantee absolute security.
        </p>
      </>
    ),
  },
  {
    title: 'Changes to This Policy',
    content: (
      <>
        <p>
          We may update this Privacy Policy from time to time to reflect changes to the site,
          legal requirements, or third-party services.
        </p>
        <p>
          When we make updates, we will post the revised version on this page and update the
          last updated date.
        </p>
      </>
    ),
  },
  {
    title: 'Contact Information',
    content: (
      <>
        <p>
          If you have questions about this Privacy Policy, please contact us through the
          website or email us at{' '}
          <a
            className="font-medium text-orange-700 underline underline-offset-4"
            href={`mailto:${CONTACT_EMAIL}`}
          >
            {CONTACT_EMAIL}
          </a>{' '}
          and visit{' '}
          <a
            className="font-medium text-orange-700 underline underline-offset-4"
            href={SITE_URL}
          >
            {SITE_URL}
          </a>
          .
        </p>
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white px-4 py-12 text-gray-800 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-8">
        <header className="space-y-4 border-b border-orange-100 pb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
            {SITE_NAME}
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Privacy Policy</h1>
          <p className="text-sm text-gray-500">Last updated: April 7, 2026</p>
          <p className="text-lg leading-relaxed text-gray-700">
            This page explains what information Reddit Gallery Viewer may collect, how that
            information is used, and how Google AdSense, cookies, analytics, and browser
            storage work on the site.
          </p>
        </header>

        {policySections.map((section) => (
          <section key={section.title} className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">{section.title}</h2>
            <div className="space-y-4 leading-relaxed text-gray-700">{section.content}</div>
          </section>
        ))}
      </div>
    </main>
  );
}
