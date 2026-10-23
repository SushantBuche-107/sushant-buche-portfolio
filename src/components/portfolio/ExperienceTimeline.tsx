import { ChevronDown, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge, TechBadge } from "@/components/ui/badge";
import { formatMonthYear } from "@/lib/format";
import {
  getProjectBySlug,
  getProjectPath,
  getVisibleExperience,
} from "@/lib/portfolio";

export function ExperienceTimeline({
  limit,
}: {
  limit?: number;
}): React.ReactElement | null {
  const allRecords = getVisibleExperience();
  const records = limit ? allRecords.slice(0, limit) : allRecords;

  if (records.length === 0) return null;

  return (
    <ol className="relative ml-2 border-l border-line">
      {records.map((record) => {
        const start = formatMonthYear(record.startDate);
        const end = record.current
          ? "Present"
          : formatMonthYear(record.endDate, "Present");
        const relatedProjects = (record.relatedProjects ?? [])
          .map((slug) => getProjectBySlug(slug))
          .filter((project): project is NonNullable<typeof project> =>
            Boolean(project),
          );
        const hasDetails =
          (record.responsibilities?.length ?? 0) > 0 ||
          (record.achievements?.length ?? 0) > 0;

        return (
          <li key={record.id} className="relative pb-8 pl-7 last:pb-0">
            <span
              aria-hidden="true"
              className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full border border-accent-cyan/60 bg-background shadow-[0_0_0_4px_rgba(11,15,23,1),0_0_18px_rgba(6,182,212,0.55)]"
            />
            <div className="surface-card rounded-2xl p-5 sm:p-6">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-accent-cyan">
                  {start} — {end}
                </p>
                {record.current ? <Badge variant="success">Current</Badge> : null}
                {record.arrangement ? (
                  <Badge variant="neutral">{record.arrangement}</Badge>
                ) : null}
              </div>

              <h3 className="mt-2 font-display text-lg font-semibold text-ink">
                {record.role}
              </h3>
              <p className="mt-0.5 text-sm text-ink-muted">{record.employer}</p>
              {record.location ? (
                <p className="mt-1 flex items-center gap-1.5 text-[0.7rem] text-ink-faint">
                  <MapPin className="h-3 w-3" aria-hidden="true" />
                  {record.location}
                </p>
              ) : null}

              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                {record.summary}
              </p>

              {hasDetails ? (
                <details className="group mt-4 rounded-xl border border-line bg-background/40">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-xs font-medium text-ink [&::-webkit-details-marker]:hidden">
                    Responsibilities and achievements
                    <ChevronDown
                      className="h-3.5 w-3.5 text-ink-faint transition-transform group-open:rotate-180"
                      aria-hidden="true"
                    />
                  </summary>
                  <div className="space-y-4 border-t border-line px-4 py-4">
                    {record.responsibilities?.length ? (
                      <div>
                        <h4 className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-ink-faint">
                          Responsibilities
                        </h4>
                        <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-ink-muted">
                          {record.responsibilities.map((item) => (
                            <li key={item} className="flex gap-2">
                              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent-cyan" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                    {record.achievements?.length ? (
                      <div>
                        <h4 className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-ink-faint">
                          Achievements
                        </h4>
                        <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-ink-muted">
                          {record.achievements.map((item) => (
                            <li key={item} className="flex gap-2">
                              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-success" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>
                </details>
              ) : null}

              {record.technologies?.length ? (
                <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Technologies">
                  {record.technologies.map((technology) => (
                    <li key={technology}>
                      <TechBadge>{technology}</TechBadge>
                    </li>
                  ))}
                </ul>
              ) : null}

              {relatedProjects.length > 0 ? (
                <ul className="mt-4 flex flex-wrap gap-3 border-t border-line pt-3">
                  {relatedProjects.map((project) => (
                    <li key={project.slug}>
                      <Link
                        to={getProjectPath(project.slug)}
                        className="rounded-sm text-xs text-accent-cyan transition-colors hover:text-cyan-200"
                      >
                        {project.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
