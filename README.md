# Sushant Buche — Portfolio Platform

A dark-first portfolio for Sushant Buche, a Full Stack .NET Developer. The site presents verified experience through detailed case studies, a recruiter-focused resume, a skills explorer, and an interactive React Three Fiber hero.

The first release is a static React single-page application. All public content comes from one typed JSON source; there is no CMS, application backend, or database.

## Current release status

- All public routes are implemented: home, about, skills, projects, project case studies, experience, resume, blog, contact, and 404.
- Nine published case studies and five technical articles are available.
- Contact, social profiles, employer history, education, and project content are populated from verified information. Resume files remain unavailable until a real PDF is supplied.
- `npm run typecheck`, `npm run lint`, `npm test` (24 tests), `npm run test:e2e`, and `npm run build` pass.
- The Playwright suite covers Chrome, Edge, Chromium, Firefox, and WebKit at mobile, tablet, laptop, and desktop widths.
- A sitemap is intentionally skipped until `site.domain` is configured.

## Stack

| Layer | Choice |
| --- | --- |
| Framework | React 19 + TypeScript 5.9 (strict) |
| Build | Vite 8 |
| Routing | React Router 7 |
| Styling | Tailwind CSS 3.4 with custom design tokens |
| Motion | Framer Motion 14 |
| 3D | Three.js, React Three Fiber, Drei |
| Markdown | React Markdown, remark-gfm, rehype-slug, rehype-highlight |
| Tests | Vitest 5, React Testing Library, jsdom |
| Assets | Sharp for Open Graph and icon generation |

## Getting started

Requirements: Node.js 20.19+ or 22.12+ (developed on Node 24) and npm.

```bash
npm install
npm run dev
```

The dev server prints the local URL. Production output is written to `dist/`.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run typecheck` | Run TypeScript without emitting |
| `npm run lint` | Run ESLint |
| `npm test` | Run the unit test suite once |
| `npm run test:watch` | Run unit tests in watch mode |
| `npm run test:e2e` | Build and run cross-browser responsive tests |
| `npm run build` | Typecheck, generate SEO files, and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run seo` | Generate `robots.txt` and, when configured, `sitemap.xml` |
| `npm run assets` | Regenerate the Open Graph image and icon PNGs |

## Content

The single source of truth is [`src/data/portfolioData.json`](src/data/portfolioData.json), typed by [`src/types/portfolio.ts`](src/types/portfolio.ts) and read through selectors in [`src/lib/portfolio.ts`](src/lib/portfolio.ts). Pages do not import the JSON directly.

Start with [`docs/content-management.md`](docs/content-management.md) before changing content. The most important rules are:

- Never invent employers, dates, degrees, certifications, metrics, project ownership, testimonials, or outcomes.
- Leave a value blank until it is verified. The UI is designed to hide unconfigured actions.
- Replace `/og-image.png`, `/projects/portfolio-architecture.svg`, and resume files only with real, appropriate assets.
- Set `site.domain` only when the production domain is known. Canonical URLs and the sitemap depend on it.

## Routes

| Route | Page |
| --- | --- |
| `/` | Home and recruiter overview |
| `/about` | Background, principles, domains, and focus |
| `/skills` | Searchable, keyboard-accessible skill explorer |
| `/projects` | Case study index with URL-synced filters |
| `/projects/:slug` | Project case study |
| `/experience` | Experience, education, and credentials |
| `/resume` | Print-ready resume generated from content |
| `/blog` | Blog shell with tag filtering |
| `/blog/:slug` | Markdown article with table of contents |
| `/contact` | Configured contact channels and form |
| `*` | Noindex 404 |

## Deployment

The build is static. Netlify and Vercel configuration are included (`public/_redirects`, `public/_headers`, `vercel.json`). See [`docs/deployment.md`](docs/deployment.md) for the full checklist, including SPA fallback, security headers, domain setup, and post-deploy verification.

## Documentation

- [Architecture](docs/architecture.md)
- [Content management](docs/content-management.md)
- [Deployment](docs/deployment.md)
- [Security](docs/security.md)
- [Testing and quality](docs/testing.md)
- [Release report](docs/release-report.md)
