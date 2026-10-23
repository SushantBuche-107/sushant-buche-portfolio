# Security

## Scope and threat model

This is a static portfolio with no authentication, database, or server-side application code. The realistic risks are:

- unsafe links or images being rendered from content;
- a contact endpoint being abused or leaking data;
- third-party dependency compromise;
- clickjacking, MIME sniffing, or referrer leakage;
- accidental publication of confidential employer or customer information;
- misleading contact behavior (for example, a form that appears to send but cannot).

The site does not process payments, store user accounts, or collect analytics.

## URL handling

`src/lib/url.ts` is the security boundary for rendered destinations:

- external links allow only `http:` and `https:`;
- mailto links require a syntactically valid email address;
- protocol-relative URLs (`//host`) are rejected;
- asset paths are restricted to root-relative paths or HTTP(S) URLs;
- explicit non-HTTP schemes are rejected, including when used as a site domain;
- site domains are normalized to an HTTP(S) origin.

Markdown links and images pass through the same helpers. Internal Markdown links may use root-relative paths or hash anchors.

Content editors must still avoid publishing untrusted URLs. Validation reduces risk; it does not make arbitrary third-party content trustworthy.

## Contact data

Default behavior: no form is shown and no data is collected.

If `mailto` mode is enabled:

- the visitor's email client handles delivery;
- nothing is stored by the site;
- the configured address must be intentionally public.

If `endpoint` mode is enabled:

- the browser sends JSON `{ name, email, subject, message }` with `credentials: "omit"`;
- the endpoint must require HTTPS and be operated by a trusted party;
- the endpoint must validate and sanitize all fields, enforce length limits, rate-limit, and block spam;
- the endpoint must define retention, access control, and deletion behavior;
- do not log full message bodies or personal data unnecessarily;
- return generic errors to clients and keep diagnostic detail server-side.

Client-side validation, the honeypot, and the minimum-submit-time check are usability and basic spam signals, not security controls. An attacker can bypass all of them.

## Secrets and build output

- No API keys, tokens, or private credentials belong in this repository or the client bundle.
- Vite exposes variables prefixed with `VITE_` to the browser. Do not put secrets in them.
- The contact endpoint URL is public configuration, not a secret.
- Build output is static and fully inspectable; assume every string shipped is public.

## Security headers

Headers are defined in `public/_headers` for Netlify and `vercel.json` for Vercel:

- `Content-Security-Policy`: restricts scripts to same-origin, allows inline styles required by the UI and animation layer, allows images from self/data/blob, restricts frames, objects, and form actions, and upgrades insecure requests.
- `Strict-Transport-Security`: one year. Add `includeSubDomains` only when every subdomain is HTTPS.
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy`: camera, microphone, and geolocation disabled.
- `Cross-Origin-Opener-Policy: same-origin`

If you add third-party scripts, fonts, analytics, or a contact endpoint on a different origin, update the CSP deliberately. Do not add broad `unsafe-eval` or `*` allowances without a documented reason.

The site uses self-hosted font files, so no third-party font origin is required.

## Dependency and supply chain

- Keep dependencies current and review major upgrades, especially Three.js, React Three Fiber, React Router, and React Markdown.
- Run `npm audit` as part of periodic maintenance. Treat findings in context; a dev-only advisory may not affect production output, but verify.
- As of the release report, `npm audit --omit=dev` reports zero production vulnerabilities. The full development tree reports 7 advisories (5 high, 2 moderate) in the Tailwind 3 build-time chain (`braces` and `postcss-selector-parser`). These packages are not shipped to browsers. The available automated fix is a breaking Tailwind 4 migration; it should be planned and verified rather than applied with `--force` before a release.
- Commit `package-lock.json` and use `npm ci` in CI/deployment.
- Avoid adding packages for small utilities that can be written locally.

## Content confidentiality

The most important control for this project is editorial:

- never publish employer names, client names, internal architecture, proprietary code, customer data, or business rules without permission;
- generalize diagrams and examples;
- keep case studies focused on personal projects or explicitly shareable work;
- review screenshots and images for identifying information;
- do not invent security claims, compliance status, or certifications.

## Reporting and maintenance

If a vulnerability is suspected, take the affected deployment offline or disable the relevant feature (for example, set `contact.mode` to `"none"`) before investigating. Rebuild and redeploy after the fix, and rotate any exposed credential outside this repository.
