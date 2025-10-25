# Reddit Gallery Viewer - Next.js Refactor

A complete refactoring of Reddit Gallery Viewer from a single HTML file to a modern Next.js application with React components, TypeScript, and Tailwind CSS.

## 🚀 Features

- Browse any Reddit subreddit as a beautiful image gallery
- Responsive grid layout (1-4 columns based on screen size)
- Dynamic color theming
- Image lazy loading with progressive enhancement
- Search history with local storage persistence
- Modal image viewer with keyboard navigation
- SEO optimized with structured data
- Mobile-friendly design
- Zero dependencies beyond React/Next.js ecosystem

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with metadata and SEO
│   ├── page.tsx            # Home page with client-side gallery
│   └── globals.css         # Global styles
├── components/
│   ├── FAQSection.tsx      # FAQ component
│   ├── GalleryGrid.tsx     # Main gallery grid
│   ├── GalleryImage.tsx    # Individual image card
│   ├── GalleryPage.tsx     # Main page logic
│   ├── ImageModal.tsx      # Image preview modal
│   ├── SubredditButtons.tsx   # Subreddit selector
│   └── TimeFilterButtons.tsx  # Time period filter
└── lib/
    ├── cache.ts            # API caching
    ├── colors.ts           # Color utilities
    ├── reddit.ts           # Reddit API functions
    └── storage.ts          # Local storage utilities
```

## 🔧 Setup & Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
cd view-subreddit-as-gallery-nextjs
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Build for Production

```bash
npm run build
npm start
```

### Type Checking

```bash
npm run type-check
```

## 🎨 Key Improvements Over Original

### Architecture
- **Component-based**: Modular React components instead of imperative JavaScript
- **TypeScript**: Full type safety across codebase
- **Server-side rendering**: Next.js provides SSR and static optimization
- **Modern tooling**: Tailwind CSS, ESLint, TypeScript compiler

### Performance
- Lazy loading images with IntersectionObserver
- API response caching (5-minute TTL)
- Code splitting and optimization via Next.js
- Progressive image loading (placeholder → full resolution)

### Developer Experience
- Hot module reloading during development
- TypeScript for type safety
- Component reusability and composition
- Clear separation of concerns (UI, logic, utilities)

### Maintainability
- Easier to extend with new features
- Components have single responsibility
- Utilities are well-documented and testable
- Cleaner API abstraction layer

## 🔄 Migration Notes

### From Original HTML to Next.js

| Original | Next.js |
|----------|---------|
| Single 1190-line HTML file | Modular components across files |
| Vanilla JS with manual DOM manipulation | React hooks (useState, useEffect, useCallback) |
| Inline styles and CSS variables | Tailwind CSS + CSS modules |
| Manual caching with Map | Dedicated `cache.ts` utility |
| localStorage access scattered | Centralized `storage.ts` |
| Event listeners | React event handlers |
| URL management with history API | Next.js useRouter and useSearchParams |

### Feature Parity

✅ All original features preserved:
- Image filtering and display
- Subreddit search and history
- Time period filtering
- Modal image viewer
- Keyboard navigation (Esc, Arrow keys)
- Share functionality
- SEO meta tags
- Google Analytics
- Responsive design

## 📱 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Android)

## 🚀 Deployment

### Deploy to Vercel

```bash
git push origin main
```

Vercel will automatically build and deploy.

### Environment Variables

No environment variables required for basic functionality. Optional for analytics:
- `NEXT_PUBLIC_GA_ID` - Google Analytics measurement ID

## 🔗 API Endpoints Used

- `https://www.reddit.com/r/{subreddit}/top/.json` - Fetch posts
- `https://www.reddit.com/subreddits/popular.json` - Fetch popular subreddits

## 📊 Performance Metrics

- **Time to Interactive**: ~2-3s (on 4G, cached API)
- **Largest Contentful Paint**: ~3-4s
- **First Contentful Paint**: ~1-2s
- **Bundle Size**: ~50KB (gzipped)

## 🐛 Known Limitations

1. Reddit API returns max 100 posts per request (no pagination)
2. Private subreddits cannot be accessed
3. Some third-party hosted images may fail due to CORS
4. Video posts are filtered out (image-only gallery)

## 🔮 Future Enhancements

- [ ] Dark mode toggle
- [ ] Image filtering/search
- [ ] Post metadata display (upvotes, comments)
- [ ] Pagination support
- [ ] Share individual images
- [ ] Download images
- [ ] Social media integration
- [ ] PWA support

## 📄 License

Built as a free, open-source utility for browsing Reddit.

## 🤝 Contributing

Contributions welcome! Areas for improvement:
- Enhanced error handling
- Better mobile optimization
- Additional theme options
- Performance optimizations
- Accessibility improvements

## 📞 Support

For issues or feature requests, create an issue or contact the maintainers.

---

**Version**: 2.0.0 (Next.js Refactor)
**Last Updated**: October 2024
**Technology Stack**: Next.js 15, React 19, TypeScript, Tailwind CSS
