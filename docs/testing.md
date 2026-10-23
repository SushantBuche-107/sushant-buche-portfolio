# Testing and quality

## Automated checks

```bash
npm run typecheck
npm run lint
npm test
npm run test:e2e
npm run build
```

Current status: typecheck passes, lint passes with zero errors and zero warnings, 24 unit tests pass across 6 files, the production build succeeds, and the cross-browser suite passes 100 checks across Chrome, Edge, Chromium, Firefox, and WebKit at five viewport sizes.

## Test coverage

The suite focuses on behavior that can break credibility or usability:

### Content selectors (`tests/portfolio.test.ts`)

- published projects are complete and correctly filtered;
- featured ordering and slug lookup;
- skills expose named items;
- published experience and articles are returned without inventing a resume file;
- the configured email contact channel is exposed.

### URL safety (`tests/url.test.ts`)

- HTTP and HTTPS links accepted;
- `javascript:`, `data:`, protocol-relative, relative external, and invalid mailto values rejected;
- assets restricted to root-relative or HTTP(S);
- site domain normalization, including rejection of explicit non-HTTP schemes;
- external-link detection.

### Contact validation (`tests/validation.test.ts`)

- trimming and case normalization;
- required, length, and email validation;
- honeypot detection;
- safe line-break preservation;
- mailto encoding;
- minimum submission time.

### Projects (`tests/projects.test.tsx`)

- project search and URL-synced filtering;
- result count;
- intentional empty state;
- clearing filters restores results.

### Skills and contact (`tests/skills-contact.test.tsx`)

- category tab selection;
- search empty state;
- the mailto contact form renders labelled fields and the published email address.

### Routes (`tests/routes.test.tsx`)

- home heading and primary action;
- lazy-loaded about page;
- project case study heading, architecture section, and diagram alt text;
- unknown route renders the 404 page.

### Cross-browser responsive UX (`e2e/responsive.spec.ts`)

The Playwright suite runs the production build against:

- Chromium;
- installed Google Chrome;
- installed Microsoft Edge;
- Firefox;
- WebKit, the closest automated equivalent to Safari on Windows.

Each engine is checked at 320×568, 390×844, 768×1024, 1366×768, and 1920×1080. The suite covers:

- all public routes plus the 404 route;
- exactly one visible `h1`, correct page title, and loaded fonts;
- no page-level horizontal overflow before or after scrolling;
- no unloaded images;
- no page errors or console errors;
- compact navigation focus handling, Escape close, focus restoration, and route navigation;
- desktop navigation;
- project filters and skill search;
- contact form labels and the mailto email link.

Real Safari and iOS Safari cannot run natively on Windows. Use a physical Apple device or a hosted device farm for final Safari sign-off.

Run the suite with:

```bash
npm run test:e2e
```

The command builds the site, starts `vite preview`, and writes an HTML report to `playwright-report/`. Screenshots, video, and traces are retained only for failures under `test-results/`.

## Setup

`tests/setup.ts` installs jest-dom matchers, cleans up after each test, provides a `matchMedia` stub, stubs `scrollTo`, and prevents jsdom canvas warnings by returning `null` from `getContext`. This keeps the WebGL hero on its static fallback path in tests without importing the three.js bundle.

## Manual release checks

Automated tests do not replace visual and assistive-technology checks. Before a public release:

1. Test at 320px, 768px, 1024px, and 1440px widths.
2. Tab through the header, mobile navigation, project filters, skills tabs, forms, and footer.
3. Confirm the mobile dialog traps focus, closes on Escape, and restores focus to the trigger.
4. Confirm visible focus styles on links, buttons, inputs, tabs, and cards.
5. Enable reduced motion; confirm the hero does not animate and the opt-in control works.
6. Disable WebGL or use a browser without it; confirm the static fallback and explanatory caption.
7. Print `/resume`; confirm site chrome is hidden, text is legible, and sections do not split badly.
8. Refresh a deep link (for example `/projects/portfolio-platform`) on the deployed host.
9. Check the browser console and network panel for errors, failed assets, and unexpected third-party requests.
10. Check the document head on each route: title, description, robots, canonical (when configured), and structured data.
11. Confirm every visible action works; nothing should be a placeholder or dead button.
12. Verify no confidential employer or customer information appears in text, images, metadata, or code snippets.

## Performance checks

- The hero text should be readable before the 3D chunk loads.
- The 3D scene should not mount when the hero is off-screen or reduced motion is enabled.
- Keep the home route usable on a throttled connection; the 3D chunk is intentionally deferred.
- Confirm long-cache headers on fingerprint assets and revalidation on `index.html`.
- Review bundle changes when adding a dependency. The 3D chunk is expected to be the largest asset.

## Accessibility expectations

- One `h1` per page and a logical heading order.
- Landmarks: header, navigation, main, footer.
- Skip link to `#main-content`.
- All images have appropriate alt text.
- Form fields have labels, error associations, and focus management.
- Tab lists support arrow keys, Home, and End.
- Empty states explain what is missing and offer a next action.
- Reduced-motion support is honored globally and in the 3D hero.
