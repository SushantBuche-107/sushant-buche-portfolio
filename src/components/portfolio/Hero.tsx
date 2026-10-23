import { ArrowRight, Download, FileText, MapPin } from "lucide-react";
import { HeroVisual } from "@/components/three/HeroVisual";
import { Badge, TechBadge } from "@/components/ui/badge";
import { ActionLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import {
  getContactChannels,
  getHeroTechnologies,
  getPersonalProfile,
  getProfileImage,
  getPublishedProjects,
  getResumeUrl,
} from "@/lib/portfolio";

export function Hero(): React.ReactElement {
  const personal = getPersonalProfile();
  const technologies = getHeroTechnologies();
  const resumeUrl = getResumeUrl();
  const contactChannels = getContactChannels();
  const profileImage = getProfileImage();
  const projects = getPublishedProjects();

  const projectCount = projects.length;
  const experienceYears = "2.8+";
  const focusArea = "Backend • APIs • Cloud • Data";

  return (
    <section className="relative overflow-hidden" aria-labelledby="hero-heading">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 grid-backdrop opacity-70"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-0 -z-10 h-[34rem] w-[34rem] rounded-full bg-accent/10 blur-[110px] motion-safe:animate-[pulse_14s_ease-in-out_infinite]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-32 -z-10 h-[26rem] w-[26rem] rounded-full bg-accent-cyan/[0.07] blur-[100px] motion-safe:animate-[pulse_18s_ease-in-out_infinite]"
      />

      <Container>
        <div className="grid items-center gap-10 pb-12 pt-12 sm:pb-16 sm:pt-16 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10 lg:pb-24 lg:pt-24 xl:grid-cols-[1.12fr_0.88fr]">
          <div className="relative z-10 max-w-2xl">
            <div className="hero-fade-up" style={{ animationDelay: "40ms" }}>
              {profileImage ? (
                <div className="mb-6 flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={profileImage}
                      alt="Portrait of Sushant Buche"
                      width={720}
                      height={720}
                      className="h-16 w-16 rounded-2xl border border-line-strong bg-surface object-cover shadow-[0_40px_80px_-60px_rgba(99,102,241,0.9)] sm:h-20 sm:w-20"
                    />
                    <span
                      aria-hidden="true"
                      className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-success shadow-[0_0_0_6px_rgba(52,211,153,0.12)]"
                    />
                  </div>
                  <div>
                    <p className="font-display text-base font-semibold text-ink sm:text-lg">
                      {personal.name}
                    </p>
                    <p className="mt-1 max-w-xs font-mono text-[0.6rem] uppercase tracking-[0.16em] text-ink-faint">
                      {personal.altTitle}
                    </p>
                  </div>
                </div>
              ) : null}
            </div>

            <div
              className="hero-fade-up flex flex-wrap items-center gap-2.5"
              style={{ animationDelay: "90ms" }}
            >
              <Badge variant="cyan">{personal.title}</Badge>
              {personal.availability.show && personal.availability.label ? (
                <Badge variant="success" className="gap-1.5">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success/70" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
                  </span>
                  {personal.availability.label}
                </Badge>
              ) : null}
              <span className="hidden items-center gap-2 rounded-full border border-line bg-surface/60 px-3 py-1 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-ink-faint sm:inline-flex">
                {focusArea}
              </span>
            </div>

            <h1
              id="hero-heading"
              className="hero-fade-up mt-6 text-display-xl text-balance text-ink"
              style={{ animationDelay: "140ms" }}
            >
              {personal.tagline}
            </h1>

            <p
              className="hero-fade-up mt-5 max-w-xl text-base leading-relaxed text-ink-muted sm:mt-6 sm:text-lg"
              style={{ animationDelay: "190ms" }}
            >
              {personal.shortBio}
            </p>

            <div
              className="hero-fade-up mt-8 grid w-full grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 lg:flex lg:flex-wrap"
              style={{ animationDelay: "240ms" }}
            >
              <ActionLink to="/projects" size="lg" className="sm:col-span-2 lg:col-span-auto">
                Explore My Work
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </ActionLink>
              {resumeUrl ? (
                <ActionLink
                  href={resumeUrl}
                  download
                  variant="secondary"
                  size="lg"
                >
                  <Download className="h-4 w-4" aria-hidden="true" />
                  Download Resume
                </ActionLink>
              ) : (
                <ActionLink to="/resume" variant="secondary" size="lg">
                  <FileText className="h-4 w-4" aria-hidden="true" />
                  View Resume
                </ActionLink>
              )}
              {contactChannels.hasAny ? (
                <ActionLink to="/contact" variant="ghost" size="lg">
                  Contact Me
                </ActionLink>
              ) : null}
            </div>

            <dl
              className="hero-fade-up mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3"
              style={{ animationDelay: "290ms" }}
            >
              <div className="group relative overflow-hidden rounded-2xl border border-line bg-surface/60 px-4 py-3 transition hover:border-line-strong">
                <dt className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-ink-faint">
                  Experience
                </dt>
                <dd className="mt-1 font-display text-lg text-ink">
                  {experienceYears} years
                </dd>
              </div>
              <div className="group relative overflow-hidden rounded-2xl border border-line bg-surface/60 px-4 py-3 transition hover:border-line-strong">
                <dt className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-ink-faint">
                  Projects
                </dt>
                <dd className="mt-1 font-display text-lg text-ink">
                  {projectCount}+ shipped
                </dd>
              </div>
              <div className="group relative col-span-2 overflow-hidden rounded-2xl border border-line bg-surface/60 px-4 py-3 transition hover:border-line-strong sm:col-span-1">
                <dt className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-ink-faint">
                  Focus
                </dt>
                <dd className="mt-1 truncate font-display text-lg text-ink">
                  {focusArea}
                </dd>
              </div>
            </dl>

            <div
              className="hero-fade-up mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-ink-faint"
              style={{ animationDelay: "340ms" }}
            >
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                {personal.location}
              </span>
              {personal.timezone ? (
                <span className="font-mono text-[0.6rem] uppercase tracking-[0.16em]">
                  {personal.timezone}
                </span>
              ) : null}
              <span className="hidden font-mono text-[0.6rem] uppercase tracking-[0.16em] sm:inline">
                Open to opportunities
              </span>
            </div>

            {technologies.length > 0 ? (
              <ul
                className="hero-fade-up mt-7 flex max-w-xl flex-wrap gap-1.5"
                aria-label="Primary technologies"
                style={{ animationDelay: "390ms" }}
              >
                {technologies.map((technology) => (
                  <li key={technology}>
                    <TechBadge>{technology}</TechBadge>
                  </li>
                ))}
              </ul>
            ) : null}

            <div
              className="hero-fade-up mt-10 hidden items-center gap-2 text-[0.7rem] text-ink-faint lg:flex"
              style={{ animationDelay: "440ms" }}
            >
              <span className="h-px w-8 bg-gradient-to-r from-transparent to-line-strong" />
              <span className="font-mono uppercase tracking-[0.18em]">
                Scroll to explore
              </span>
              <span className="h-px w-16 bg-gradient-to-r from-line-strong to-transparent" />
            </div>
          </div>

          <div className="relative -mx-4 sm:mx-0 lg:pl-6">
            <HeroVisual />
          </div>
        </div>
      </Container>
    </section>
  );
}
