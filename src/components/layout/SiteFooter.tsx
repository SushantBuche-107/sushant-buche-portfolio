import { ArrowUp, Mail, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { GithubIcon, LinkedinIcon } from "@/components/ui/brand-icons";
import { Container } from "@/components/ui/container";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { getCopyrightYear } from "@/lib/format";
import {
  getFooterConfig,
  getLastUpdatedLabel,
  getPersonalProfile,
  getVisibleNavigation,
  getVisibleSocialLinks,
} from "@/lib/portfolio";
import { getSafeAssetUrl } from "@/lib/url";

const socialIcons = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  email: Mail,
  naukri: ExternalLink,
  leetcode: ExternalLink,
  twitter: ExternalLink,
  website: ExternalLink,
} as const;

export function SiteFooter(): React.ReactElement {
  const footer = getFooterConfig();
  const personal = getPersonalProfile();
  const navigation = getVisibleNavigation();
  const socials = getVisibleSocialLinks();
  const lastUpdated = getLastUpdatedLabel();
  const privacyUrl = getSafeAssetUrl(footer.privacyUrl);
  const shouldReduceMotion = usePrefersReducedMotion();
  const year = getCopyrightYear();

  const handleBackToTop = (): void => {
    window.scrollTo({
      top: 0,
      behavior: shouldReduceMotion ? "auto" : "smooth",
    });
  };

  return (
    <footer className="no-print relative mt-24 border-t border-line bg-background/60">
      <Container>
        <div className="grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-accent/30 bg-accent/15 font-display text-xs font-semibold tracking-wider text-indigo-100">
                {personal.initials || "SB"}
              </span>
              <span className="font-display text-sm font-semibold text-ink">
                {personal.name}
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-xs leading-relaxed text-ink-faint">
              {footer.note}
            </p>
            <p className="mt-3 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-ink-faint">
              {personal.location}
            </p>
          </div>

          <nav aria-label="Footer">
            <h2 className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-ink-faint">
              Navigate
            </h2>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5">
              {navigation.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="rounded-sm text-xs text-ink-muted transition-colors hover:text-ink"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-ink-faint">
              Connect
            </h2>
            {socials.length > 0 ? (
              <ul className="mt-4 space-y-2.5">
                {socials.map((social) => {
                  const Icon = socialIcons[social.key] ?? ExternalLink;
                  return (
                    <li key={social.key}>
                      <a
                        href={social.href}
                        target={social.key === "email" ? undefined : "_blank"}
                        rel={social.key === "email" ? undefined : "noopener noreferrer"}
                        className="inline-flex items-center gap-2 rounded-sm text-xs text-ink-muted transition-colors hover:text-ink"
                      >
                        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                        {social.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="mt-4 max-w-xs text-xs leading-relaxed text-ink-faint">
                Public profile links are being finalised. The resume and project
                case studies are available on this site.
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-line py-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.7rem] text-ink-faint">
            <span>
              © {year} {footer.copyrightName}. All rights reserved.
            </span>
            {lastUpdated ? (
              <span className="font-mono uppercase tracking-wider">
                Last updated {lastUpdated}
              </span>
            ) : null}
            {privacyUrl ? (
              <a
                href={privacyUrl}
                className="rounded-sm transition-colors hover:text-ink"
              >
                Privacy
              </a>
            ) : null}
          </div>

          {footer.showBackToTop ? (
            <button
              type="button"
              onClick={handleBackToTop}
              className="inline-flex items-center gap-2 self-start rounded-full border border-line-strong px-3 py-1.5 text-[0.7rem] text-ink-muted transition-colors hover:border-accent-cyan/40 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:self-auto"
            >
              Back to top
              <ArrowUp className="h-3 w-3" aria-hidden="true" />
            </button>
          ) : null}
        </div>
      </Container>
    </footer>
  );
}
