import { isValidEmail } from "@/lib/email";

const EXTERNAL_PROTOCOLS = new Set(["http:", "https:"]);
const ASSET_PROTOCOLS = new Set(["http:", "https:"]);

export function getSafeExternalUrl(value?: string | null): string | undefined {
  const raw = value?.trim();
  if (!raw) return undefined;

  if (raw.startsWith("//")) return undefined;

  if (raw.toLowerCase().startsWith("mailto:")) {
    const address = raw.slice(7).split("?")[0]?.trim() ?? "";
    return isValidEmail(address) ? raw : undefined;
  }

  if (raw.startsWith("/") || raw.startsWith("./") || raw.startsWith("../")) {
    return undefined;
  }

  try {
    const url = new URL(raw);
    if (!EXTERNAL_PROTOCOLS.has(url.protocol)) return undefined;
    return url.toString();
  } catch {
    return undefined;
  }
}

export function getSafeAssetUrl(value?: string | null): string | undefined {
  const raw = value?.trim();
  if (!raw) return undefined;

  if (raw.startsWith("//") || raw.includes("\0")) return undefined;

  if (raw.startsWith("/")) {
    return raw;
  }

  try {
    const url = new URL(raw);
    if (!ASSET_PROTOCOLS.has(url.protocol)) return undefined;
    return url.toString();
  } catch {
    return undefined;
  }
}

export function getSafeMailtoUrl(value?: string | null): string | undefined {
  const raw = value?.trim();
  if (!raw || !raw.toLowerCase().startsWith("mailto:")) return undefined;
  const address = raw.slice(7).split("?")[0]?.trim() ?? "";
  return isValidEmail(address) ? raw : undefined;
}

export function getSiteUrl(domain?: string | null): string | undefined {
  const raw = domain?.trim();
  if (!raw) return undefined;

  if (
    /^[a-z][a-z0-9+.-]*:\/\//i.test(raw) &&
    !/^https?:\/\//i.test(raw)
  ) {
    return undefined;
  }

  const candidate = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;

  try {
    const url = new URL(candidate);
    if (!EXTERNAL_PROTOCOLS.has(url.protocol)) return undefined;
    return url.origin;
  } catch {
    return undefined;
  }
}

export function getAbsoluteUrl(path: string, domain?: string | null): string {
  const siteUrl = getSiteUrl(domain);
  if (!siteUrl) return path.startsWith("/") ? path : `/${path}`;

  try {
    return new URL(path, siteUrl).toString();
  } catch {
    return siteUrl;
  }
}

export function isExternalHref(href: string): boolean {
  return /^(https?:)?\/\//i.test(href) || /^mailto:/i.test(href);
}
