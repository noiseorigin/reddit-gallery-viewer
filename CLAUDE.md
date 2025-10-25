# CLAUDE.md - Next.js Version

## Project Overview

**Reddit Gallery Viewer (Next.js Edition)** is a complete refactoring of the original single-file application into a modern, production-ready Next.js application with React components, TypeScript, and Tailwind CSS.

### Key Improvements
- **Type Safety**: Full TypeScript coverage
- **Component Architecture**: Modular, reusable components
- **Performance**: Optimized bundling, lazy loading, caching
- **Developer Experience**: Hot module reloading, better debugging
- **Maintainability**: Clear separation of concerns

---

## Architecture & Code Organization

### Directory Structure

```
view-subreddit-as-gallery-nextjs/
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout (SEO, metadata)
│   │   ├── page.tsx           # Home page
│   │   └── globals.css        # Global styles
│   ├── components/            # React components (7 files)
│   │   ├── GalleryPage.tsx    # Main container (~300 lines)
│   │   ├── GalleryGrid.tsx    # Grid layout
│   │   ├── GalleryImage.tsx   # Image card component
│   │   ├── ImageModal.tsx     # Image preview modal
│   │   ├── SubredditButtons.tsx
│   │   ├── TimeFilterButtons.tsx
│   │   └── FAQSection.tsx
│   └── lib/                   # Utility functions
│       ├── reddit.ts          # Reddit API (~200 lines)
│       ├── cache.ts           # API caching (~40 lines)
│       ├── colors.ts          # Color utilities (~100 lines)
│       └── storage.ts         # LocalStorage helpers (~60 lines)
├── public/
│   ├── robots.txt
│   └── sitemap.xml
├── Configuration Files
│   ├── package.json           # Dependencies & scripts
│   ├── tsconfig.json          # TypeScript config
│   ├── next.config.js         # Next.js settings
│   ├── tailwind.config.ts     # Tailwind customization
│   ├── postcss.config.js      # PostCSS configuration
│   ├── .eslintrc.json         # ESLint rules
│   └── vercel.json            # Vercel deployment config
└── Documentation
    ├── README.md              # Main documentation
    ├── MIGRATION_GUIDE.md     # Detailed migration notes
    └── QUICK_START.md         # Quick reference
```

### Line Count Comparison

| File/Component | Original | New | Type |
|---|---|---|---|
| Main file | 1190 | ~300 | GalleryPage.tsx |
| Reddit API | (inline) | 200 | reddit.ts |
| Color utils | (inline) | 100 | colors.ts |
| Storage | (inline) | 60 | storage.ts |
| Cache | (inline) | 40 | cache.ts |
| Components | N/A | 600 | 7 .tsx files |
| **Total** | 1190 | 2000 | Spread, more maintainable |

---

## Core Functionality

### 1. Gallery System (GalleryPage.tsx)
- State management for subreddit, time filter, posts, modal
- Fetches images from Reddit API
- Handles URL parameters for bookmarking
- Manages search history with localStorage
- Real-time theme color application

### 2. Reddit API (lib/reddit.ts)
- `fetchRedditAPI()` - Fetch with automatic caching
- `buildApiUrl()` - Constructs Reddit API URLs
- `parseSubredditName()` - Parses input (name, r/name, URL)
- `filterImagePosts()` - Extracts image posts from response
- `getPostImageSources()` - Gets placeholder + high-res image URLs
- `loadPopularSubreddits()` - Fetches trending subreddits

### 3. Color System (lib/colors.ts)
- `hexToRgb()` / `rgbToHex()` - Color conversion
- `lightenColor()` / `darkenColor()` - Color manipulation
- `getColorBrightness()` - WCAG luminance calculation
- `getTextColorForBackground()` - Accessibility support
- `getOptimalBackgroundColor()` - Dynamic theme generation

### 4. Storage Layer (lib/storage.ts)
- `getSearchHistory()` - Retrieve localStorage history
- `addToSearchHistory()` - Add with deduplication
- `readCachedPopularSubreddits()` - Cache management
- `storePopularSubreddits()` - Cache write with TTL

### 5. Caching System (lib/cache.ts)
- Simple Map-based in-memory cache
- 5-minute TTL for API responses
- Reduces Reddit API rate limiting impact

---

## Component Architecture

### GalleryPage.tsx (Container Component)
```typescript
Key State:
- subreddits: Array<{ name, displayName }>
- currentSubreddit: string
- currentTimeFilter: TimeFilter
- posts: RedditPost[]
- isLoading: boolean
- error: string | null
- modalIndex: number
- isModalOpen: boolean
- searchHistory: SearchHistoryItem[]

Key Functions:
- fetchImages() - Main data loading
- handleSubredditSelect() - Change subreddit
- handleCustomSubreddit() - Parse & load custom subreddit
- handleShare() - Copy URL to clipboard
```

### Child Components
- **GalleryGrid**: Maps posts to GalleryImage cards
- **GalleryImage**: Individual image card with loading state
- **ImageModal**: Full-screen image viewer with navigation
- **SubredditButtons**: Subreddit selector with active state
- **TimeFilterButtons**: Time period filter buttons
- **FAQSection**: Frequently asked questions

---

## Data Flow

```
User Action (click subreddit)
    ↓
GalleryPage.handleSubredditSelect()
    ↓
setCurrentSubreddit() (state update)
    ↓
useEffect dependency triggers
    ↓
fetchImages() → fetchRedditAPI()
    ↓
Check cache (apiCache.get)
    ↓
If miss: fetch from Reddit API
    ↓
Cache result (apiCache.set)
    ↓
Filter posts (imagePostsOnly)
    ↓
setPosts() (state update)
    ↓
GalleryGrid renders with new posts
```

