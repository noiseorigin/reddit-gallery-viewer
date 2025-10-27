# Reddit Gallery Viewer - Next.js

A beautiful, modern web application to browse any Reddit subreddit as an image gallery. Built with Next.js, React, TypeScript, and Tailwind CSS.

**Live**: https://reddit-gallery-viewer.vercel.app

## 🚀 Features

- **Browse any subreddit** - Enter any subreddit name to view its images
- **Responsive grid layout** - 1-4 columns based on screen size (mobile optimized)
- **Dynamic color theming** - Colors adapt to subreddit aesthetic
- **Image lazy loading** - Fast initial load with progressive enhancement
- **Search history** - Recently viewed subreddits saved locally
- **Modal viewer** - Full-screen image viewer with keyboard navigation (←/→ arrows, ESC to close)
- **Time filtering** - Browse posts from Today, This Week, or This Month
- **Sort options** - Switch between Hot, Top, New, Rising, Controversial posts
- **SEO optimized** - Proper meta tags, structured data, Open Graph support
- **Mobile friendly** - Works great on iOS, Android, and desktop

## 📱 How to Use

1. Visit the website
2. Browse default subreddits or search for any subreddit
3. Click images to view full size in modal
4. Use keyboard arrows to navigate, ESC to close
5. Your recent searches are saved automatically

## 🔧 Quick Start (Development)

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Type checking
npm run type-check
```

Visit `http://localhost:3000` in your browser.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with SEO metadata
│   ├── page.tsx           # Home page
│   ├── globals.css        # Global styles
│   └── api/proxy-image/   # Image proxy (CORS fix)
├── components/            # React components
│   ├── GalleryPage.tsx    # Main container & logic
│   ├── GalleryGrid.tsx    # Image grid layout
│   ├── GalleryImage.tsx   # Individual image card
│   ├── ImageModal.tsx     # Full-screen image viewer
│   ├── SubredditButtons.tsx
│   ├── TimeFilterButtons.tsx
│   ├── SortFilterButtons.tsx
│   ├── GridSizeButtons.tsx
│   ├── DropdownMenu.tsx
│   └── FAQSection.tsx
└── lib/                   # Utility functions
    ├── reddit.ts          # Reddit API & image handling
    ├── cache.ts           # API response caching
    ├── colors.ts          # Color manipulation utilities
    └── storage.ts         # LocalStorage helpers
```

## 🔄 Key Technologies

- **Next.js 15** - React framework with SSR & static optimization
- **React 19** - UI library with hooks
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Vercel** - Deployment platform

## 🌐 API Integration

Fetches data from public Reddit API endpoints:
- `https://www.reddit.com/r/{subreddit}/.json` - Posts data
- `https://www.reddit.com/subreddits/popular.json` - Popular subreddits

**Note**: Image loading uses a server-side proxy (`/api/proxy-image`) to bypass CORS restrictions, ensuring compatibility across all devices including mobile.

## 🐛 Known Limitations

- Reddit API returns max 100 posts per request (no pagination)
- Private subreddits are inaccessible
- Some third-party hosted images may fail due to CORS
- Videos and non-image posts are filtered out
- No user authentication required (public subreddits only)

## 🚀 Deployment

Deployed on Vercel with automatic deployments from git:

```bash
git push origin main  # Auto-deploys to Vercel
```

### Environment Variables

None required for basic functionality. Optional:
- `NEXT_PUBLIC_GA_ID` - Override Google Analytics ID

## 📊 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Android)

## 📄 License

Free, open-source utility for browsing Reddit.

---

**Version**: 2.0.0 (Next.js Edition)
**Last Updated**: October 2024
**Built with**: Next.js 15 + React 19 + TypeScript + Tailwind CSS
