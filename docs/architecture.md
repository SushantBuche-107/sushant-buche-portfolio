# Architecture

## Overview

The portfolio is a client-rendered React single-page application built by Vite. It has no runtime server component in the first release. Content is compiled into the JavaScript bundle from a single JSON file, while SEO files and raster assets are generated at build time.

```text
portfolioData.json
        |
        v
typed repository + selectors
        |
        +--> pages and shared components
        |        |
        |        +--> React Router routes (code-split)
        |        +--> lazy React Three Fiber hero
        |
        +--> runtime SEO metadata and JSON-LD
        |
        +--> build scripts -> robots.txt, sitemap.xml, images
```

## Layers

### Content source

`src/data/portfolioData.json` holds site configuration, profile, metrics, highlights, skills, projects, experience, education, certifications, resumes, resume configuration, articles, contact configuration, navigation, footer, and about content.

The JSON is cast to `PortfolioData` once in `src/lib/portfolio.ts`. TypeScript cannot validate JSON at runtime, so selectors and tests are the safety net. Keep `src/types/portfolio.ts` and the JSON shape in sync.

### Repository and selectors

`jsonPortfolioRepository` is a small repository adapter. Selectors expose only what the UI should see:

- navigation and skills filtered for visible names;
- published projects and articles;
- featured projects;
- resume variants with safe URLs;
- contact channels that respect `enabled`, `showEmail`, `showPhone`, and effective mode;
- related projects and articles;
- SEO helpers such as the configured site origin.

The boundary is intentionally shaped so a future CMS or API can replace the adapter without rewriting pages.

### URL safety boundary

`src/lib/url.ts` is the only place that decides whether an external, mailto, asset, or site URL is safe to render. It rejects `javascript:`, `data:`, protocol-relative URLs, invalid mailto addresses, and explicit non-HTTP schemes.

### Presentation

Pages live in `src/pages`. Shared components live under `src/components`:

- `layout`: header, mobile navigation, footer, skip link, scroll restoration, loader;
- `ui`: design-system primitives (buttons, cards, badges, fields, page header, empty state, reveal);
- `portfolio`: domain components (hero, project cards, filters, skills explorer, resume, recruiter hub);
- `three`: WebGL scene, fallback, lazy loader, error boundary;
- `forms`: contact form.

Components receive typed domain data and never read raw JSON.

### Design system

`src/styles/index.css` defines global tokens, card surfaces, prose styles, reduced-motion behavior, and print styles. Tailwind theme extensions in `tailwind.config.ts` define colors, display type scales, spacing, and motion.

## Routing and code splitting

`src/App.tsx` keeps the home page and 404 in the initial bundle. Every other page uses `React.lazy`, so project, resume, blog, and contact code is fetched on demand. `Suspense` renders a small loading state.

Project and article pages are real routes with stable URLs:

- `/projects/:slug`
- `/blog/:slug`

The 404 route is noindex. Unknown project or article slugs render the same 404 page.

`ScrollToTop` restores the top of the page on navigation and supports hash targets.

## SEO pipeline

`src/lib/seo.tsx` updates the document head at runtime:

- title and description;
- robots;
- theme color;
- Open Graph and Twitter metadata;
- canonical URL when `site.domain` is configured;
- structured data for `Person`, `WebSite`, `CreativeWork`, `Article`, `BreadcrumbList`, and `ItemList`.

`scripts/generate-seo.mjs` reads the same JSON at build time and writes:

- `public/robots.txt` always;
- `public/sitemap.xml` only when `site.domain` resolves to an HTTP(S) origin.

When the domain is blank, any stale sitemap is removed and canonical links are omitted. The site does not fabricate a production domain.

`scripts/generate-og.mjs` uses Sharp to create `og-image.png`, a 32px favicon PNG, a 180px Apple touch icon, and 192/512px manifest icons.

## 3D hero

`HeroVisual` decides whether the interactive scene is appropriate:

1. WebGL support is detected once.
2. The component waits for idle time or a short timeout.
3. Reduced-motion users see a static fallback with an explicit opt-in control.
4. The scene only mounts when the hero is in view.
5. `React.lazy` isolates Three.js and React Three Fiber in a separate chunk.
6. `SceneErrorBoundary` falls back to the static SVG if the scene fails.
7. `SceneFallback` reserves the same aspect-ratio space to prevent layout shift.

`HeroScene` uses a real Three.js canvas with capped device pixel ratio, no shadows, no post-processing, and pointer-based rotation. Particle placement is deterministic rather than randomly generated on every render.

## Markdown articles

`ArticlePage` uses React Markdown with GFM support, slug generation, and syntax highlighting. Headings are extracted with a matching `github-slugger` instance to build an in-page table of contents. Markdown links and images pass through the same URL safety helpers before rendering.

The blog supports articles but currently publishes none. The empty state is intentional.

## Print resume

`/resume` renders structured content in a light resume sheet. A print stylesheet hides navigation, page headers, actions, and dark surfaces, then applies page-break rules. If no PDF exists, the page offers Print / Save as PDF and explains that no file has been published.

## Empty and error states

The design treats missing content as a first-class state:

- no contact mode: no form, no fake success state;
- no social or resume URL: no button;
- no experience records: a background summary and an explicit verification note;
- no articles: a blog shell with planned themes;
- no project match: a clear filter empty state;
- WebGL unavailable: static SVG fallback;
- unknown route: noindex 404.

## Testing

Vitest and React Testing Library cover selectors, URL safety, contact validation, project filtering, skill tabs and search, contact-unavailable behavior, route rendering, project detail rendering, and the 404 page. See [`testing.md`](testing.md).

## Known constraints

- Content changes require a rebuild and redeploy.
- There is no server-side contact storage or spam protection beyond client validation and a honeypot. Any endpoint must implement server-side validation and rate limiting.
- Runtime SEO tags are not rendered for non-JavaScript crawlers. Search engines that execute JavaScript can read them; a future static-rendering or prerendering step would remove this limitation.
- The 3D chunk is intentionally the largest asset (about 937 kB raw, 249 kB gzip). It is loaded only after the hero is in view and WebGL is available.
