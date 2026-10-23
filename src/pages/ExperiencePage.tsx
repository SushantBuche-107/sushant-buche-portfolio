import { ArrowRight, Briefcase, Download, FileText } from "lucide-react";
import { ExperienceTimeline } from "@/components/portfolio/ExperienceTimeline";
import { ActionLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal } from "@/components/ui/reveal";
import {
  getAboutContent,
  getResumeUrl,
  getVisibleCertifications,
  getVisibleEducation,
  getVisibleExperience,
} from "@/lib/portfolio";
import { Seo } from "@/lib/seo";
import { createBreadcrumbJsonLd } from "@/lib/seo-jsonld";

export default function ExperiencePage(): React.ReactElement {
  const experience = getVisibleExperience();
  const about = getAboutContent();
  const education = getVisibleEducation();
  const certifications = getVisibleCertifications();
  const resumeUrl = getResumeUrl();

  return (
    <>
      <Seo
        title="Experience"
        description="Full-stack .NET development experience across healthcare, insurance, enterprise integrations, and production systems."
        path="/experience"
        jsonLd={createBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Experience", path: "/experience" },
        ])}
      />

      <PageHeader
        eyebrow="Experience"
        title="Building and supporting software in production"
        description="2.8+ years of full-stack .NET development, with work spanning healthcare and insurance technology, enterprise API integrations, data engineering, and production support."
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Experience" }]}
      >
        <div className="flex flex-wrap gap-2">
          {resumeUrl ? (
            <ActionLink href={resumeUrl} download variant="secondary" size="sm">
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
              Download resume
            </ActionLink>
          ) : (
            <ActionLink to="/resume" variant="secondary" size="sm">
              <FileText className="h-3.5 w-3.5" aria-hidden="true" />
              View resume
            </ActionLink>
          )}
          <ActionLink to="/projects" variant="ghost" size="sm">
            See project work
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </ActionLink>
        </div>
      </PageHeader>

      <Container>
        <div className="grid gap-12 pb-20 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-16">
          <div className="min-w-0">
            {experience.length > 0 ? (
              <section aria-labelledby="role-history-heading">
                <p className="eyebrow mb-3">Role history</p>
                <h2 id="role-history-heading" className="text-display-sm">
                  Professional timeline
                </h2>
                <div className="mt-7">
                  <ExperienceTimeline />
                </div>
              </section>
            ) : (
              <section aria-labelledby="background-heading">
                <p className="eyebrow mb-3">Professional background</p>
                <h2 id="background-heading" className="text-display-sm">
                  Experience across enterprise application work
                </h2>
                <div className="mt-5 space-y-4">
                  {about.journey.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="max-w-2xl text-sm leading-relaxed text-ink-muted sm:text-base"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {about.domains.map((domain) => (
                    <Reveal key={domain.title}>
                      <Card className="h-full p-5">
                        <h3 className="font-display text-base font-semibold text-ink">
                          {domain.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                          {domain.detail}
                        </p>
                      </Card>
                    </Reveal>
                  ))}
                </div>

                <div className="mt-8 rounded-2xl border border-line bg-surface/40 p-5">
                  <div className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-line-strong bg-white/[0.04] text-accent-cyan">
                      <Briefcase className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold text-ink">
                        Role records are published only when verified
                      </h3>
                      <p className="mt-1 max-w-2xl text-xs leading-relaxed text-ink-faint">
                        Employer names, exact dates, and confidential details are not
                        fabricated for the public site. The project case studies and
                        resume cover the technical work that can be shared.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  <ActionLink to="/projects" variant="outline" size="sm">
                    Read the case studies
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </ActionLink>
                  <ActionLink to="/resume" variant="ghost" size="sm">
                    View the resume
                  </ActionLink>
                </div>
              </section>
            )}

            {education.length > 0 || certifications.length > 0 ? (
              <section className="mt-16" aria-labelledby="education-heading">
                <p className="eyebrow mb-3">Education & credentials</p>
                <h2 id="education-heading" className="text-display-sm">
                  Verified qualifications
                </h2>

                {education.length > 0 ? (
                  <ul className="mt-6 space-y-3">
                    {education.map((record) => (
                      <li
                        key={record.id}
                        className="rounded-2xl border border-line bg-white/[0.02] p-5"
                      >
                        <h3 className="text-sm font-semibold text-ink">
                          {record.qualification}
                        </h3>
                        <p className="mt-1 text-xs text-ink-muted">
                          {record.institution}
                          {record.year ? ` · ${record.year}` : ""}
                        </p>
                        {record.grade ? (
                          <p className="mt-1 text-xs text-ink-faint">{record.grade}</p>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                ) : null}

                {certifications.length > 0 ? (
                  <ul className="mt-4 space-y-3">
                    {certifications.map((record) => (
                      <li
                        key={record.id}
                        className="rounded-2xl border border-line bg-white/[0.02] p-5"
                      >
                        <h3 className="text-sm font-semibold text-ink">
                          {record.name}
                        </h3>
                        <p className="mt-1 text-xs text-ink-muted">
                          {record.issuer}
                          {record.year ? ` · ${record.year}` : ""}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ) : null}
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <Card className="p-5">
              <h2 className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-ink-faint">
                At a glance
              </h2>
              <dl className="mt-4 space-y-4">
                <div>
                  <dt className="text-[0.68rem] text-ink-faint">Experience</dt>
                  <dd className="mt-0.5 text-sm text-ink">
                     2.8+ years, as of 2026
                  </dd>
                </div>
                <div>
                  <dt className="text-[0.68rem] text-ink-faint">Primary stack</dt>
                  <dd className="mt-0.5 text-sm text-ink">
                    C# · .NET · ASP.NET Core · SQL Server
                  </dd>
                </div>
                <div>
                  <dt className="text-[0.68rem] text-ink-faint">Domains</dt>
                  <dd className="mt-0.5 text-sm text-ink">
                    Healthcare & insurance technology
                  </dd>
                </div>
              </dl>
            </Card>
            <Card className="p-5">
              <h2 className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-ink-faint">
                Day to day
              </h2>
              <ul className="mt-3 space-y-2 text-xs leading-relaxed text-ink-muted">
                <li>Backend services and API integrations</li>
                <li>SQL queries, data validation, and performance</li>
                <li>Background jobs, automation, and business rules</li>
                <li>Production troubleshooting and reliability</li>
              </ul>
            </Card>
          </aside>
        </div>
      </Container>
    </>
  );
}
