# Content management

## Source of truth

Edit [`src/data/portfolioData.json`](../src/data/portfolioData.json). The shape is defined by [`src/types/portfolio.ts`](../src/types/portfolio.ts). Components read content through [`src/lib/portfolio.ts`](../src/lib/portfolio.ts), not directly from the JSON.

After editing, run:

```bash
npm run typecheck
npm test
npm run build
```

## Accuracy rules

This portfolio is designed to stay credible:

- Do not invent employers, roles, dates, degrees, certifications, metrics, client names, testimonials, user counts, or outcomes.
- Do not turn team work into sole ownership unless that is accurate.
- Leave fields blank until they are verified.
- Do not add placeholder social links, resume files, or contact details.
- Do not publish employer-confidential architecture, code, customer data, or business rules.
- Prefer concrete constraints, decisions, and trade-offs over marketing language.

## Site configuration

```json
"site": {
  "title": "Sushant Buche | Software Engineer",
  "shortTitle": "Sushant Buche",
  "domain": "",
  "defaultDescription": "...",
  "defaultOgImage": "/og-image.png",
  "locale": "en_IN",
  "themeColor": "#0B0F17",
  "keywords": ["..."],
  "heroTechnologies": ["..."],
  "showLastUpdated": true,
  "contentUpdatedAt": "2026-10-22"
}
```

Set `domain` only when the production domain is final, for example `"sushantbuche.dev"` or `"https://sushantbuche.dev"`. This enables canonical URLs and sitemap generation. Leaving it blank is safer than guessing.

`contentUpdatedAt` is used as the sitemap `lastmod` for static pages. Update it when public content changes materially.

## Personal profile and availability

`personal` includes name, titles, tagline, bio, location, timezone, initials, profile image, resume URL, availability, and social links.

- `availability.show` must be `false` unless the label is accurate and current.
- `profileImage` may be blank. The UI does not show a broken avatar.
- `resumeUrl` may be blank. Resume actions then hide or fall back to `/resume`.
- Social values accept full `https://` URLs. The UI validates them before rendering.
- Email and phone are only shown when `contact.enabled` and the relevant `showEmail` / `showPhone` flag are true.

## Metrics and highlights

`metrics` are shown on the home hero summary and about page. Use only verified values. The current experience value is an approximation and is labelled that way.

`highlights` use `show: false` until the statement is true. Supported tones are `accent`, `success`, `warning`, and `neutral`.

## Skills

Each category has an `id`, `name`, `description`, and `items`. Items may include:

- `description`;
- `focus`: `core`, `working`, or `exploring`;
- `relatedProjects`: project slugs used to link back to case studies.

Do not add percentage proficiency scores. The skills page explains why.

## Projects

A project is published when `status` is `"published"` and slug, title, and summary are non-empty. Recommended fields:

```json
{
  "slug": "stable-url-slug",
  "title": "Project title",
  "summary": "One or two sentences for cards and metadata.",
  "description": "Longer overview for the case study.",
  "role": "Your actual role",
  "timeline": "2026",
  "categories": ["Personal Projects", "Full Stack"],
  "technologies": ["C#", "ASP.NET Core"],
  "featured": true,
  "status": "published",
  "links": { "live": "", "github": "", "caseStudy": true },
  "problem": "...",
  "goals": ["..."],
  "constraints": ["..."],
  "contribution": ["..."],
  "architecture": "...",
  "architectureImage": "/projects/example.svg",
  "architectureImageAlt": "Describe the diagram",
  "dataFlow": ["..."],
  "apiDesign": ["..."],
  "databaseDesign": ["..."],
  "decisions": [{ "title": "...", "detail": "..." }],
  "security": ["..."],
  "performance": ["..."],
  "challenges": [{ "title": "...", "detail": "..." }],
  "tradeoffs": ["..."],
  "testing": ["..."],
  "results": ["..."],
  "lessons": ["..."],
  "relatedSlugs": ["other-project"],
  "gallery": [{ "src": "/images/example.png", "alt": "...", "caption": "..." }],
  "codeSnippets": [{ "title": "...", "language": "ts", "caption": "...", "code": "..." }]
}
```

