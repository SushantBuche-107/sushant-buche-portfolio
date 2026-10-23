import { ArrowRight, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";
import { ExperienceTimeline } from "@/components/portfolio/ExperienceTimeline";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  getAboutContent,
  getVisibleExperience,
  getVisibleMetrics,
} from "@/lib/portfolio";

export function ExperienceSummary(): React.ReactElement {
  const records = getVisibleExperience();
  const about = getAboutContent();
  const experienceMetric = getVisibleMetrics().find(
    (metric) => metric.id === "experience-years",
  );

  if (records.length > 0) {
    return (
      <div className="space-y-6">
        <ExperienceTimeline limit={2} />
        <Link
          to="/experience"
          className="inline-flex items-center gap-1.5 rounded-sm text-xs font-medium text-accent-cyan transition-colors hover:text-cyan-200"
        >
          View full experience
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-line-strong bg-white/[0.04] text-accent-cyan">
              <Briefcase className="h-4 w-4" aria-hidden="true" />
            </span>
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-ink-faint">
              Professional background
            </p>
          </div>

          <h3 className="mt-5 max-w-xl text-xl font-semibold leading-snug text-ink sm:text-2xl">
            {experienceMetric?.value
              ? `${experienceMetric.value} years building .NET applications and enterprise workflows`
              : "Full-stack .NET development across enterprise workflows"}
          </h3>

          <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-muted">
            {about.journey[0] ??
              "Experience across healthcare and insurance technology, backend services, API integrations, and production support."}
          </p>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-muted">
            Detailed employment records are published only when verified. The work
            itself is represented through domain experience and technical case
            studies.
          </p>

          <Link
            to="/experience"
            className="mt-5 inline-flex items-center gap-1.5 rounded-sm text-xs font-medium text-accent-cyan transition-colors hover:text-cyan-200"
          >
            Explore the experience page
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        <div className="border-t border-line bg-background/30 p-6 sm:p-8 lg:border-l lg:border-t-0">
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-ink-faint">
            Domain experience
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {about.domains.map((domain) => (
              <li key={domain.title}>
                <Badge variant="neutral">{domain.title}</Badge>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-xs leading-relaxed text-ink-faint">
            Healthcare and home-care workflows, insurance and policy systems,
            enterprise integrations, data validation, background processing, and
            production troubleshooting.
          </p>
        </div>
      </div>
    </Card>
  );
}
