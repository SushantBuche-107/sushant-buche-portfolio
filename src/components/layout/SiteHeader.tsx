import { Download, Menu } from "lucide-react";
import { useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { MobileNav } from "@/components/layout/MobileNav";
import { ActionLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/cn";
import {
  getInitials,
  getPersonalProfile,
  getResumeUrl,
  getVisibleNavigation,
} from "@/lib/portfolio";

export function SiteHeader(): React.ReactElement {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const navigation = getVisibleNavigation();
  const personal = getPersonalProfile();
  const resumeUrl = getResumeUrl();
  const initials = getInitials();

  return (
    <>
      <header className="no-print sticky top-0 z-50 border-b border-line/80 bg-background/80 backdrop-blur-xl">
        <Container>
          <div className="flex h-[var(--header-height)] items-center justify-between gap-4">
            <Link
              to="/"
              className="group flex min-w-0 items-center gap-3 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              aria-label={`${personal.name} — home`}
            >
              <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-accent/30 bg-accent/15 font-display text-xs font-semibold tracking-wider text-indigo-100 shadow-[0_0_24px_-10px_rgba(99,102,241,0.9)]">
                {initials}
              </span>
              <span className="min-w-0">
                <span className="block truncate font-display text-sm font-semibold tracking-tight text-ink sm:text-[0.95rem]">
                  {personal.name}
                </span>
                <span className="hidden truncate font-mono text-[0.6rem] uppercase tracking-[0.16em] text-ink-faint sm:block">
                  {personal.title}
                </span>
              </span>
            </Link>

            <nav aria-label="Primary" className="hidden lg:block">
              <ul className="flex items-center gap-1">
                {navigation.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.to === "/"}
                      className={({ isActive }) =>
                        cn(
                          "relative rounded-full px-3 py-2 text-[0.82rem] font-medium transition-colors",
                          "after:absolute after:inset-x-3 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-gradient-to-r after:from-accent after:to-accent-cyan after:transition-transform after:duration-300",
                          isActive
                            ? "text-ink after:scale-x-100"
                            : "text-ink-muted hover:text-ink",
                        )
                      }
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex items-center gap-2">
              {resumeUrl ? (
                <ActionLink
                  href={resumeUrl}
                  download
                  variant="secondary"
                  size="sm"
                  className="hidden sm:inline-flex"
                >
                  <Download className="h-3.5 w-3.5" aria-hidden="true" />
                  Resume
                </ActionLink>
              ) : (
                <ActionLink
                  to="/resume"
                  variant="secondary"
                  size="sm"
                  className="hidden sm:inline-flex"
                >
                  Resume
                </ActionLink>
              )}

              <button
                ref={menuButtonRef}
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-line-strong text-ink-muted transition-colors hover:bg-white/5 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background lg:hidden"
                aria-label="Open navigation"
                aria-expanded={menuOpen}
                aria-controls="mobile-navigation-panel"
                onClick={() => setMenuOpen(true)}
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </Container>
      </header>

      <MobileNav
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        triggerRef={menuButtonRef}
      />
    </>
  );
}
