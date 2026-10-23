import portfolioData from "@/data/portfolioData.json";
import { isValidEmail } from "@/lib/email";
import { formatFullDate } from "@/lib/format";
import {
  getSafeAssetUrl,
  getSafeExternalUrl,
  getSiteUrl,
} from "@/lib/url";
import type {
  AboutContent,
  Article,
  CertificationRecord,
  ContactConfig,
  ContactMode,
  EducationRecord,
  ExperienceRecord,
  FooterConfig,
  Highlight,
  Metric,
  NavigationItem,
  PersonalProfile,
  PortfolioData,
  Project,
  ResumeConfig,
  ResumeVariant,
  SiteConfig,
  SkillCategory,
  SocialKey,
  SocialLinks,
} from "@/types/portfolio";

export interface PortfolioRepository {
  load(): PortfolioData;
}

const data = portfolioData as unknown as PortfolioData;

export const jsonPortfolioRepository: PortfolioRepository = {
  load: () => data,
};

export function getPortfolioData(): PortfolioData {
  return jsonPortfolioRepository.load();
}

export function getSiteConfig(): SiteConfig {
  return getPortfolioData().site;
}

export function getPersonalProfile(): PersonalProfile {
  return getPortfolioData().personal;
}

export function getAboutContent(): AboutContent {
  return getPortfolioData().about;
}

export function getContactConfig(): ContactConfig {
  return getPortfolioData().contact;
}

export function getFooterConfig(): FooterConfig {
  return getPortfolioData().footer;
}

export function getVisibleNavigation(): NavigationItem[] {
  return getPortfolioData().navigation.filter(
    (item) => item.show && item.label.trim() && item.to.trim(),
  );
}

export function getFallbackText(
  value?: string | null,
  fallback = "",
): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallback;
}

