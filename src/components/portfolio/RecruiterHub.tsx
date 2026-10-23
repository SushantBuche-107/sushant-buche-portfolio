import {
  ArrowUpRight,
  CalendarClock,
  Cpu,
  Download,
  ExternalLink,
  FileText,
  FolderKanban,
  Mail,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  GithubIcon,
  LinkedinIcon,
  type IconComponent,
} from "@/components/ui/brand-icons";
import { Container } from "@/components/ui/container";
import type { SocialLink } from "@/lib/portfolio";
import {
  getContactChannels,
  getResumeUrl,
  getVisibleSocialLinks,
} from "@/lib/portfolio";
import { isExternalHref } from "@/lib/url";

interface HubAction {
  key: string;
  label: string;
  description: string;
  to?: string;
  href?: string;
  download?: boolean;
  icon: IconComponent;
}

const socialDescriptions: Record<SocialLink["key"], string> = {
  linkedin: "Professional profile and experience.",
  github: "Code, repositories, and experiments.",
  naukri: "Recruiter-facing profile.",
  leetcode: "Problem-solving practice.",
  twitter: "Occasional technical notes.",
  website: "Personal website.",
  email: "Start a direct conversation.",
};

const socialIcons: Record<SocialLink["key"], IconComponent> = {
  linkedin: LinkedinIcon,
  github: GithubIcon,
  naukri: ExternalLink,
  leetcode: ExternalLink,
  twitter: ExternalLink,
  website: ExternalLink,
  email: Mail,
};

export function RecruiterHub(): React.ReactElement {
  const resumeUrl = getResumeUrl();
  const channels = getContactChannels();
  const socials = getVisibleSocialLinks();

  const actions: HubAction[] = [];

  if (resumeUrl) {
    actions.push({
      key: "resume-download",
      label: "Download resume",
      description: "A concise overview of experience and technical focus.",
      href: resumeUrl,
      download: true,
      icon: Download,
    });
  } else {
    actions.push({
      key: "resume-view",
      label: "View resume",
      description: "A print-friendly overview generated from current content.",
      to: "/resume",
      icon: FileText,
    });
  }

  actions.push(
    {
      key: "projects",
      label: "Review selected work",
      description: "Case studies covering architecture, decisions, and trade-offs.",
      to: "/projects",
      icon: FolderKanban,
    },
    {
      key: "skills",
      label: "Technical toolkit",
      description: "Backend, frontend, data, cloud, and architecture capabilities.",
      to: "/skills",
      icon: Cpu,
    },
  );

  for (const social of socials) {
    actions.push({
      key: social.key,
      label: social.label,
      description: socialDescriptions[social.key],
      href: social.href,
      icon: socialIcons[social.key] ?? ExternalLink,
    });
  }

  if (channels.email) {
    actions.push({
      key: "email",
      label: "Email me",
      description: "The most direct route for a role or technical conversation.",
      href: `mailto:${channels.email}`,
      icon: Mail,
    });
  }

  if (channels.bookingUrl) {
    actions.push({
      key: "booking",
      label: "Schedule a 15-minute call",
      description: "Choose a time for a short introductory conversation.",
      href: channels.bookingUrl,
      icon: CalendarClock,
    });
  }

  return (
    <section className="py-16 sm:py-20" aria-labelledby="recruiter-hub-heading">
      <Container>
        <div className="surface-card relative overflow-hidden rounded-3xl p-6 sm:p-8 lg:p-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-accent/10 blur-3xl"
          />
          <div className="relative">
            <p className="eyebrow mb-3">Recruiter quick access</p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2
                  id="recruiter-hub-heading"
                  className="text-display-sm text-balance"
                >
                  Everything needed for a first-pass review
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">
                  Start with the resume, then move into the technical work. External
                  profiles appear here only when they are configured and verified.
                </p>
              </div>
            </div>

            <ul className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {actions.map((action) => {
                const Icon = action.icon;
                const content = (
                  <>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-line-strong bg-white/[0.04] text-accent-cyan">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium text-ink">
                          {action.label}
                        </span>
                        <ArrowUpRight
                          className="h-3.5 w-3.5 shrink-0 text-ink-faint"
                          aria-hidden="true"
                        />
                      </span>
                      <span className="mt-1 block text-xs leading-relaxed text-ink-muted">
                        {action.description}
                      </span>
                    </span>
                  </>
                );

                const classes =
                  "flex h-full items-start gap-3 rounded-2xl border border-line bg-background/40 p-3.5 transition-colors hover:border-accent-cyan/30 hover:bg-background/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-surface";

                if (action.to) {
                  return (
                    <li key={action.key}>
                      <Link to={action.to} className={classes}>
                        {content}
                      </Link>
                    </li>
                  );
                }

                if (!action.href) return null;

                return (
                  <li key={action.key}>
                    <a
                      href={action.href}
                      className={classes}
                      {...(action.download ? { download: "" } : {})}
                      {...(isExternalHref(action.href) &&
                      !action.href.startsWith("mailto:")
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      {content}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
