import { ExternalLink, Mail } from "lucide-react";
import {
  GithubIcon,
  LinkedinIcon,
  type IconComponent,
} from "@/components/ui/brand-icons";
import type { SocialLink } from "@/lib/portfolio";
import { cn } from "@/lib/cn";

const icons: Record<SocialLink["key"], IconComponent> = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  naukri: ExternalLink,
  leetcode: ExternalLink,
  twitter: ExternalLink,
  website: ExternalLink,
  email: Mail,
};

export function SocialLinks({
  links,
  className,
  showLabels = true,
}: {
  links: SocialLink[];
  className?: string;
  showLabels?: boolean;
}): React.ReactElement | null {
  if (links.length === 0) return null;

  return (
    <ul className={cn("flex flex-wrap items-center gap-2", className)}>
      {links.map((link) => {
        const Icon = icons[link.key] ?? ExternalLink;
        const isEmail = link.key === "email";
        return (
          <li key={link.key}>
            <a
              href={link.href}
              className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-white/[0.03] px-3 py-2 text-xs text-ink-muted transition-colors hover:border-accent-cyan/40 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              {...(isEmail
                ? {}
                : { target: "_blank", rel: "noopener noreferrer" })}
              aria-label={
                isEmail
                  ? `Email ${link.label}`
                  : `${link.label} (opens in a new tab)`
              }
            >
              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              {showLabels ? link.label : null}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
