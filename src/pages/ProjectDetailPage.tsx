import { ArrowLeft, ArrowRight, ArrowUpRight, Globe } from "lucide-react";
import type { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { ProjectCard } from "@/components/portfolio/ProjectCard";
import { Badge, TechBadge } from "@/components/ui/badge";
import { GithubIcon } from "@/components/ui/brand-icons";
import { ActionLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import NotFoundPage from "@/pages/NotFoundPage";
import {
  getProjectBySlug,
  getProjectCover,
  getProjectLink,
  getRelatedProjects,
} from "@/lib/portfolio";
import { getSafeAssetUrl } from "@/lib/url";
import { Seo } from "@/lib/seo";
import {
  createBreadcrumbJsonLd,
  createProjectJsonLd,
} from "@/lib/seo-jsonld";
import type { Project } from "@/types/portfolio";

interface CaseStudySection {
  id: string;
  title: string;
  content: ReactNode;
}

function Bullets({ items, label }: { items?: string[]; label?: string }): React.ReactElement | null {
  if (!items?.length) return null;
  return <ul aria-label={label}>{items.map((item) => <li key={item}>{item}</li>)}</ul>;
}

function buildSections(project: Project): CaseStudySection[] {
  const sections: CaseStudySection[] = [
    {
      id: "overview",
      title: "Overview",
      content: (
        <>
          <p>{project.description}</p>
          {project.problem ? (
            <>
              <h3>Problem</h3>
              <p>{project.problem}</p>
            </>
          ) : null}
        </>
      ),
    },
  ];

  if (project.goals?.length || project.constraints?.length) {
    sections.push({
      id: "goals",
      title: "Goals and constraints",
      content: (
        <>
          {project.goals?.length ? (
            <>
              <h3>Goals</h3>
              <Bullets items={project.goals} label="Project goals" />
            </>
          ) : null}
          {project.constraints?.length ? (
            <>
              <h3>Constraints</h3>
              <Bullets items={project.constraints} label="Project constraints" />
            </>
          ) : null}
        </>
      ),
    });
  }

  if (project.contribution?.length) {
    sections.push({
      id: "contribution",
      title: "Role and contribution",
      content: (
        <>
          <p>
            <strong>{project.role}</strong>
            {project.timeline ? ` · ${project.timeline}` : ""}
          </p>
          <Bullets items={project.contribution} label="Contribution" />
        </>
      ),
    });
  }

  if (project.architecture || project.dataFlow?.length) {
    const architectureImage = getSafeAssetUrl(project.architectureImage);
    sections.push({
      id: "architecture",
      title: "Architecture",
      content: (
        <>
          {project.architecture ? <p>{project.architecture}</p> : null}
          {architectureImage ? (
            <figure className="not-prose my-6 overflow-hidden rounded-2xl border border-line bg-surface-subtle">
              <img
                src={architectureImage}
                alt={project.architectureImageAlt?.trim() || `${project.title} architecture diagram`}
                width={1200}
                height={700}
                loading="lazy"
                decoding="async"
                className="h-auto w-full"
              />
              <figcaption className="border-t border-line px-4 py-3 text-[0.68rem] leading-relaxed text-ink-faint">
                High-level architecture illustration. Employer-confidential systems and
                customer data are not depicted.
              </figcaption>
            </figure>
          ) : null}
          {project.dataFlow?.length ? (
            <>
              <h3>Data flow</h3>
              <ol>
                {project.dataFlow.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </>
          ) : null}
        </>
      ),
    });
  }

  if (project.apiDesign?.length || project.databaseDesign?.length) {
    sections.push({
      id: "data-and-apis",
      title: "API and data design",
      content: (
        <>
          {project.apiDesign?.length ? (
            <>
              <h3>API boundaries</h3>
              <Bullets items={project.apiDesign} label="API design" />
            </>
          ) : null}
          {project.databaseDesign?.length ? (
            <>
              <h3>Data model</h3>
              <Bullets items={project.databaseDesign} label="Database design" />
            </>
          ) : null}
        </>
      ),
    });
  }

  if (project.decisions?.length) {
    sections.push({
      id: "decisions",
      title: "Key decisions",
      content: (
        <div className="not-prose space-y-3">
          {project.decisions.map((decision, index) => (
            <div
              key={decision.title}
              className="rounded-2xl border border-line bg-white/[0.02] p-5"
            >
              <span className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-accent-cyan">
                Decision {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 text-base font-semibold text-ink">{decision.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                {decision.detail}
              </p>
            </div>
          ))}
        </div>
      ),
    });
  }

  if (project.security?.length || project.performance?.length) {
    sections.push({
      id: "security-performance",
      title: "Security and performance",
      content: (
        <>
          {project.security?.length ? (
            <>
              <h3>Security considerations</h3>
              <Bullets items={project.security} label="Security considerations" />
            </>
          ) : null}
          {project.performance?.length ? (
            <>
              <h3>Performance considerations</h3>
              <Bullets items={project.performance} label="Performance considerations" />
            </>
          ) : null}
        </>
      ),
    });
  }

  if (project.challenges?.length) {
    sections.push({
      id: "challenges",
      title: "Challenges",
      content: (
        <>
          {project.challenges.map((challenge) => (
            <div key={challenge.title}>
              <h3>{challenge.title}</h3>
              <p>{challenge.detail}</p>
            </div>
          ))}
        </>
      ),
    });
  }

  if (project.tradeoffs?.length) {
    sections.push({
      id: "tradeoffs",
      title: "Trade-offs",
      content: (
        <>
          <p>
            Every implementation choice gives something up. These are the trade-offs I
            accepted deliberately.
          </p>
          <Bullets items={project.tradeoffs} label="Trade-offs" />
        </>
      ),
    });
  }

  if (project.testing?.length) {
    sections.push({
      id: "testing",
      title: "Testing and verification",
      content: <Bullets items={project.testing} label="Testing approach" />,
    });
  }

  if (project.codeSnippets?.length) {
    sections.push({
      id: "implementation",
      title: "Implementation detail",
      content: (
        <div className="not-prose space-y-5">
          {project.codeSnippets.map((snippet) => (
            <figure key={snippet.title}>
              <figcaption className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-semibold text-ink">{snippet.title}</span>
                <span className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-ink-faint">
                  {snippet.language}
                </span>
              </figcaption>
              <pre className="overflow-x-auto rounded-xl border border-line bg-[#0d1320] p-4">
                <code className="font-mono text-xs leading-relaxed text-slate-200">
                  {snippet.code}
                </code>
              </pre>
              {snippet.caption ? (
                <p className="mt-2 text-xs leading-relaxed text-ink-faint">
                  {snippet.caption}
                </p>
              ) : null}
            </figure>
          ))}
        </div>
      ),
    });
  }

  if (project.results?.length) {
    sections.push({
      id: "results",
      title: "Outcome",
      content: (
        <>
          <p>
            These are verified outcomes for this project. No production user metrics or
            business results are claimed where none exist.
          </p>
          <Bullets items={project.results} label="Project outcomes" />
        </>
      ),
    });
  }

  if (project.lessons?.length) {
    sections.push({
      id: "lessons",
      title: "What I learned",
      content: <Bullets items={project.lessons} label="Lessons learned" />,
    });
  }

  if (project.gallery?.length) {
    sections.push({
      id: "gallery",
      title: "Gallery",
      content: (
        <div className="not-prose grid gap-4 sm:grid-cols-2">
          {project.gallery.map((item) => {
            const src = getSafeAssetUrl(item.src);
            if (!src) return null;
            return (
              <figure
                key={item.src}
                className="overflow-hidden rounded-2xl border border-line bg-surface-subtle"
              >
                <img
                  src={src}
                  alt={item.alt}
                  width={800}
                  height={500}
                  loading="lazy"
                  decoding="async"
                  className="h-auto w-full"
                />
                {item.caption ? (
                  <figcaption className="border-t border-line px-4 py-3 text-xs text-ink-faint">
                    {item.caption}
                  </figcaption>
                ) : null}
              </figure>
            );
          })}
        </div>
      ),
    });
  }

  return sections;
}

export default function ProjectDetailPage(): React.ReactElement {
  const { slug } = useParams();
  const project = getProjectBySlug(slug);

  if (!project) return <NotFoundPage />;

  const cover = getProjectCover(project);
  const liveUrl = getProjectLink(project.links.live);
  const repoUrl = getProjectLink(project.links.github);
  const related = getRelatedProjects(project);
  const sections = buildSections(project);

  return (
    <>
      <Seo
        title={project.title}
        description={project.summary}
        path={`/projects/${project.slug}`}
        image={project.coverImage}
        type="article"
        jsonLd={[
          createProjectJsonLd(project),
          createBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Projects", path: "/projects" },
            { name: project.title, path: `/projects/${project.slug}` },
          ]),
        ]}
      />

      <PageHeader
        eyebrow={project.categories[0] ?? "Case study"}
        title={project.title}
        description={project.summary}
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "Projects", to: "/projects" },
          { label: project.title },
        ]}
      >
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">Role: {project.role}</Badge>
            {project.timeline ? (
              <Badge variant="outline">Timeline: {project.timeline}</Badge>
            ) : null}
          </div>
          {liveUrl || repoUrl ? (
            <div className="flex flex-wrap gap-2">
              {liveUrl ? (
                <ActionLink href={liveUrl} size="sm" variant="secondary">
                  <Globe className="h-3.5 w-3.5" aria-hidden="true" />
                  Live project
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </ActionLink>
              ) : null}
              {repoUrl ? (
                <ActionLink href={repoUrl} size="sm" variant="outline">
                  <GithubIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  Source
                </ActionLink>
              ) : null}
            </div>
          ) : null}
        </div>
      </PageHeader>

      <Container>
        <div className="grid gap-12 pb-20 lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-14">
          <article className="min-w-0">
            {cover ? (
              <figure className="mb-10 overflow-hidden rounded-3xl border border-line bg-surface-subtle">
                <img
                  src={cover}
                  alt={project.coverAlt?.trim() || `${project.title} preview`}
                  width={1280}
                  height={720}
                  className="h-auto w-full"
                />
              </figure>
            ) : null}

            <div className="space-y-10">
              {sections.map((section) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-28 border-t border-line pt-8 first:border-t-0 first:pt-0"
                  aria-labelledby={`${section.id}-heading`}
                >
                  <h2
                    id={`${section.id}-heading`}
                    className="text-display-sm"
                  >
                    {section.title}
                  </h2>
                  <div className="prose-article mt-4 text-sm sm:text-base">
                    {section.content}
                  </div>
                </section>
              ))}
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
              <Link
                to="/projects"
                className="inline-flex items-center gap-1.5 rounded-sm text-xs font-medium text-ink-muted transition-colors hover:text-ink"
              >
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                All projects
              </Link>
              {liveUrl ? (
                <ActionLink href={liveUrl} variant="outline" size="sm">
                  Visit project
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </ActionLink>
              ) : null}
            </div>

            {related.length > 0 ? (
              <section className="mt-14" aria-labelledby="related-projects-heading">
                <div className="flex items-end justify-between gap-4">
                  <h2 id="related-projects-heading" className="text-display-sm">
                    Related projects
                  </h2>
                  <Link
                    to="/projects"
                    className="inline-flex items-center gap-1.5 rounded-sm text-xs font-medium text-accent-cyan hover:text-cyan-200"
                  >
                    View all
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  {related.map((item) => (
                    <ProjectCard key={item.slug} project={item} />
                  ))}
                </div>
              </section>
            ) : null}
          </article>

          <aside className="no-print lg:sticky lg:top-24 lg:self-start">
            <nav aria-label="On this page" className="hidden lg:block">
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-ink-faint">
                On this page
              </p>
              <ul className="mt-3 space-y-1.5 border-l border-line pl-3">
                {sections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="block rounded-sm py-0.5 text-xs leading-relaxed text-ink-faint transition-colors hover:text-ink"
                    >
                      {section.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mt-8 rounded-2xl border border-line bg-white/[0.02] p-4 lg:mt-8">
              <h2 className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-ink-faint">
                Project facts
              </h2>
              <dl className="mt-3 space-y-3 text-xs">
                <div>
                  <dt className="text-ink-faint">Role</dt>
                  <dd className="mt-0.5 text-ink-muted">{project.role}</dd>
                </div>
                <div>
                  <dt className="text-ink-faint">Timeline</dt>
                  <dd className="mt-0.5 text-ink-muted">{project.timeline}</dd>
                </div>
                <div>
                  <dt className="text-ink-faint">Categories</dt>
                  <dd className="mt-0.5 text-ink-muted">
                    {project.categories.join(", ")}
                  </dd>
                </div>
              </dl>
              <h3 className="mt-4 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-ink-faint">
                Stack
              </h3>
              <ul className="mt-2 flex flex-wrap gap-1.5" aria-label="Project technologies">
                {project.technologies.map((technology) => (
                  <li key={technology}>
                    <TechBadge>{technology}</TechBadge>
                  </li>
                ))}
              </ul>
            </div>

            <p className="mt-5 text-[0.68rem] leading-relaxed text-ink-faint">
              This case study describes general engineering decisions. It does not
              include employer-confidential code, customer data, or internal
              architecture.
            </p>
          </aside>
        </div>
      </Container>
    </>
  );
}
