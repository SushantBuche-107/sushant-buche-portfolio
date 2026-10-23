import { ArrowRight, Code2, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge, TechBadge } from "@/components/ui/badge";
import { GithubIcon } from "@/components/ui/brand-icons";
import {
  getProjectCover,
  getProjectLink,
  getProjectPath,
} from "@/lib/portfolio";
import type { Project } from "@/types/portfolio";

function ProjectPlaceholder({ project }: { project: Project }): React.ReactElement {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.22),transparent_55%),radial-gradient(circle_at_75%_80%,rgba(6,182,212,0.14),transparent_55%)]">
      <div
        aria-hidden="true"
        className="absolute inset-0 grid-backdrop opacity-70"
      />
      <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl border border-accent/30 bg-background/70 shadow-[0_0_40px_-16px_rgba(99,102,241,0.9)]">
        <Code2 className="h-8 w-8 text-accent-cyan" aria-hidden="true" />
      </div>
      <span className="absolute bottom-4 left-4 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-ink-faint">
        {project.categories[0] ?? "Case study"}
      </span>
    </div>
  );
}

export function ProjectCard({ project }: { project: Project }): React.ReactElement {
  const cover = getProjectCover(project);
  const liveUrl = getProjectLink(project.links.live);
  const repoUrl = getProjectLink(project.links.github);
  const visibleTechnologies = project.technologies.slice(0, 5);
  const extraTechnologyCount = project.technologies.length - visibleTechnologies.length;

  return (
    <article className="surface-card interactive-card group flex h-full flex-col overflow-hidden rounded-2xl">
      <div className="relative aspect-[16/10] overflow-hidden border-b border-line">
        {cover ? (
          <img
            src={cover}
            alt={project.coverAlt?.trim() || `${project.title} project preview`}
            width={640}
            height={400}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
          />
        ) : (
          <ProjectPlaceholder project={project} />
        )}
        {project.featured ? (
          <div className="absolute left-3 top-3">
            <Badge variant="accent">Featured</Badge>
          </div>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap gap-2">
          {project.categories.map((category) => (
            <Badge key={category} variant="outline">
              {category}
            </Badge>
          ))}
        </div>

        <h3 className="mt-3 font-display text-xl font-semibold tracking-tight text-ink">
          <Link
            to={getProjectPath(project.slug)}
            className="rounded-sm transition-colors hover:text-indigo-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {project.title}
          </Link>
        </h3>

        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-muted">
          {project.summary}
        </p>

        <ul className="mb-6 mt-4 flex flex-wrap gap-1.5" aria-label="Technologies">
          {visibleTechnologies.map((technology) => (
            <li key={technology}>
              <TechBadge>{technology}</TechBadge>
            </li>
          ))}
          {extraTechnologyCount > 0 ? (
            <li>
              <TechBadge>+{extraTechnologyCount}</TechBadge>
            </li>
          ) : null}
        </ul>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-4">
          <Link
            to={getProjectPath(project.slug)}
            className="inline-flex items-center gap-1.5 rounded-sm text-xs font-medium text-accent-cyan transition-colors hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Read case study
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>

          {liveUrl || repoUrl ? (
            <div className="flex items-center gap-1">
              {liveUrl ? (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-ink-faint transition-colors hover:bg-white/5 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  aria-label={`Open live demo for ${project.title} (opens in a new tab)`}
                >
                  <Globe className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              ) : null}
              {repoUrl ? (
                <a
                  href={repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-ink-faint transition-colors hover:bg-white/5 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  aria-label={`Open source repository for ${project.title} (opens in a new tab)`}
                >
                  <GithubIcon className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
