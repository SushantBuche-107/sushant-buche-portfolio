import { ArrowRight, Compass, Home } from "lucide-react";
import { useLocation } from "react-router-dom";
import { ActionLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Seo } from "@/lib/seo";

export default function NotFoundPage(): React.ReactElement {
  const location = useLocation();

  return (
    <>
      <Seo
        title="Page not found"
        description="The page you requested does not exist. Use the links below to continue exploring the portfolio."
        path={location.pathname}
        noindex
      />

      <section className="relative overflow-hidden py-20 sm:py-28" aria-labelledby="not-found-heading">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 grid-backdrop opacity-60"
        />
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-line-strong bg-white/[0.04] text-accent-cyan">
              <Compass className="h-6 w-6" aria-hidden="true" />
            </span>
            <p className="mt-6 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-ink-faint">
              Error 404
            </p>
            <h1 id="not-found-heading" className="mt-3 text-display-lg text-balance">
              This page is not part of the current map.
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-ink-muted sm:text-base">
              The URL may have changed or the page may not have been published. The
              links below lead back to verified content.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <ActionLink to="/" size="lg">
                <Home className="h-4 w-4" aria-hidden="true" />
                Back to home
              </ActionLink>
              <ActionLink to="/projects" variant="secondary" size="lg">
                Explore projects
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </ActionLink>
              <ActionLink to="/resume" variant="outline" size="lg">
                View resume
              </ActionLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
