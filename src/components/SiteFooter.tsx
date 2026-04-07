import Link from 'next/link';

import { CONTACT_EMAIL, SITE_NAME } from '@/lib/site';

const footerLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/contact', label: 'Contact' },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-orange-100 bg-orange-50/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 text-sm text-gray-600 sm:px-6 lg:flex-row lg:items-start lg:justify-between lg:px-8">
        <div className="max-w-2xl space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
            {SITE_NAME}
          </p>
          <p className="text-base leading-relaxed text-gray-700">
            A simple tool for browsing Reddit images in a clean gallery format. Reddit
            Gallery Viewer adds search, filters, history, and mobile-friendly browsing on
            top of public subreddit content.
          </p>
          <p className="leading-relaxed">
            Reddit content remains the property of its original creators and Reddit. This
            project is independent and is not affiliated with or endorsed by Reddit.
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
            Site Links
          </p>
          <nav aria-label="Footer">
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-medium text-gray-700 underline decoration-orange-300 underline-offset-4 transition-colors hover:text-orange-700"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <p className="leading-relaxed">
            Contact:{' '}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-medium text-orange-700 underline underline-offset-4"
            >
              {CONTACT_EMAIL}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
