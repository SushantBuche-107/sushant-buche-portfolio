import { useEffect } from "react";
import { getSiteConfig, getSiteUrlForSeo } from "@/lib/portfolio";
import type { JsonLd } from "@/lib/seo-jsonld";
import { getAbsoluteUrl, getSafeAssetUrl } from "@/lib/url";

export interface SeoProps {
  title?: string;
  description?: string;
  path: string;
  image?: string;
  type?: "website" | "article" | "profile";
  noindex?: boolean;
  jsonLd?: JsonLd | JsonLd[];
  article?: {
    publishedTime?: string;
    tags?: string[];
  };
}

function upsertMeta(
  attribute: "name" | "property",
  key: string,
  content?: string,
): void {
  const selector = `meta[${attribute}="${key}"]`;
  const existing = document.head.querySelector<HTMLMetaElement>(selector);

  if (!content) {
    existing?.remove();
    return;
  }

  if (existing) {
    existing.setAttribute("content", content);
    return;
  }

  const element = document.createElement("meta");
  element.setAttribute(attribute, key);
  element.setAttribute("content", content);
  document.head.appendChild(element);
}

function upsertLink(
  rel: string,
  href?: string,
  extra?: Record<string, string>,
): void {
  const selector = `link[rel="${rel}"]`;
  const existing = document.head.querySelector<HTMLLinkElement>(selector);

  if (!href) {
    existing?.remove();
    return;
  }

  const element = existing ?? document.createElement("link");
  element.setAttribute("rel", rel);
  element.setAttribute("href", href);
  for (const [key, value] of Object.entries(extra ?? {})) {
    element.setAttribute(key, value);
  }

  if (!existing) document.head.appendChild(element);
}

function setMetaList(
  attribute: "name" | "property",
  key: string,
  values: string[],
): void {
  document
    .querySelectorAll(`meta[${attribute}="${key}"]`)
    .forEach((element) => element.remove());

  for (const value of values) {
    const element = document.createElement("meta");
    element.setAttribute(attribute, key);
    element.setAttribute("content", value);
    document.head.appendChild(element);
  }
}

export function Seo({
  title,
  description,
  path,
  image,
  type = "website",
  noindex = false,
  jsonLd,
  article,
}: SeoProps): null {
  const jsonLdString = jsonLd ? JSON.stringify(jsonLd) : "";

  useEffect(() => {
    const site = getSiteConfig();
    const siteUrl = getSiteUrlForSeo();
    const pageTitle =
      !title || title === site.title
        ? site.title
        : `${title} | ${site.shortTitle}`;
    const pageDescription = description?.trim() || site.defaultDescription;
    const safeImage =
      getSafeAssetUrl(image) ||
      getSafeAssetUrl(site.defaultOgImage) ||
      undefined;
    const absoluteImage = safeImage
      ? siteUrl
        ? getAbsoluteUrl(safeImage, site.domain)
        : safeImage
      : undefined;
    const canonical = siteUrl ? getAbsoluteUrl(path, site.domain) : undefined;

    document.title = pageTitle;
    document.documentElement.lang = site.locale.split("-")[0] || "en";

    upsertMeta("name", "description", pageDescription);
    upsertMeta("name", "keywords", site.keywords.join(", "));
    upsertMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow");
    upsertMeta("name", "theme-color", site.themeColor);
    upsertMeta("property", "og:title", pageTitle);
    upsertMeta("property", "og:description", pageDescription);
    upsertMeta("property", "og:type", type);
    upsertMeta("property", "og:site_name", site.shortTitle);
    upsertMeta("property", "og:locale", site.locale.replace("-", "_"));
    upsertMeta("property", "og:url", canonical);
    upsertMeta("property", "og:image", absoluteImage);
    upsertMeta("property", "og:image:alt", absoluteImage ? `${site.shortTitle} portfolio preview` : undefined);
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", pageTitle);
    upsertMeta("name", "twitter:description", pageDescription);
    upsertMeta("name", "twitter:image", absoluteImage);
    upsertLink("canonical", canonical);

    if (article?.publishedTime) {
      upsertMeta("property", "article:published_time", article.publishedTime);
    } else {
      upsertMeta("property", "article:published_time");
    }

    setMetaList("property", "article:tag", article?.tags ?? []);

    let script = document.head.querySelector<HTMLScriptElement>(
      'script[data-seo-structured="true"]',
    );

    if (jsonLdString) {
      if (!script) {
        script = document.createElement("script");
        script.type = "application/ld+json";
        script.dataset.seoStructured = "true";
        document.head.appendChild(script);
      }
      script.textContent = jsonLdString;
    } else {
      script?.remove();
    }

    return () => {
      document
        .querySelector('script[data-seo-structured="true"]')
        ?.remove();
    };
  }, [
    article?.publishedTime,
    article?.tags,
    description,
    image,
    jsonLdString,
    noindex,
    path,
    title,
    type,
  ]);

  return null;
}
