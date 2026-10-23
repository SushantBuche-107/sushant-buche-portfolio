import { ArrowRight, FolderKanban, PenLine } from "lucide-react";
import { Link } from "react-router-dom";
import { ArticleCard } from "@/components/portfolio/ArticleCard";
import { ContactCta } from "@/components/portfolio/ContactCta";
import { ExperienceSummary } from "@/components/portfolio/ExperienceSummary";
import { Hero } from "@/components/portfolio/Hero";
import { HighlightBar } from "@/components/portfolio/HighlightBar";
import { ProjectCard } from "@/components/portfolio/ProjectCard";
import { RecruiterHub } from "@/components/portfolio/RecruiterHub";
import { Badge, TechBadge } from "@/components/ui/badge";
import { ActionLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { getAboutContent, getFeaturedProjects, getPublishedArticles, getPublishedProjects, getSiteConfig, getVisibleSkills } from "@/lib/portfolio";
import { Seo } from "@/lib/seo";
import {
  createPersonJsonLd,
  createWebSiteJsonLd,
} from "@/lib/seo-jsonld";

export default function HomePage(): React.ReactElement {
  const site = getSiteConfig();
  const about = getAboutContent();
  const featured = getFeaturedProjects();
  const projects = featured.length > 0 ? featured : getPublishedProjects().slice(0, 3);
  const skills = getVisibleSkills();
  const articles = getPublishedArticles().slice(0, 2);

  return (
    <>
      <Seo
        title={site.title}
        description={site.defaultDescription}
        path="/"
        type="profile"
        jsonLd={[createPersonJsonLd(), createWebSiteJsonLd()]}
      />

      <Hero />
      <HighlightBar />

      <section className="py-16 sm:py-20" aria-labelledby="selected-work-heading">
        <Container>
          <Reveal>
            <SectionHeading
              id="selected-work-heading"
              eyebrow="Selected work"
              title="Engineering case studies, not just screenshots"
              description="Each project page covers the problem, architecture, decisions, trade-offs, and what was learned."
              action={
                <ActionLink to="/projects" variant="outline" size="sm">
                  All projects
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </ActionLink>
              }
            />
          </Reveal>
          {projects.length > 0 ? (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {projects.map((project, index) => (
                <Reveal key={project.slug} delay={index * 0.05}>
                  <ProjectCard project={project} />
                </Reveal>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={FolderKanban}
              title="Case studies are being prepared"
              description="Detailed project write-ups will appear here once they are ready to publish. In the meantime, the skills and experience pages outline the technical focus."
              className="mt-8"
              action={
                <ActionLink to="/skills" variant="secondary" size="sm">
                  Explore skills
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </ActionLink>
              }
            />
          )}
        </Container>
      </section>

      <section className="border-y border-line bg-surface/20 py-16 sm:py-20" aria-labelledby="toolkit-heading">
        <Container>
          <Reveal>
            <SectionHeading
              id="toolkit-heading"
              eyebrow="Technical toolkit"
              title="Backend depth with full-stack range"
              description="The stack is organized by discipline. Core technologies are labelled explicitly; nothing is presented as a percentage."
              action={
                <ActionLink to="/skills" variant="outline" size="sm">
                  View all skills
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </ActionLink>
              }
            />
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {skills.slice(0, 4).map((category, index) => (
              <Reveal key={category.id} delay={index * 0.04}>
                <Card className="h-full p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-display text-base font-semibold text-ink">
                        {category.name}
                      </h3>
                      <p className="mt-1.5 text-xs leading-relaxed text-ink-muted">
                        {category.description}
                      </p>
                    </div>
                    <Badge variant="outline">{category.items.length}</Badge>
                  </div>
                  <ul className="mt-4 flex flex-wrap gap-1.5" aria-label={`${category.name} technologies`}>
                    {category.items.slice(0, 6).map((item) => (
                      <li key={item.name}>
                        <TechBadge>{item.name}</TechBadge>
                      </li>
                    ))}
                    {category.items.length > 6 ? (
                      <li>
                        <TechBadge>+{category.items.length - 6}</TechBadge>
                      </li>
                    ) : null}
                  </ul>
                </Card>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20" aria-labelledby="experience-heading">
        <Container>
          <Reveal>
            <SectionHeading
              id="experience-heading"
              eyebrow="Experience"
              title="Enterprise workflows, production constraints"
              description={
                about.journey[0] ??
                "Full-stack .NET development across healthcare and insurance technology."
              }
              action={
                <ActionLink to="/experience" variant="outline" size="sm">
                  Experience details
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </ActionLink>
              }
            />
          </Reveal>
          <div className="mt-8">
            <ExperienceSummary />
          </div>
        </Container>
      </section>

      <section className="border-y border-line bg-surface/20 py-16 sm:py-20" aria-labelledby="approach-heading">
        <Container>
          <Reveal>
            <SectionHeading
              id="approach-heading"
              eyebrow="Engineering approach"
              title="How I think about production software"
              description="A few principles that shape how I design, build, and troubleshoot applications."
            />
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {about.principles.map((principle, index) => (
              <Reveal key={principle.title} delay={index * 0.04}>
                <Card className="h-full p-5 sm:p-6">
                  <span className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-accent-cyan">
                    0{index + 1}
                  </span>
                  <h3 className="mt-3 font-display text-base font-semibold text-ink">
                    {principle.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                    {principle.detail}
                  </p>
                </Card>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {articles.length > 0 ? (
        <section className="py-16 sm:py-20" aria-labelledby="writing-heading">
          <Container>
            <SectionHeading
              id="writing-heading"
              eyebrow="Writing"
              title="Recent technical notes"
              description="Practical notes on .NET, APIs, data, and production engineering."
              action={
                <ActionLink to="/blog" variant="outline" size="sm">
                  All writing
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </ActionLink>
              }
            />
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {articles.map((article, index) => (
                <Reveal key={article.slug} delay={index * 0.05}>
                  <ArticleCard article={article} />
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      ) : (
        <section className="py-16 sm:py-20" aria-labelledby="writing-shell-heading">
          <Container>
            <div className="surface-card flex flex-col items-start gap-5 rounded-2xl p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line-strong bg-white/[0.04] text-accent-cyan">
                  <PenLine className="h-4 w-4" aria-hidden="true" />
                </span>
                <div>
                  <h2 id="writing-shell-heading" className="text-lg font-semibold text-ink">
                    A writing space is ready
                  </h2>
                  <p className="mt-1 max-w-xl text-sm leading-relaxed text-ink-muted">
                    No articles have been published yet. The blog supports Markdown,
                    code highlighting, tables of contents, tags, and article metadata.
                  </p>
                </div>
              </div>
              <ActionLink to="/blog" variant="outline" size="sm">
                Visit the blog
              </ActionLink>
            </div>
          </Container>
        </section>
      )}

      <RecruiterHub />
      <ContactCta />

      <section className="pb-16">
        <Container>
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-9">
            <p className="max-w-xl text-xs leading-relaxed text-ink-faint">
              Public content is intentionally limited to verified information. Employer
              names, client data, and proprietary implementation details are not
              published.
            </p>
            <Link
              to="/resume"
              className="inline-flex items-center gap-1.5 rounded-sm text-xs font-medium text-ink-muted transition-colors hover:text-ink"
            >
              Review the full resume
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
