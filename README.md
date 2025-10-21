# Reddit Gallery Viewer 🎨

A free online tool to browse any Reddit subreddit as a beautiful image gallery. Features dynamic theme colors, lazy loading, and responsive design.

## ✨ Features

### Core Features
- 🖼️ **Gallery View** - Convert Reddit posts into beautiful image grids
- 🎨 **Reddit Official Colors** - Consistent orange (#FF4500) branding
- 🔍 **Flexible Search** - Multiple input formats:
  - Direct name: `photography`
  - Reddit URL: `https://reddit.com/r/photography`
  - Short format: `r/photography`
- ⏱️ **Time Filter** - Browse today's, this week's, or this month's top content
- 💾 **Search History** - Recently viewed subreddits cached locally
- 📱 **Responsive Design** - Perfect support for mobile, tablet, and desktop
- ⚡ **Fast Loading** - Image lazy loading + API caching (5 minutes)
- 🎯 **Modal Preview** - Full-screen image preview with keyboard navigation

### Popular Subreddits
Pre-configured quick access to popular communities:
- 📸 Photography
- 🌍 Nature (EarthPorn)
- 🐱 Cats (CatsStandingUp)
- 🏠 Interior Design
- 🎨 Art
- 🍕 Food (FoodPorn)
- 🌱 Houseplants

### Developer-Friendly
- ✅ Single HTML file, no build tools needed
- ✅ Fully client-side application, no backend required
- ✅ Fully optimized for SEO
- ✅ Google AdSense ready
- ✅ Google Analytics ready

---

## 🚀 Quick Start

### Local Preview
```bash
# Open directly in browser
open index.html

# Or use Python simple server
python3 -m http.server 8000
# Then visit http://localhost:8000
```

### Deploy to Vercel
1. Push to GitHub
2. Import at https://vercel.com/new
3. Auto-deployment on every push

---

## 🔧 Tech Stack

- **Frontend**: Vanilla JavaScript (ES6+)
- **Styling**: Tailwind CSS (CDN)
- **Fonts**: Google Fonts (Inter)
- **API**: Reddit API (public endpoints, no auth required)
- **Deployment**: Vercel

---

## 🛡️ Security

- ✅ No personal data collection
- ✅ No cookies stored
- ✅ All requests via HTTPS
- ✅ CORS compliant
- ✅ Reddit ToS compliant

---

## 🐛 Known Limitations

1. **Reddit API Rate Limit** - 60 requests per minute per IP
   - Solution: Built-in 5-minute cache

2. **Private Subreddits** - Cannot access private communities
   - Reddit API limitation

3. **Third-party Hosted Images** - Some images may not load
   - CORS restriction

---

## 📱 Browser Support

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

---

## ⚡ Performance Metrics

- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1
- **Image Loading**: Lazy load + cache
- **API Response**: 5-minute cache

---

## 📄 License

MIT License - Free to use and modify

---

## 🙏 Acknowledgments

- Reddit API community
- Tailwind CSS
- Vercel deployment platform

---

**Status**: ✅ Production Ready

**Last Updated**: October 2024
