'use client';

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
      'You can browse any public subreddit on Reddit! We provide quick buttons for popular image-focused subreddits like photography, nature, art, interior design, food, and more. However, you\'re not limited to these—simply type any subreddit name to explore it as a gallery.',
  },
  {
    question: 'Do I need a Reddit account or app?',
    answer:
      'No! Reddit Gallery Viewer is completely free and requires no account, login, or app installation. It\'s a lightweight web application that runs directly in your browser. Simply visit the site and start browsing.',
  },
  {
    question: 'Can I view image details or comments?',
    answer:
      'Yes! Click on any image to open it in a modal view where you can see the full-size image and the post title. You can also click the "View on Reddit" button to open the original post on Reddit where you can read comments and interact with the community.',
  },
  {
    question: 'How do I navigate between images?',
    answer:
      'In the image preview modal, use the Previous/Next buttons to navigate between images, or use keyboard shortcuts: Left Arrow to go to the previous image, Right Arrow to go to the next image, and Escape to close the modal.',
  },
  {
    question: 'How are the images displayed?',
    answer:
      'Images are displayed in a responsive grid layout (1-4 columns depending on screen size) showing the top posts from your selected subreddit. Images are lazily loaded as you scroll for optimal performance.',
  },
  {
    question: 'Is my search history saved?',
    answer:
      'Yes! Reddit Gallery Viewer saves your recently viewed subreddits in your browser\'s local storage. These appear in the "Recently Viewed" section for quick access. Your data is stored locally and never sent to our servers.',
  },
  {
    question: 'Is Reddit Gallery Viewer free?',
    answer:
      'Yes, completely free! There are no hidden fees, subscriptions, or premium features. We simply provide a beautiful, fast way to browse Reddit subreddits as image galleries.',
  },
];

interface FAQSectionProps {
  primaryColor: string;
}

export function FAQSection({ primaryColor }: FAQSectionProps) {
  return (
    <section className="mt-16 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: primaryColor }}>
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        {faqItems.map((item, index) => (
          <details
            key={index}
            className="border-2 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
            style={{ borderColor: '#ff6d00' }}
          >
            <summary className="font-semibold text-lg" style={{ color: primaryColor }}>
              {item.question}
            </summary>
            <p className="mt-3 text-gray-700 leading-relaxed">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