export function getInitials(
  name = getPersonalProfile().name,
  configured = getPersonalProfile().initials,
): string {
  const fromConfig = configured?.trim();
  if (fromConfig) return fromConfig.slice(0, 3).toUpperCase();

  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function getVisibleMetrics(): Metric[] {
  return getPortfolioData().metrics.filter(
    (metric) => metric.label.trim() && metric.value.trim(),
  );
}

export function getVisibleHighlights(): Highlight[] {
  return getPortfolioData().highlights.filter(
    (highlight) => highlight.show && highlight.label.trim(),
  );
}

const SOCIAL_LABELS: Record<SocialKey, string> = {
  github: "GitHub",
  linkedin: "LinkedIn",
  naukri: "Naukri",
  leetcode: "LeetCode",
  twitter: "X / Twitter",
  website: "Website",
  email: "Email",
};

export interface SocialLink {
  key: SocialKey;
  label: string;
  href: string;
}

function socialEntries(socials: SocialLinks): [SocialKey, string][] {
  const order: SocialKey[] = [
    "linkedin",
    "github",
    "naukri",
    "leetcode",
    "twitter",
    "website",
    "email",
  ];

  return order
    .map((key) => [key, socials[key]?.trim() ?? ""] as [SocialKey, string])
    .filter(([, value]) => value.length > 0);
}

export function getVisibleSocialLinks(): SocialLink[] {
  const personal = getPersonalProfile();
  const contact = getContactConfig();
  const links: SocialLink[] = [];

  for (const [key, value] of socialEntries(personal.socials)) {
    if (key === "email") {
      const email = getContactEmail();
      if (!email) continue;
      const href = getSafeExternalUrl(`mailto:${email}`);
      if (href) links.push({ key, label: SOCIAL_LABELS[key], href });
      continue;
    }

    const href = getSafeExternalUrl(value);
    if (href) links.push({ key, label: SOCIAL_LABELS[key], href });
  }

  if (
    contact.showEmail &&
    !links.some((link) => link.key === "email")
  ) {
    const email = getContactEmail();
    const href = email ? getSafeExternalUrl(`mailto:${email}`) : undefined;
    if (href) links.push({ key: "email", label: "Email", href });
  }

  return links;
}

export function getContactEmail(): string | undefined {
  const contact = getContactConfig();
  if (!contact.enabled || !contact.showEmail) return undefined;

  const personal = getPersonalProfile();
  const candidate = personal.email.trim() || personal.socials.email?.trim() || "";
  return isValidEmail(candidate) ? candidate : undefined;
}

export function getContactPhone(): string | undefined {
  const contact = getContactConfig();
  if (!contact.enabled || !contact.showPhone) return undefined;

  const phone = getPersonalProfile().phone.trim();
  return phone || undefined;
}

export function getBookingUrl(): string | undefined {
  const contact = getContactConfig();
  if (!contact.enabled) return undefined;
  return getSafeExternalUrl(contact.bookingUrl);
}

export interface ContactChannels {
  email?: string;
  phone?: string;
  bookingUrl?: string;
  socials: SocialLink[];
  hasAny: boolean;
}

export function getContactChannels(): ContactChannels {
  const email = getContactEmail();
  const phone = getContactPhone();
  const bookingUrl = getBookingUrl();
  const socials = getVisibleSocialLinks();

  return {
    email,
    phone,
    bookingUrl,
    socials,
    hasAny: Boolean(email || phone || bookingUrl || socials.length > 0),
  };
}

export function getEffectiveContactMode(): ContactMode {
  const contact = getContactConfig();
  if (!contact.enabled) return "none";

  if (contact.mode === "endpoint") {
    return getSafeExternalUrl(contact.endpoint) ? "endpoint" : "none";
  }

  if (contact.mode === "mailto" && getContactEmail()) {
    return "mailto";
  }

  return "none";
}

export function getContactEndpoint(): string | undefined {
  if (getEffectiveContactMode() !== "endpoint") return undefined;
  return getSafeExternalUrl(getContactConfig().endpoint);
}

export function getResumeConfig(): ResumeConfig {
  return getPortfolioData().resume;
}

export function getResumeUrl(): string | undefined {
  const personal = getPersonalProfile();
  const direct = getSafeAssetUrl(personal.resumeUrl);
  if (direct) return direct;

  const defaultVariant = getResumeVariants().find(
    (variant) => variant.isDefault,
  );
  return defaultVariant ? getSafeAssetUrl(defaultVariant.url) : undefined;
}

export function getResumeVariants(): ResumeVariant[] {
  return getPortfolioData().resumes
    .filter((resume) => resume.label.trim() && getSafeAssetUrl(resume.url))
    .sort((a, b) => Number(Boolean(b.isDefault)) - Number(Boolean(a.isDefault)));
}

export function getPublishedProjects(): Project[] {
  return getPortfolioData().projects
    .filter(
      (project) =>
        project.status === "published" &&
        project.slug.trim() &&
        project.title.trim() &&
        project.summary.trim(),
    )
    .sort((a, b) => Number(b.featured) - Number(a.featured));
}

export function getFeaturedProjects(): Project[] {
  return getPublishedProjects().filter((project) => project.featured);
}

export function getProjectBySlug(slug?: string): Project | undefined {
  if (!slug) return undefined;
  return getPublishedProjects().find((project) => project.slug === slug);
}

export function getProjectCategories(): string[] {
  const seen = new Set<string>();
  for (const project of getPublishedProjects()) {
    for (const category of project.categories) {
      const trimmed = category.trim();
      if (trimmed) seen.add(trimmed);
    }
  }
  return [...seen];
}

export function getRelatedProjects(
  project: Project,
  limit = 2,
): Project[] {
  const related = (project.relatedSlugs ?? [])
    .map((slug) => getProjectBySlug(slug))
    .filter((candidate): candidate is Project => Boolean(candidate));

  if (related.length > 0) return related.slice(0, limit);

  return getPublishedProjects()
    .filter(
      (candidate) =>
        candidate.slug !== project.slug &&
        candidate.categories.some((category) =>
          project.categories.includes(category),
        ),
    )
    .slice(0, limit);
}

export function getPublishedArticles(): Article[] {
  return getPortfolioData().articles
    .filter(
      (article) =>
        article.published &&
        article.slug.trim() &&
        article.title.trim() &&
        article.publicationDate.trim(),
    )
    .sort(
      (a, b) =>
        new Date(b.publicationDate).getTime() -
        new Date(a.publicationDate).getTime(),
    );
}

export function getArticleBySlug(slug?: string): Article | undefined {
  if (!slug) return undefined;
  return getPublishedArticles().find((article) => article.slug === slug);
}

export function getRelatedArticles(article: Article, limit = 2): Article[] {
  return getPublishedArticles()
    .filter(
      (candidate) =>
        candidate.slug !== article.slug &&
        candidate.tags.some((tag) => article.tags.includes(tag)),
    )
    .slice(0, limit);
}

export function getVisibleSkills(): SkillCategory[] {
  return getPortfolioData().skills.filter(
    (category) =>
      category.name.trim() &&
      category.items.some((item) => item.name.trim()),
  );
}

export function getHeroTechnologies(): string[] {
  return getSiteConfig().heroTechnologies.filter((item) => item.trim());
}

export function getVisibleExperience(): ExperienceRecord[] {
  return getPortfolioData().experience.filter(
    (record) =>
      record.employer.trim() &&
      record.role.trim() &&
      record.startDate.trim() &&
      record.summary.trim(),
  );
}

export function getVisibleEducation(): EducationRecord[] {
  return getPortfolioData().education.filter(
    (record) => record.qualification.trim() && record.institution.trim(),
  );
}

export function getVisibleCertifications(): CertificationRecord[] {
  return getPortfolioData().certifications.filter(
    (record) => record.name.trim() && record.issuer.trim(),
  );
}

export function getProfileImage(): string | undefined {
  return getSafeAssetUrl(getPersonalProfile().profileImage);
}

export function getProjectCover(project: Project): string | undefined {
  return getSafeAssetUrl(project.coverImage);
}

export function getProjectLink(
  value?: string,
): string | undefined {
  return getSafeExternalUrl(value);
}

export function getProjectPath(slug: string): string {
  return `/projects/${slug}`;
}

export function getArticlePath(slug: string): string {
  return `/blog/${slug}`;
}

export function getSiteUrlForSeo(): string | undefined {
  return getSiteUrl(getSiteConfig().domain);
}

export function getBuildDate(): Date {
  const buildTime =
    typeof __BUILD_TIME__ === "string" ? __BUILD_TIME__ : "";
  const date = new Date(buildTime);
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

export function getLastUpdatedLabel(): string | undefined {
  const site = getSiteConfig();
  if (!site.showLastUpdated) return undefined;

  const buildDate = getBuildDate();
  return formatFullDate(buildDate.toISOString());
}
