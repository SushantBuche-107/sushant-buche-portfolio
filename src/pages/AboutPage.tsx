import { ArrowRight, BookOpen, Download, FileText, Sparkles } from "lucide-react";
import { ActionLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  getAboutContent,
  getContactChannels,
  getPersonalProfile,
  getProfileImage,
  getResumeUrl,
  getVisibleMetrics,
} from "@/lib/portfolio";
import { Seo } from "@/lib/seo";
import {
  createBreadcrumbJsonLd,
  createPersonJsonLd,
} from "@/lib/seo-jsonld";

export default function AboutPage(): React.ReactElement {
  const about = getAboutContent();
  const personal = getPersonalProfile();
  const resumeUrl = getResumeUrl();
  const channels = getContactChannels();
  const metrics = getVisibleMetrics();
  const profileImage = getProfileImage();

  return (
    <>
      <Seo
        title="About"
        description={about.intro}
        path="/about"
        type="profile"
        jsonLd={[
          createPersonJsonLd(),
          createBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ]),
        ]}
      />

      <PageHeader
        eyebrow="About"
        title="Engineering software that holds up in production."
        description={about.intro}
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "About" }]}
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
          {channels.hasAny ? (
            <ActionLink to="/contact" variant="ghost" size="sm">
              Contact
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </ActionLink>
          ) : null}
        </div>
      </PageHeader>

      <Container>
        <div className="grid gap-12 pb-16 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-16">
          <div className="min-w-0 space-y-16">
            <section aria-labelledby="journey-heading">
              <p className="eyebrow mb-3">Career journey</p>
              <h2 id="journey-heading" className="text-display-sm">
                A full-stack path through enterprise systems
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
            </section>

            <section aria-labelledby="principles-heading">
              <SectionHeading
                id="principles-heading"
                eyebrow="Engineering philosophy"
                title="Principles I keep coming back to"
                description="These are not slogans. They are the checks I use when a design decision is not obvious."
              />
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {about.principles.map((principle) => (
                  <Reveal key={principle.title}>
                    <Card className="h-full p-5">
                      <h3 className="font-display text-base font-semibold text-ink">
                        {principle.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                        {principle.detail}
                      </p>
                    </Card>
                  </Reveal>
                ))}
              </div>
            </section>

            <section aria-labelledby="approach-heading">
              <SectionHeading
                id="approach-heading"
                eyebrow="Problem solving"
                title="How I approach an unfamiliar problem"
                description="A repeatable process for understanding requirements before committing to an implementation."
              />
              <ol className="mt-6 space-y-3">
                {about.approach.map((step, index) => (
                  <li
                    key={step.title}
                    className="flex gap-4 rounded-2xl border border-line bg-white/[0.02] p-4 sm:p-5"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent/10 font-mono text-[0.65rem] text-indigo-200">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold text-ink">{step.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-ink-muted">
                        {step.detail}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section aria-labelledby="domains-heading">
              <SectionHeading
                id="domains-heading"
                eyebrow="Domain experience"
                title="Where the software meets the business"
                description="The operating context matters as much as the technology stack."
              />
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {about.domains.map((domain) => (
                  <Card key={domain.title} className="h-full p-5">
                    <h3 className="font-display text-base font-semibold text-ink">
                      {domain.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                      {domain.detail}
                    </p>
                  </Card>
                ))}
              </div>
            </section>

            <section aria-labelledby="interests-heading">
              <SectionHeading
                id="interests-heading"
                eyebrow="Current focus"
                title="Interests and ongoing learning"
                description="Areas I am actively exploring beyond day-to-day delivery."
              />
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Card className="p-5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-line-strong bg-white/[0.04] text-accent-cyan">
                    <Sparkles className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <h3 className="mt-3 text-sm font-semibold text-ink">Interests</h3>
                  <ul className="mt-3 space-y-2 text-sm text-ink-muted">
                    {about.interests.map((interest) => (
                      <li key={interest} className="flex gap-2">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent-cyan" />
                        {interest}
                      </li>
                    ))}
                  </ul>
                </Card>
                <Card className="p-5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-line-strong bg-white/[0.04] text-accent-cyan">
                    <BookOpen className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <h3 className="mt-3 text-sm font-semibold text-ink">
                    Currently learning
                  </h3>
                  <ul className="mt-3 space-y-2 text-sm text-ink-muted">
                    {about.learning.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            </section>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            {profileImage ? (
              <Card className="overflow-hidden p-0">
                <img
                  src={profileImage}
                  alt="Portrait of Sushant Buche"
                  width={720}
                  height={720}
                  loading="lazy"
                  decoding="async"
                  className="aspect-square w-full bg-surface object-cover"
                />
                <div className="border-t border-line p-4">
                  <p className="font-display text-sm font-semibold text-ink">
                    {personal.name}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-muted">{personal.title}</p>
                </div>
              </Card>
            ) : null}

            <Card className="p-5">
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-ink-faint">
                At a glance
              </p>
              <dl className="mt-4 space-y-4">
                {metrics.map((metric) => (
                  <div key={metric.id}>
                    <dt className="text-[0.68rem] text-ink-faint">{metric.label}</dt>
                    <dd className="mt-0.5 font-display text-lg font-semibold text-ink">
                      {metric.value}
                    </dd>
                    {metric.detail ? (
                      <dd className="text-[0.65rem] text-ink-faint">{metric.detail}</dd>
                    ) : null}
                  </div>
                ))}
                <div>
                  <dt className="text-[0.68rem] text-ink-faint">Based in</dt>
                  <dd className="mt-0.5 text-sm text-ink">{personal.location}</dd>
                  <dd className="text-[0.65rem] text-ink-faint">{personal.timezone}</dd>
                </div>
              </dl>
            </Card>

            <Card className="p-5">
              <h2 className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-ink-faint">
                Working style
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                I prefer clear contracts, small verified increments, and production
                feedback over assumptions. Documentation and observability are part of
                the work, not an afterthought.
              </p>
            </Card>

            <Card className="p-5">
              <h2 className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-ink-faint">
                Experience note
              </h2>
              <p className="mt-3 text-xs leading-relaxed text-ink-faint">
                Employer-specific details are kept private. Public experience is
                published only when it has been verified and is appropriate to share.
              </p>
            </Card>
          </aside>
        </div>
      </Container>
    </>
  );
}
