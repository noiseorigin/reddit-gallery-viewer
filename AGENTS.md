# Repository Guidelines

This static app ships from a single HTML entry point; keep updates focused and document any new workflow succinctly.

## Project Structure & Module Organization
- `index.html` combines markup, Tailwind CDN setup, inline CSS, and all JavaScript for fetching Reddit data and controlling the gallery.
- `robots.txt`, `sitemap.xml`, and `google*.html` handle SEO or verification; edit them only when domain settings change.
- `vercel.json` copies assets into `public/` and sets security headers; update its build command whenever you add deployable files.
- `CLAUDE.md` stores prior agent context—align changes here whenever instructions diverge.

## Build, Test, and Development Commands
- Local preview: `open index.html` (macOS) or `python3 -m http.server 8000` and visit `http://localhost:8000`. Run one after any asset-path change.
- Hosted preview: `vercel dev` mirrors the production headers and redirects configured in `vercel.json`; use it before pushing deploys.

## Coding Style & Naming Conventions
- Indent with two spaces in HTML, CSS, and JavaScript. Prefer `const`/`let` and camelCase helpers (`fetchImages`, `getTextColorForBackground`).
- IDs and data attributes use kebab-case (`custom-subreddit-btn`); keep new identifiers descriptive and consistent.
- Tailwind utility strings are grouped by layout → spacing → color. For large edits, format with `npx prettier@latest index.html --parser html`.

## Testing Guidelines
- No automated tests exist. Manually clear `localStorage` between runs to verify history caching behaves as expected.
- Exercise every search input style (plain name, `r/slug`, full Reddit URL), each time filter, modal navigation, and offline retry states.
- Check responsive breakpoints through browser dev tools, noting issues and reproduction steps in the pull request.

## Commit & Pull Request Guidelines
- Follow Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`) with concise scopes and explanatory bodies when behaviour changes.
- PRs should include a summary, testing notes (commands/devices), linked issues, and screenshots or recordings for UI changes.
- Wait for a green Vercel preview and reviewer sign-off before merging or promoting to production.

## Deployment & Configuration Tips
- `vercel --prod` publishes the `public/` directory produced by the custom build; ensure new assets are copied during that step.
- When enabling Analytics or AdSense snippets, un-comment them alongside documentation updates in `README.md` and this guide.
