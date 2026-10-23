import { Download, FileText, Printer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, ActionLink } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { formatMonthYear } from "@/lib/format";
import {
  getAboutContent,
  getContactChannels,
  getPersonalProfile,
  getPublishedProjects,
  getResumeConfig,
  getResumeUrl,
  getResumeVariants,
  getVisibleCertifications,
  getVisibleEducation,
  getVisibleExperience,
  getVisibleSkills,
} from "@/lib/portfolio";

export function ResumeView(): React.ReactElement {
  const personal = getPersonalProfile();
  const about = getAboutContent();
  const resume = getResumeConfig();
  const resumeUrl = getResumeUrl();
  const variants = getResumeVariants();
  const skills = getVisibleSkills();
  const projects = getPublishedProjects().slice(0, 3);
  const experience = getVisibleExperience();
  const education = getVisibleEducation();
  const certifications = getVisibleCertifications();
  const channels = getContactChannels();

  const summary = resume.summary.trim() || personal.bio.trim();
  const skillsText = skills
    .map(
      (category) =>
        `${category.name}: ${category.items.map((item) => item.name).join(", ")}`,
    )
    .join("\n");
  const contactLinks = channels.socials.filter((social) => social.key !== "email");

  return (
    <div>
      <div className="no-print mb-8 flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {resumeUrl ? (
            <>
              <ActionLink href={resumeUrl} download size="md">
                <Download className="h-4 w-4" aria-hidden="true" />
                Download PDF
              </ActionLink>
              <ActionLink
                href={resumeUrl}
                external
                variant="secondary"
                size="md"
              >
                <FileText className="h-4 w-4" aria-hidden="true" />
                Open in new tab
              </ActionLink>
            </>
          ) : null}

          {resume.printEnabled ? (
            <Button
              variant={resumeUrl ? "outline" : "primary"}
              size="md"
              onClick={() => window.print()}
            >
              <Printer className="h-4 w-4" aria-hidden="true" />
              Print / Save as PDF
            </Button>
          ) : null}

          <CopyButton text={summary} label="Copy summary" />
          <CopyButton text={skillsText} label="Copy skills" />
        </div>

        {variants.length > 1 ? (
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-ink-faint">
              Variants
            </span>
            {variants.map((variant) => (
              <ActionLink
                key={variant.id}
                href={variant.url}
                download
                variant={variant.isDefault ? "subtle" : "outline"}
                size="sm"
              >
                <Download className="h-3.5 w-3.5" aria-hidden="true" />
                {variant.label}
                {variant.isDefault ? (
                  <Badge variant="cyan">Default</Badge>
                ) : null}
              </ActionLink>
            ))}
          </div>
        ) : null}

        {!resumeUrl ? (
          <p className="max-w-2xl rounded-xl border border-warning/25 bg-warning/[0.06] px-4 py-3 text-xs leading-relaxed text-amber-100/90">
            {resume.downloadNote}
          </p>
        ) : null}
      </div>

      <article className="resume-sheet mx-auto max-w-4xl rounded-2xl p-6 text-slate-900 shadow-2xl sm:p-10">
        <header className="border-b-2 border-slate-900 pb-5">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <h2 className="font-display text-3xl font-semibold tracking-tight text-slate-950">
                {personal.name}
              </h2>
              <p className="mt-1 text-base font-medium text-slate-700">
                {personal.title}
              </p>
              <p className="mt-1 text-xs text-slate-500">{personal.location}</p>
            </div>
            <div className="text-xs leading-relaxed text-slate-600 sm:text-right">
              {channels.email ? (
                <p>
                  <a href={`mailto:${channels.email}`}>{channels.email}</a>
                </p>
              ) : null}
              {channels.phone ? <p>{channels.phone}</p> : null}
              {contactLinks.length > 0 ? (
                <p className="mt-1 flex flex-wrap gap-x-2 gap-y-1 sm:justify-end">
                  {contactLinks.map((link) => (
                    <a key={link.key} href={link.href}>
                      {link.label}
                    </a>
                  ))}
                </p>
              ) : null}
            </div>
          </div>
        </header>

        <div className="mt-6 space-y-6">
          <section aria-labelledby="resume-summary">
            <h3
              id="resume-summary"
              className="border-b border-slate-200 pb-1 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-slate-500"
            >
              Professional summary
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">
              {summary}
            </p>
          </section>

          <section aria-labelledby="resume-skills">
            <h3
              id="resume-skills"
              className="border-b border-slate-200 pb-1 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-slate-500"
            >
              Technical skills
            </h3>
            <div className="mt-3 grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {skills.map((category) => (
                <div key={category.id} className="break-inside-avoid">
                  <h4 className="text-xs font-semibold text-slate-800">
                    {category.name}
                  </h4>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600">
                    {category.items.map((item) => item.name).join(", ")}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="resume-experience">
            <h3
              id="resume-experience"
              className="border-b border-slate-200 pb-1 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-slate-500"
            >
              Professional experience
            </h3>

            {experience.length > 0 ? (
              <ol className="mt-3 space-y-4">
                {experience.map((record) => (
                  <li key={record.id} className="break-inside-avoid">
                    <div className="flex flex-col justify-between gap-1 sm:flex-row">
                      <h4 className="text-sm font-semibold text-slate-900">
                        {record.role} · {record.employer}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {formatMonthYear(record.startDate)} —{" "}
                        {record.current
                          ? "Present"
                          : formatMonthYear(record.endDate, "Present")}
                      </p>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-slate-600">
                      {record.summary}
                    </p>
                    {record.achievements?.length ? (
                      <ul className="mt-2 list-disc space-y-1 pl-4 text-xs leading-relaxed text-slate-600">
                        {record.achievements.map((achievement) => (
                          <li key={achievement}>{achievement}</li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                ))}
              </ol>
            ) : (
              <div className="mt-3 space-y-2 text-xs leading-relaxed text-slate-600">
                <p>{about.intro}</p>
                <ul className="list-disc space-y-1 pl-4">
                  {about.domains.map((domain) => (
                    <li key={domain.title}>
                      <span className="font-medium text-slate-800">
                        {domain.title}:
                      </span>{" "}
                      {domain.detail}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {projects.length > 0 ? (
            <section aria-labelledby="resume-projects">
              <h3
                id="resume-projects"
                className="border-b border-slate-200 pb-1 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-slate-500"
              >
                Selected projects
              </h3>
              <ul className="mt-3 space-y-3">
                {projects.map((project) => (
                  <li key={project.slug} className="break-inside-avoid">
                    <h4 className="text-sm font-semibold text-slate-900">
                      {project.title}
                    </h4>
                    <p className="mt-1 text-xs leading-relaxed text-slate-600">
                      {project.summary}
                    </p>
                    <p className="mt-1 text-[0.68rem] text-slate-500">
                      {project.technologies.join(" · ")}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {education.length > 0 ? (
            <section aria-labelledby="resume-education">
              <h3
                id="resume-education"
                className="border-b border-slate-200 pb-1 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-slate-500"
              >
                Education
              </h3>
              <ul className="mt-3 space-y-2">
                {education.map((record) => (
                  <li key={record.id} className="break-inside-avoid">
                    <div className="flex flex-col justify-between gap-1 sm:flex-row">
                      <h4 className="text-sm font-semibold text-slate-900">
                        {record.qualification}
                      </h4>
                      {record.year ? (
                        <p className="text-xs text-slate-500">{record.year}</p>
                      ) : null}
                    </div>
                    <p className="text-xs text-slate-600">{record.institution}</p>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {certifications.length > 0 ? (
            <section aria-labelledby="resume-certifications">
              <h3
                id="resume-certifications"
                className="border-b border-slate-200 pb-1 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-slate-500"
              >
                Certifications
              </h3>
              <ul className="mt-3 space-y-2">
                {certifications.map((record) => (
                  <li key={record.id} className="break-inside-avoid">
                    <h4 className="text-sm font-semibold text-slate-900">
                      {record.name}
                    </h4>
                    <p className="text-xs text-slate-600">
                      {record.issuer}
                      {record.year ? ` · ${record.year}` : ""}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      </article>
    </div>
  );
}
