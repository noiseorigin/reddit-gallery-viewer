# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Reddit Gallery Viewer** is a single-file, client-side web application that lets users browse any Reddit subreddit as a beautiful image gallery. It's production-ready and deployed on Vercel at https://reddit-gallery-viewer.vercel.app/

### Key Characteristics
- **Single HTML file** with embedded CSS and JavaScript (no build tools needed)
- **Fully client-side** - no backend or authentication required
- **SEO-optimized** with comprehensive meta tags and structured data
- **Production deployment** via Vercel with automatic CI/CD

---

## Architecture & Code Organization

### File Structure
- **index.html** (1190 lines) - Complete application (HTML + CSS + JavaScript)
- **vercel.json** - Deployment configuration with security headers
- **robots.txt** - SEO configuration for search engine crawling
- **sitemap.xml** - XML sitemap for search engines
- **.gitignore** - Standard Node/IDE/build exclusions

### Application Structure (inside index.html)

#### 1. **Head Section** (Lines 1-165)
- **SEO Meta Tags** (Lines 6-27): keywords, description, canonical URL, Open Graph, Twitter Cards
- **JSON-LD Schema** (Lines 58-81): Structured data for search engines (WebApplication type)
- **CSS Variables** (Lines 84-92): Reddit branding colors (primary: #FF4500 orange)
- **Base Styles** (Lines 93-165): Tailwind + custom styles for modals, loading states, retries

#### 2. **HTML Body** (Lines 167-364)
- **Header** (Lines 171-178): H1 title, subtitle, tagline
- **Search Input** (Lines 181-207): Custom subreddit search with multiple format support
- **Subreddit Buttons** (Lines 210-218): Pre-configured popular subreddits (7 items)
- **Search History** (Lines 221-229): Recently viewed subreddits (dynamically rendered)
- **Time Filters** (Lines 232-240): Today/This Week/This Month options
- **Gallery Grid** (Lines 283-288): Responsive grid for image cards (1-4 columns)
- **Modal Preview** (Lines 308-364): Full-screen image viewer with keyboard navigation

#### 3. **JavaScript Application** (Lines 366-1189)

**Data & State Management:**
- `subreddits` array (Line 392-400): 7 pre-configured subreddits with emoji names
- `timeFilters` array (Line 402-406): 3 time period options
- `apiCache` Map (Line 412): In-memory cache for Reddit API responses (5-minute TTL)
- `localStorage`: Search history persisted to browser (max 10 items, SEARCH_HISTORY_KEY)

**Core Functions:**

1. **API Layer** (Lines 444-479)
   - `buildApiUrl()` - Creates Reddit API URL for top posts
   - `fetchWithCache()` - Fetch with caching, User-Agent header, error handling
   - Reddit API endpoints: `/r/{subreddit}/top/.json?t={time}&limit=100`

2. **Theme System** (Lines 483-774)
   - `hexToRgb()`, `rgbToHex()` - Color conversion utilities
   - `lightenColor()`, `darkenColor()` - Color manipulation with percentages
   - `getColorBrightness()` - WCAG luminance calculation for accessibility
   - `applyTheme()` - Applies colors to all UI elements, generates dynamic CSS
   - Default theme: Reddit orange (#FF4500) with calculated light/light-lighter variants

3. **Search & History** (Lines 410-442, 1058-1091)
   - `getSearchHistory()` - Retrieve from localStorage
   - `addToSearchHistory()` - Add to history, deduplicate, limit to 10
   - `renderSearchHistory()` - Dynamically create history buttons, auto-hide when empty
   - History auto-saves on each subreddit load

4. **Gallery Rendering** (Lines 944-1044)
   - `fetchImages()` - Main function that loads, filters, and renders images
   - Filters Reddit posts to image-only (post_hint==="image" or .jpg/.png/.gif)
   - Lazy loads images beyond the first 12 (IntersectionObserver API)
   - Implements 3-retry mechanism for failed image loads

5. **Image Handling**
   - `retryImageLoad()` - Retry failed images up to 3 times
   - `initImageObserver()` - Lazy load images as user scrolls
   - Placeholder shimmer animation during loading

6. **Modal & Navigation** (Lines 802-882)
   - `openModal()` / `closeModal()` - Modal state management
   - `updateModalContent()` - Navigate between images in gallery
   - Keyboard shortcuts: Esc to close, Arrow Left/Right to navigate
   - Mouse navigation: Previous/Next buttons

7. **Input Parsing** (Lines 777-800)
   - `parseSubredditName()` - Accept multiple input formats:
     - Direct: `photography`
     - URL: `https://reddit.com/r/photography`
     - Shorthand: `r/photography`

8. **Initialization** (Lines 1126-1185)
   - `initializeApp()` - DOMContentLoaded handler
   - Creates all buttons dynamically
   - Sets up event listeners for search, filters, modal

---

## Development Workflow

### Local Testing
```bash
# Option 1: Direct browser access
open index.html

# Option 2: Python HTTP server (avoids CORS issues with external APIs)
python3 -m http.server 8000
# Visit http://localhost:8000
```

### Making Changes
- All changes are made to `index.html` (single file)
- No build process needed - changes are immediately visible
- Test thoroughly in browser before committing

### Common Tasks

**Adding a new popular subreddit:**
1. Edit the `subreddits` array in lines 392-400
2. Add new entry: `{ name: "subreddit_name", displayName: "🎨 Display Name" }`
3. The button will auto-render on page load

**Changing color scheme:**
1. Modify CSS variables in `:root` (lines 84-92)
2. Update `defaultTheme` object (lines 483-487)
3. The `applyTheme()` function will propagate colors automatically

**Adjusting API cache duration:**
- Line 413: `const CACHE_DURATION = 1000 * 60 * 5;` (currently 5 minutes)

**Modifying search history limit:**
- Line 417: `const MAX_HISTORY = 10;`

---

## SEO & Deployment Configuration

### SEO Setup
- **Meta tags** optimized for search snippets (description, keywords)
- **Open Graph** tags for social media sharing (Twitter, Facebook)
- **JSON-LD Schema** identifies app as UtilityApplication
- **Canonical URL** prevents duplicate content issues
- **Sitemap** at `sitemap.xml` for search engine crawling
- **robots.txt** configured to allow crawling and point to sitemap

### Google Search Console Integration
- Verification file support: Any `.html` file in root directory is deployed
- Update robots.txt with production domain if needed
- Sitemap should be auto-discovered at `/sitemap.xml`

### Vercel Deployment
- **Build command** (vercel.json line 2): Copies `index.html`, `.html` files, `robots.txt`, and `sitemap.xml` to public output
- **Security headers** configured for X-Content-Type-Options, X-Frame-Options, etc.
- **Cache-Control** header on index.html: 1 hour TTL for freshness
- Auto-deployment on GitHub push (CI/CD via Vercel)

### Google Analytics (Optional)
- Template prepared in lines 47-56 (currently commented out)
- To enable: Get measurement ID from https://analytics.google.com/
- Replace `G-YOUR-MEASUREMENT-ID` and uncomment the script tag

---

## Important Implementation Details

### Reddit API Rate Limiting
- Public Reddit API: 60 requests per minute per IP
- Solution: 5-minute in-memory cache reduces API calls significantly
- No authentication needed for public subreddits

### Image Loading Failures
- Common cause: CORS restrictions on third-party hosted images
- Solution: 3-retry mechanism with exponential backoff
- Known limitation: Some image hosts block bot requests

### Browser localStorage
- Search history uses `localStorage` (persistent across sessions)
- No personal data collection - only subreddit names
- Safe to use across all modern browsers

### Performance Optimizations
- Lazy loading: Images beyond first 12 are loaded on scroll (IntersectionObserver)
- API caching: Prevents redundant Reddit API calls
- History caching: localStorage reduces initial page interactions
- First 12 images load immediately for perceived performance

---

## Testing Checklist

Before deploying changes:
- [ ] Test on Chrome, Firefox, Safari, and Edge
- [ ] Test mobile responsiveness (iOS + Android)
- [ ] Verify search works with all 3 input formats
- [ ] Check that image loading works with lazy loading
- [ ] Confirm modal keyboard navigation (Escape, Arrow keys)
- [ ] Verify search history persists across page reloads
- [ ] Test with slow network (DevTools throttling) for UX

---

## Known Limitations & Future Improvements

**Current Limitations:**
1. Reddit API returns max 100 posts per request (pagination not implemented)
2. Private subreddits cannot be accessed
3. Some third-party hosted images may fail due to CORS
4. Video posts are filtered out (image-only gallery)

**Potential Enhancements:**
- Pagination support for browsing beyond top 100
- Search filtering by post score, comments, date
- Dark mode toggle
- Share gallery functionality
- Post title/metadata display in gallery view
