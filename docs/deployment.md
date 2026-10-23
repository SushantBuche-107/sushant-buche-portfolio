# Deployment

## Build

```bash
npm ci
npm run typecheck
npm test
npm run build
```

`npm run build` does three things:

1. Typechecks the project.
2. Generates `public/robots.txt` and, when configured, `public/sitemap.xml`.
3. Builds the static application into `dist/`.

Preview locally:

```bash
npm run preview
```

## Static hosting requirements

- Serve the contents of `dist/`.
- Rewrite unknown paths to `/index.html` so deep links such as `/projects/portfolio-platform` work on refresh.
- Serve `index.html` with a short cache lifetime (`no-cache` or `max-age=0, must-revalidate`).
- Serve `/assets/*` with long-lived immutable caching; Vite fingerprints filenames.
- Use HTTPS.
- Apply the security headers in `public/_headers` (Netlify) or `vercel.json` (Vercel), or reproduce them at the host/CDN.
- Do not add server-side secrets to the client bundle.

## Netlify

Included files:

- `public/_redirects`: `/* /index.html 200`
- `public/_headers`: security headers and asset caching

Configuration:

- Build command: `npm run build`
- Publish directory: `dist`
- Node version: 20.19+ or 22.12+ (set `NODE_VERSION` if the host default is older)

After deployment, verify a deep link directly, not just client-side navigation.

## Vercel

`vercel.json` includes:

- SPA rewrite to `/index.html`;
- immutable caching for `/assets/*`;
- security headers for all routes.

Framework preset: Vite. Build command: `npm run build`. Output directory: `dist`.

## Domain and SEO

Before the final domain is known, leave `site.domain` blank. The build will write robots.txt without a sitemap, omit canonical URLs, and use relative social image paths.

When the domain is final:

1. Set `site.domain` in `src/data/portfolioData.json`, for example `"example.com"` or `"https://example.com"`.
2. Update `site.contentUpdatedAt` if public content changed.
3. Run `npm run build`.
4. Confirm `public/sitemap.xml` and `dist/sitemap.xml` exist.
5. Confirm `robots.txt` points to the sitemap.
6. Deploy.
7. Submit the sitemap in Google Search Console and Bing Webmaster Tools if desired.

Do not commit a sitemap for a domain that is not live.

## Contact delivery

The default is `mode: "none"`. No form is rendered.

To enable a form endpoint:

1. Deploy a serverless function or service that accepts JSON `{ name, email, subject, message }`.
2. Validate every field server-side, enforce size limits, rate-limit by IP and/or account, and protect against spam.
3. Store only what is necessary, with a retention policy.
4. Configure `contact.mode: "endpoint"`, `contact.endpoint: "https://..."`, and `contact.enabled: true`.
5. Update `connect-src` in the Content Security Policy if the endpoint is not already allowed by `https:`.
6. Rebuild and test success, validation failure, network failure, and timeout behavior.

Mailto mode requires a valid configured email address and `showEmail: true`. It opens the visitor's email client and does not store anything.

## Post-deploy checklist

- [ ] Home page renders and the hero text is available before the 3D chunk.
- [ ] `/about`, `/skills`, `/projects`, `/experience`, `/resume`, `/blog`, `/contact` render.
- [ ] `/projects/portfolio-platform` loads directly on refresh.
- [ ] Unknown route shows the 404 page with `noindex`.
- [ ] `/robots.txt` is reachable; `/sitemap.xml` exists only if a domain is configured.
- [ ] Canonical, Open Graph, and Twitter tags point to the production origin.
- [ ] `/og-image.png`, favicons, manifest, and icons return 200.
- [ ] Project architecture SVG returns 200.
- [ ] Print preview from `/resume` is legible and hides site chrome.
- [ ] Mobile navigation traps focus and Escape closes it.
- [ ] Reduced-motion preference shows the static hero and the opt-in control.
- [ ] No console errors or failed network requests.
- [ ] Security headers are present in the response.
- [ ] Contact actions match configuration; no dead form or placeholder link is present.

## Rollback

Static deployments are immutable by build. To roll back, redeploy the previous successful build artifact or revert the content change and rebuild. If the contact endpoint is failing, set `contact.mode` to `"none"` and redeploy immediately rather than leaving a broken form online.
