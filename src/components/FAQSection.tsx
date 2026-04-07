'use client';

import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: 'How do I use Reddit Gallery Viewer?',
    answer:
      'Simply enter any subreddit name in the search box (e.g., "photography", "nature", "art") or click on one of the popular subreddit buttons. The app will fetch and display the top images from that subreddit as a beautiful gallery. You can also filter by time period: today, this week, or this month.',
  },
  {
    question: 'What subreddits can I browse?',
    answer:
      'You can browse any public subreddit on Reddit! We provide quick buttons for popular image-focused subreddits like photography, nature, art, interior design, food, and more. However, you are not limited to these. Simply type any subreddit name to explore it as a gallery.',
  },
  {
    question: 'Do I need a Reddit account or app?',
    answer:
      'No. Reddit Gallery Viewer is completely free and requires no account, login, or app installation. It runs directly in your browser.',
  },
  {
    question: 'Can I view image details or comments?',
    answer:
      'Yes. Click any image to open it in the modal viewer, then use the View on Reddit action to open the original thread with comments and context.',
  },
  {
    question: 'How do I navigate between images?',
    answer:
      'In the image preview modal, use the Previous and Next buttons or the keyboard shortcuts: Left Arrow, Right Arrow, and Escape.',
  },
  {
    question: 'How are the images displayed?',
    answer:
      'Images are shown in a responsive grid layout with size controls, lazy loading, and a cleaner gallery view than a standard Reddit feed.',
  },
  {
    question: 'Is my search history saved?',
    answer:
      'Yes. Recent searches are stored locally in your browser so you can revisit subreddits more quickly.',
  },
  {
    question: 'Is Reddit Gallery Viewer free?',
    answer:
      'Yes, completely free. There are no subscriptions, accounts, or premium tiers.',
  },
];

interface FAQSectionProps {
  primaryColor: string;
}

export function FAQSection({ primaryColor }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="mx-auto mt-16 max-w-3xl">
      <h2 className="mb-8 text-center text-3xl font-bold" style={{ color: primaryColor }}>
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        {faqItems.map((item, index) => {
          const isOpen = openIndex === index;

          return (
            <article
              key={item.question}
              className="rounded-xl border-2 bg-white transition-colors hover:bg-gray-50"
              style={{ borderColor: '#ff6d00' }}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                aria-expanded={isOpen}
                className="flex w-full items-start justify-between gap-4 px-4 py-4 text-left"
              >
                <span className="text-lg font-semibold" style={{ color: primaryColor }}>
                  {item.question}
                </span>
                <span
                  aria-hidden="true"
                  className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-sm font-bold transition-transform"
                  style={{
                    borderColor: '#ff6d00',
                    color: primaryColor,
                    transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                  }}
                >
                  +
                </span>
              </button>

              <div
                className="grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out"
                style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
              >
                <div className="overflow-hidden">
                  <p className="px-4 pb-4 text-gray-700 leading-relaxed">{item.answer}</p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