Optional sections only render when data exists. Keep links blank when there is no public URL; no disabled buttons are shown.

Images under `public/` use root-relative paths such as `/projects/diagram.svg`. External images must use HTTPS. Every image needs meaningful alt text, or blank alt text only when it is purely decorative.

## Articles

Published articles require `published: true`, a slug, title, summary, publication date, and body. The body is Markdown.

Supported Markdown features include headings, lists, tables, blockquotes, fenced code blocks, links, and images. `##` and `###` headings feed the table of contents. Code fences are syntax-highlighted when a language is provided.

```json
{
  "slug": "designing-a-safe-contact-form",
  "title": "Designing a safe contact form without a backend",
  "summary": "What to render when the delivery path does not exist yet.",
  "body": "## The problem\n\n...",
  "publicationDate": "2026-11-01",
  "tags": ["Web", "Security"],
  "coverImage": "/blog/contact-form.png",
  "coverAlt": "Diagram of a contact form validation flow",
  "published": true,
  "readingTimeMinutes": 6
}
```

Add real covers only when available. Articles without covers use a designed placeholder. Do not add future-dated or draft articles just to fill the page; drafts are filtered by `published`.

## Experience, education, and certifications

`experience` is currently empty because verified public employer records were not provided. When adding records, use real employer names, roles, dates, and summaries. The resume and experience page both read from this collection.

`education` and `certifications` are also empty. Add only completed, verifiable qualifications and credentials. Optional credential URLs must be complete HTTPS URLs.

## Resume

`resumes` is a list of downloadable variants:

```json
{
  "id": "general",
  "label": "General resume",
  "url": "/resume/sushant-buche.pdf",
  "description": "General full-stack .NET resume.",
  "isDefault": true,
  "updatedAt": "2026-10-22"
}
```

Place files under `public/resume/`. If no PDF exists, keep `resumes` empty and use the print-ready `/resume` page. The print page reads the same content as the rest of the site, so it never goes stale.

`resume.summary` is the professional summary used on the resume sheet. `resume.downloadNote` explains why no file is available.

## Contact

Current configuration deliberately disables delivery:

```json
"contact": {
  "enabled": true,
  "showEmail": false,
  "showPhone": false,
  "mode": "none",
  "endpoint": "",
  "bookingUrl": ""
}
```

Modes:

- `none`: no form, no email link, no fake success.
- `mailto`: opens the visitor's email client. Requires a valid configured email and `showEmail: true`.
- `endpoint`: POSTs JSON to a configured HTTPS endpoint. The client also requires a valid endpoint URL.

For an endpoint, the payload is `{ name, email, subject, message }`. Client validation is not a security boundary. The endpoint must validate, rate-limit, and protect against abuse. See [`security.md`](security.md).

`bookingUrl` must be an HTTPS URL. Social profiles are rendered only when configured and valid.

## Navigation and footer

Navigation entries have `label`, `to`, and `show`. Hidden items disappear from the header, mobile navigation, and footer. The footer copyright name, back-to-top flag, optional privacy URL, and note are configurable.

The privacy URL must be a valid asset path or HTTPS URL. If there is no privacy policy, leave it blank.

## Images and generated assets

- `public/og-image.png` is 1200×630.
- `public/icons/apple-touch-icon.png` is 180×180.
- `public/icons/icon-192.png` and `icon-512.png` support the web manifest.
- `public/favicon.svg` is the scalable favicon.
- Regenerate PNG assets with `npm run assets` after editing the generator.

Project diagrams should be legible at mobile width, use the site palette, avoid text smaller than roughly 11px at 1200px width, and include a title/description for accessibility when used as an image.

## Publication checklist

1. Every claim is verified and appropriate to publish.
2. No employer-confidential or customer data is present.
3. Every visible link and download works.
4. No empty section is filled with invented content.
5. Project and article slugs are stable.
6. Images exist and have useful alt text.
7. `site.domain` is either correct or intentionally blank.
8. Run `npm run typecheck`, `npm test`, `npm run lint`, and `npm run build`.
9. Preview `/`, `/projects`, `/projects/portfolio-platform`, `/resume`, `/contact`, and a deep-link refresh.
10. Check mobile width, keyboard navigation, reduced motion, and print output.
