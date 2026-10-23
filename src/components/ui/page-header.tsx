import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/ui/breadcrumbs";
import { cn } from "@/lib/cn";

export function PageHeader({
  eyebrow,
  title,
  description,
  breadcrumbs,
  children,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  children?: ReactNode;
  className?: string;
}): React.ReactElement {
  return (
    <header className={cn("no-print relative overflow-hidden pb-12 pt-14 sm:pb-16 sm:pt-20", className)}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 grid-backdrop opacity-60"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-32 -z-10 h-80 w-80 rounded-full bg-accent/10 blur-3xl"
      />
      <Container>
        {breadcrumbs?.length ? (
          <Breadcrumbs items={breadcrumbs} className="mb-8" />
        ) : null}
        {eyebrow ? <p className="eyebrow mb-4">{eyebrow}</p> : null}
        <h1 className="max-w-4xl text-display-lg text-balance">{title}</h1>
        {description ? (
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg">
            {description}
          </p>
        ) : null}
        {children ? <div className="mt-8">{children}</div> : null}
      </Container>
    </header>
  );
}
