const DEFAULT_FALLBACK = "";

export function formatDate(
  value?: string | null,
  options: Intl.DateTimeFormatOptions = { month: "short", year: "numeric" },
  fallback = DEFAULT_FALLBACK,
): string {
  if (!value) return fallback;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;

  return new Intl.DateTimeFormat("en", options).format(date);
}

export function formatMonthYear(value?: string | null, fallback = ""): string {
  return formatDate(value, { month: "short", year: "numeric" }, fallback);
}

export function formatFullDate(value?: string | null, fallback = ""): string {
  return formatDate(
    value,
    { day: "numeric", month: "long", year: "numeric" },
    fallback,
  );
}

export function formatLongMonthYear(value?: string | null, fallback = ""): string {
  return formatDate(value, { month: "long", year: "numeric" }, fallback);
}

export function formatReadingTime(minutes?: number | null): string {
  if (!minutes || minutes < 1) return "";
  return `${Math.round(minutes)} min read`;
}

export function getCopyrightYear(date = new Date()): number {
  return date.getFullYear();
}

export function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export function stripControlCharacters(value: string): string {
  return Array.from(value)
    .filter((character) => {
      const code = character.charCodeAt(0);
      return !(
        code <= 8 ||
        code === 11 ||
        code === 12 ||
        (code >= 14 && code <= 31) ||
        code === 127
      );
    })
    .join("");
}

export function truncate(value: string, maxLength: number): string {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, Math.max(0, maxLength - 1)).trimEnd()}…`;
}

export function pluralize(count: number, singular: string, plural?: string): string {
  return count === 1 ? singular : (plural ?? `${singular}s`);
}
