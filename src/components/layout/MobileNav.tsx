import { ArrowUpRight, Download, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Link, NavLink } from "react-router-dom";
import { ActionLink } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import {
  getPersonalProfile,
  getResumeUrl,
  getVisibleNavigation,
} from "@/lib/portfolio";

const panelId = "mobile-navigation-panel";

export function MobileNav({
  open,
  onClose,
  triggerRef,
}: {
  open: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}): React.ReactElement | null {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const navigation = getVisibleNavigation();
  const resumeUrl = getResumeUrl();
  const personal = getPersonalProfile();

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const trigger = triggerRef.current;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 30);

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleKeyDown);
      trigger?.focus();
    };
  }, [onClose, open, triggerRef]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[70] lg:hidden">
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        aria-hidden="true"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        id={panelId}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        className="absolute inset-y-0 right-0 flex w-full max-w-sm animate-fade-up flex-col border-l border-line-strong bg-surface p-5 shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div>
            <p className="font-display text-sm font-semibold text-ink">
              {personal.name}
            </p>
            <p className="mt-0.5 text-[0.68rem] text-ink-faint">
              {personal.title}
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line-strong text-ink-muted transition-colors hover:bg-white/5 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            aria-label="Close navigation"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <nav aria-label="Mobile" className="mt-4 flex-1 overflow-y-auto">
          <ul className="space-y-1">
            {navigation.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === "/"}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center justify-between rounded-xl px-3 py-3 text-sm transition-colors",
                      isActive
                        ? "bg-accent/10 text-ink"
                        : "text-ink-muted hover:bg-white/[0.04] hover:text-ink",
                    )
                  }
                >
                  {item.label}
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-50" aria-hidden="true" />
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-4 space-y-3 border-t border-line pt-4">
          {resumeUrl ? (
            <ActionLink
              href={resumeUrl}
              download
              variant="secondary"
              size="md"
              className="w-full"
              onClick={onClose}
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Download resume
            </ActionLink>
          ) : (
            <Link
              to="/resume"
              onClick={onClose}
              className="flex h-11 w-full items-center justify-center rounded-full border border-line-strong bg-surface/70 text-sm font-medium text-ink transition-colors hover:border-accent/50 hover:bg-surface-raised"
            >
              View resume
            </Link>
          )}
          <p className="text-center text-[0.68rem] leading-relaxed text-ink-faint">
            {personal.location}
          </p>
        </div>
      </div>
    </div>,
    document.body,
  );
}
