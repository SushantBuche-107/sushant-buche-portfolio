import { ArrowRight, PenLine } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { formatFullDate, formatReadingTime } from "@/lib/format";
import { getArticlePath } from "@/lib/portfolio";
import { getSafeAssetUrl } from "@/lib/url";
import type { Article } from "@/types/portfolio";

function getReadingTime(article: Article): number {
  if (article.readingTimeMinutes && article.readingTimeMinutes > 0) {
    return article.readingTimeMinutes;
  }
  const words = article.body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export function ArticleCard({ article }: { article: Article }): React.ReactElement {
  const cover = getSafeAssetUrl(article.coverImage);
  const date = formatFullDate(article.publicationDate);
  const readingTime = formatReadingTime(getReadingTime(article));

  return (
    <article className="surface-card interactive-card group flex h-full flex-col overflow-hidden rounded-2xl">
      <div className="relative aspect-[16/9] overflow-hidden border-b border-line bg-surface-subtle">
        {cover ? (
          <img
            src={cover}
            alt={article.coverAlt?.trim() || `${article.title} cover image`}
            width={640}
            height={360}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="relative flex h-full items-center justify-center bg-[radial-gradient(circle_at_25%_20%,rgba(99,102,241,0.2),transparent_55%)]">
            <div aria-hidden="true" className="absolute inset-0 grid-backdrop opacity-60" />
            <PenLine className="relative h-8 w-8 text-accent-cyan" aria-hidden="true" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.62rem] uppercase tracking-[0.13em] text-ink-faint">
          {date ? <span>{date}</span> : null}
          {date && readingTime ? <span aria-hidden="true">·</span> : null}
          {readingTime ? <span>{readingTime}</span> : null}
        </div>

        <h3 className="mt-3 font-display text-lg font-semibold leading-snug text-ink">
          <Link
            to={getArticlePath(article.slug)}
            className="rounded-sm transition-colors hover:text-indigo-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {article.title}
          </Link>
        </h3>

        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-muted">
          {article.summary}
        </p>

        {article.tags.length > 0 ? (
          <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Tags">
            {article.tags.slice(0, 4).map((tag) => (
              <li key={tag}>
                <Badge variant="outline">{tag}</Badge>
              </li>
            ))}
          </ul>
        ) : null}

        <Link
          to={getArticlePath(article.slug)}
          className="mt-auto inline-flex items-center gap-1.5 border-t border-line pt-4 text-xs font-medium text-accent-cyan transition-colors hover:text-cyan-200"
        >
          Read article
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