---

## Development Workflow

### Local Testing
```bash
npm install
npm run dev
# Visit http://localhost:3000
```

### TypeScript Checking
```bash
npm run type-check
```

### Production Build
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

---

## SEO & Metadata

### Implemented in layout.tsx
- **Title & Description**: Optimized for search snippets
- **Keywords**: Relevant search terms
- **Open Graph**: Social media sharing
- **Twitter Cards**: X (Twitter) specific tags
- **Canonical URL**: Prevents duplicate content
- **JSON-LD Schema**: Structured data (WebApplication type)
- **Robots & Sitemap**: Search engine crawling

### Google Analytics
- Measurement ID: G-SSS54C3THS
- Tracks gallery views and user interactions

---

## Performance Features

### Image Loading
1. **Lazy Loading**: IntersectionObserver for off-screen images
2. **Progressive Loading**:
   - Load placeholder image first (small, fast)
   - Upgrade to high-resolution in background
   - Timeout fallback for slow networks
3. **Error Handling**: Automatic retries with exponential backoff

### API Optimization
- **Caching**: 5-minute in-memory cache
- **User-Agent Spoofing**: Better compatibility with Reddit API
- **CORS Headers**: Proper fetch configuration
- **Rate Limiting**: Max 100 posts per request (Reddit limit)

### Code Optimization
- **Code Splitting**: Next.js automatic bundle splitting
- **Tree Shaking**: Unused code elimination
- **Minification**: Production bundle optimization
- **Compression**: Gzip by default on Vercel

---

## Configuration Details

### Tailwind CSS (tailwind.config.ts)
```typescript
theme.extend.colors.reddit = {
  orange: '#FF4500',
  'orange-light': '#ff6d00',
  'orange-lighter': '#ffb6a3',
}
// Custom animation for image shimmer
animation.shimmer = 'shimmer 1.5s infinite'
```

### Next.js Config (next.config.js)
- Image optimization with external domain allowlist
- Security headers (X-Content-Type-Options, etc.)
- Cache-Control headers for index.html (1 hour)
- Vercel deployment optimizations

### TypeScript (tsconfig.json)
- Strict mode enabled
- Path alias: @/* → src/*
- ES2020 target
- DOM + Node types

---

## Testing Checklist

Before deploying changes:
- [ ] `npm run build` succeeds without errors
- [ ] `npm run type-check` shows no type errors
- [ ] Search works with all 3 input formats
- [ ] Image loading works with lazy loading
- [ ] Modal keyboard navigation (Esc, Arrows)
- [ ] Search history persists on reload
- [ ] Mobile responsiveness (iOS + Android)
- [ ] No console JavaScript errors
- [ ] Analytics tracking works

---

## Deployment

### To Vercel
```bash
git add .
git commit -m "Deploy Next.js version"
git push origin main
```

Vercel automatically:
1. Detects Next.js project
2. Runs `next build`
3. Deploys optimized output
4. Sets security headers from vercel.json
5. Enables automatic HTTPS

### Environment Variables
Currently none required. Optional:
- `NEXT_PUBLIC_GA_ID` - Override Google Analytics ID

---

## Key Differences from Original

| Aspect | Original | Next.js |
|---|---|---|
| **File Structure** | 1 HTML file | Multiple components |
| **Language** | Vanilla JS | TypeScript |
| **Styling** | Tailwind CDN | Tailwind npm |
| **State** | Global variables | React hooks |
| **DOM Updates** | Manual | React rendering |
| **Routing** | Hash-based | URL params |
| **Build** | None | webpack/turbopack |
| **Type Safety** | None | Full |
| **SSR** | None | Enabled |

---

## Future Enhancement Ideas

- [ ] Dark mode toggle
- [ ] Image search/filtering
- [ ] Post metadata display
- [ ] Pagination support
- [ ] Image download
- [ ] Social share improvements
- [ ] PWA support
- [ ] User preferences persistence
- [ ] Comment thread preview
- [ ] Trending subreddits sidebar

---

## Maintenance Notes

### Adding New Features
1. Create component in `src/components/`
2. Import in GalleryPage.tsx
3. Add TypeScript interfaces in component file
4. Update related lib/ utilities if needed

### Updating Styles
1. Edit `src/app/globals.css` for global styles
2. Use Tailwind classes in JSX
3. Keep color theme in PRIMARY_COLOR constant

### API Changes
1. Modify `lib/reddit.ts`
2. Update types in function signatures
3. Update tests if applicable

### Dependency Updates
```bash
npm update
npm run type-check  # Verify compatibility
npm run build       # Test production build
```

---

## Known Limitations

1. Reddit API max 100 posts per request (no pagination)
2. Private subreddits cannot be accessed
3. Some third-party images blocked by CORS
4. Videos filtered out (image gallery only)
5. No authentication (public subreddits only)

---

## Support & Resources

- **Documentation**: README.md
- **Migration Guide**: MIGRATION_GUIDE.md
- **Quick Start**: QUICK_START.md
- **Next.js Docs**: https://nextjs.org/docs
- **React Docs**: https://react.dev
- **Tailwind Docs**: https://tailwindcss.com

---

## Version Info

- **Version**: 2.0.0 (Next.js Refactor)
- **Last Updated**: October 2024
- **Technology Stack**:
  - Next.js 15
  - React 19
  - TypeScript 5
  - Tailwind CSS 3.4
- **Node Version**: 18+
- **Package Manager**: npm

---

Created with attention to code quality, performance, and maintainability.
