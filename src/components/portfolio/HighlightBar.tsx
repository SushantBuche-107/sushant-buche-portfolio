import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/cn";
import {
  getVisibleHighlights,
  getVisibleMetrics,
} from "@/lib/portfolio";
import type { HighlightTone } from "@/types/portfolio";

const toneToBadge: Record<
  HighlightTone,
  "accent" | "cyan" | "neutral" | "success" | "warning" | "outline"
> = {
  accent: "accent",
  success: "success",
  warning: "warning",
  neutral: "neutral",
};

export function HighlightBar(): React.ReactElement | null {
  const metrics = getVisibleMetrics();
  const highlights = getVisibleHighlights();

  if (metrics.length === 0 && highlights.length === 0) return null;

  return (
    <section
      aria-label="Professional highlights"
      className="border-y border-line bg-surface/30"
    >
      <Container>
        <div className="py-8 sm:py-10">
          {highlights.length > 0 ? (
            <div className="mb-6 flex flex-wrap items-center gap-2">
              {highlights.map((highlight) => (
                <Badge key={highlight.id} variant={toneToBadge[highlight.tone]}>
                  {highlight.tone === "success" ? (
                    <span className="h-1.5 w-1.5 rounded-full bg-success" />
                  ) : null}
                  {highlight.label}
                </Badge>
              ))}
            </div>
          ) : null}

          <dl
            className={cn(
              "grid gap-6",
              metrics.length >= 3
                ? "sm:grid-cols-3 sm:divide-x sm:divide-line"
                : metrics.length === 2
                  ? "sm:grid-cols-2 sm:divide-x sm:divide-line"
                  : "sm:grid-cols-1",
            )}
          >
            {metrics.map((metric) => (
              <div
                key={metric.id}
                className="min-w-0 sm:px-6 sm:first:pl-0 sm:last:pr-0"
              >
                <dt className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-ink-faint">
                  {metric.label}
                </dt>
                <dd className="mt-1.5 font-display text-[clamp(1.3rem,2.4vw,1.9rem)] font-semibold tracking-tight text-ink">
                  {metric.value}
                </dd>
                {metric.detail ? (
                  <dd className="mt-0.5 text-[0.7rem] text-ink-faint">
                    {metric.detail}
                  </dd>
                ) : null}
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </section>
  );
}
