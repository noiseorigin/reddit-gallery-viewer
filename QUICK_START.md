# Quick Start Guide

## 🚀 Get Started in 3 Minutes

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 3. Start Developing
Edit files in `src/components` and `src/lib/` - changes auto-refresh!

## 📁 Key Files to Know

- **src/components/GalleryPage.tsx** - Main app logic
- **src/lib/reddit.ts** - Reddit API calls
- **src/app/layout.tsx** - SEO metadata
- **tailwind.config.ts** - Theme colors

## 🎯 Common Tasks

### Add a New Component
```typescript
// src/components/MyComponent.tsx
export function MyComponent({ prop }) {
  return <div>{prop}</div>;
}
```

### Update Theme Colors
Edit `tailwind.config.ts`:
```typescript
colors: {
  reddit: {
    orange: '#FF4500', // Change here
  }
}
```

### Change Reddit API Endpoint
Edit `src/lib/reddit.ts`:
```typescript
export function buildApiUrl(subreddit, time) {
  // Modify URL here
}
```

### Add to Search History
Edit `src/lib/storage.ts`:
```typescript
export function addToSearchHistory(subreddit) {
  // Customize history logic
}
```

## 📚 Project Structure at a Glance

```
src/
├── app/              # Next.js App Router
│   ├── layout.tsx    # Root layout + SEO
│   ├── page.tsx      # Home page
│   └── globals.css   # Global styles
├── components/       # React components
│   ├── GalleryPage.tsx       # Main container
│   ├── GalleryGrid.tsx       # Grid layout
│   ├── GalleryImage.tsx      # Image card
│   ├── ImageModal.tsx        # Modal viewer
│   ├── SubredditButtons.tsx  # Subreddit buttons
│   ├── TimeFilterButtons.tsx # Time filters
│   └── FAQSection.tsx        # FAQ
└── lib/             # Utilities
    ├── reddit.ts    # Reddit API
    ├── cache.ts     # Caching
    ├── colors.ts    # Color utils
    └── storage.ts   # LocalStorage
```

## 🔗 Important Links

- [Next.js Docs](https://nextjs.org/docs)
- [React Hooks](https://react.dev/reference/react)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Reddit API](https://www.reddit.com/dev/api)

## 💡 Tips

1. **Hot Reload**: Changes auto-reload thanks to Next.js
2. **Type Safety**: TypeScript catches errors before runtime
3. **Mobile Testing**: `npm run dev` works on localhost network
4. **Production Build**: `npm run build && npm start`
5. **Linting**: `npm run lint` checks code quality

## 🐛 Troubleshooting

### Port Already in Use
```bash
npm run dev -- -p 3001  # Use port 3001 instead
```

### Clear Cache
```bash
rm -rf .next node_modules
npm install
npm run dev
```

### TypeScript Errors
```bash
npm run type-check  # See all type errors
```

## 📋 Checklist Before Deploying

- [ ] `npm run build` completes without errors
- [ ] `npm run type-check` shows no errors
- [ ] Test on mobile device
- [ ] Test subreddit search with various formats
- [ ] Test modal keyboard navigation (Esc, arrows)
- [ ] Test time filters work correctly
- [ ] Check console for JavaScript errors
- [ ] Verify search history persists across reloads

## 🚀 Deploy to Vercel

```bash
git add .
git commit -m "Refactor to Next.js"
git push origin main
```

Vercel auto-deploys on push!

## ❓ Questions?

Check:
1. README.md for feature list
2. MIGRATION_GUIDE.md for architecture details
3. Code comments in src/ files

---

**Happy Coding!** 🎉
