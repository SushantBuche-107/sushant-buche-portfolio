import type { Article, Project } from "@/types/portfolio";
import {
  getAboutContent,
  getContactEmail,
  getContactPhone,
  getPersonalProfile,
  getProfileImage,
  getProjectCover,
  getPublishedProjects,
  getSiteConfig,
  getSiteUrlForSeo,
  getVisibleSkills,
  getVisibleSocialLinks,
} from "@/lib/portfolio";
import { getAbsoluteUrl } from "@/lib/url";

export type JsonLd = Record<string, unknown>;

export function createPersonJsonLd(): JsonLd {
  const personal = getPersonalProfile();
  const site = getSiteConfig();
  const siteUrl = getSiteUrlForSeo();
  const profileImage = getProfileImage();
  const sameAs = getVisibleSocialLinks()
    .map((link) => link.href)
    .filter((href) => /^https?:/i.test(href));
  const email = getContactEmail();
  const phone = getContactPhone();

  const person: JsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: personal.name,
    jobTitle: personal.title,
    description: getAboutContent().intro,
    knowsAbout: getVisibleSkills()
      .flatMap((category) => category.items.map((item) => item.name))
      .filter(Boolean),
    homeLocation: {
      "@type": "Place",
      name: personal.location,
    },
  };

  if (siteUrl) person.url = siteUrl;
  if (profileImage) {
    person.image = siteUrl
      ? getAbsoluteUrl(profileImage, site.domain)
      : profileImage;
  }
  if (sameAs.length) person.sameAs = sameAs;
  if (email) person.email = email;
  if (phone) person.telephone = phone;

  return person;
}

export function createWebSiteJsonLd(): JsonLd {
  const site = getSiteConfig();
  const siteUrl = getSiteUrlForSeo();

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.shortTitle,
    description: site.defaultDescription,
    ...(siteUrl ? { url: siteUrl } : {}),
  };
}

export function createProjectJsonLd(project: Project): JsonLd {
  const site = getSiteConfig();
  const siteUrl = getSiteUrlForSeo();
  const cover = getProjectCover(project);
  const url = siteUrl
    ? getAbsoluteUrl(`/projects/${project.slug}`, site.domain)
    : undefined;
  const image = cover
    ? siteUrl
      ? getAbsoluteUrl(cover, site.domain)
      : cover
    : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    creator: {
      "@type": "Person",
      name: getPersonalProfile().name,
    },
    keywords: project.technologies.join(", "),
    ...(url ? { url } : {}),
    ...(image ? { image } : {}),
    ...(project.categories.length
      ? { about: project.categories.join(", ") }
      : {}),
    ...(project.timeline ? { temporalCoverage: project.timeline } : {}),
  };
}

export function createArticleJsonLd(article: Article): JsonLd {
  const site = getSiteConfig();
  const siteUrl = getSiteUrlForSeo();
  const personal = getPersonalProfile();
  const url = siteUrl
    ? getAbsoluteUrl(`/blog/${article.slug}`, site.domain)
    : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.summary,
    datePublished: article.publicationDate,
    author: {
      "@type": "Person",
      name: personal.name,
    },
    ...(url ? { mainEntityOfPage: url, url } : {}),
    ...(article.coverImage ? { image: article.coverImage } : {}),
    ...(article.tags.length ? { keywords: article.tags.join(", ") } : {}),
  };
}

export function createBreadcrumbJsonLd(
  items: { name: string; path: string }[],
): JsonLd {
  const site = getSiteConfig();
  const siteUrl = getSiteUrlForSeo();

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(siteUrl ? { item: getAbsoluteUrl(item.path, site.domain) } : {}),
    })),
  };
}

export function getProjectListItemJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: getPublishedProjects().map((project, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `/projects/${project.slug}`,
      name: project.title,
    })),
  };
}
