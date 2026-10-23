import GithubSlugger from "github-slugger";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Link, useParams } from "react-router-dom";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { ArticleCard } from "@/components/portfolio/ArticleCard";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { formatFullDate, formatReadingTime } from "@/lib/format";
import {
  getArticleBySlug,
  getRelatedArticles,
} from "@/lib/portfolio";
import { getSafeAssetUrl, getSafeExternalUrl, isExternalHref } from "@/lib/url";
import { Seo } from "@/lib/seo";
import {
  createArticleJsonLd,
  createBreadcrumbJsonLd,
} from "@/lib/seo-jsonld";
import type { Article } from "@/types/portfolio";
import NotFoundPage from "@/pages/NotFoundPage";

interface ArticleHeading {
  id: string;
  text: string;
  depth: 2 | 3;
}

function stripInlineMarkdown(value: string): string {
  return value
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .trim();
}

function extractHeadings(markdown: string): ArticleHeading[] {
  const slugger = new GithubSlugger();
  const headings: ArticleHeading[] = [];
  let inFence = false;

  for (const line of markdown.split("\n")) {
    const trimmed = line.trim();
    if (trimmed.startsWith("```") || trimmed.startsWith("~~~")) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const match = /^(##|###)\s+(.+?)\s*#*\s*$/.exec(trimmed);
    if (!match) continue;

    const depth = match[1] === "##" ? 2 : 3;
    const text = stripInlineMarkdown(match[2]);
    if (!text) continue;

    headings.push({ id: slugger.slug(text), text, depth });
  }

  return headings;
}

function getReadingTime(article: Article): string {
  if (article.readingTimeMinutes && article.readingTimeMinutes > 0) {
    return formatReadingTime(article.readingTimeMinutes);
  }
  const words = article.body.trim().split(/\s+/).filter(Boolean).length;
  return formatReadingTime(Math.max(1, Math.round(words / 220)));
}

function getSafeMarkdownHref(href?: string): string | undefined {
  if (!href) return undefined;
  if (href.startsWith("#") || href.startsWith("/")) return href;
  return getSafeExternalUrl(href);
}

export default function ArticlePage(): React.ReactElement {
  const { slug } = useParams();
  const article = getArticleBySlug(slug);

  if (!article) return <NotFoundPage />;

  const cover = getSafeAssetUrl(article.coverImage);
  const date = formatFullDate(article.publicationDate);
  const readingTime = getReadingTime(article);
  const headings = extractHeadings(article.body);
  const related = getRelatedArticles(article);

  return (
    <>
      <Seo
        title={article.title}
        description={article.summary}
        path={`/blog/${article.slug}`}
        image={article.coverImage}
        type="article"
        article={{
          publishedTime: article.publicationDate,
          tags: article.tags,
        }}
        jsonLd={[
          createArticleJsonLd(article),
          createBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: article.title, path: `/blog/${article.slug}` },
          ]),
        ]}
      />

      <PageHeader
        eyebrow="Article"
        title={article.title}
        description={article.summary}
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "Blog", to: "/blog" },
          { label: article.title },
        ]}
      >
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[0.65rem] uppercase tracking-[0.13em] text-ink-faint">
          {date ? <time dateTime={article.publicationDate}>{date}</time> : null}
          {date && readingTime ? <span aria-hidden="true">·</span> : null}
          {readingTime ? <span>{readingTime}</span> : null}
        </div>
        {article.tags.length > 0 ? (
          <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Article tags">
            {article.tags.map((tag) => (
              <li key={tag}>
                <Badge variant="outline">{tag}</Badge>
              </li>
            ))}
          </ul>
        ) : null}
      </PageHeader>

      <Container>
        <div className="grid gap-12 pb-20 lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-14">
          <article className="min-w-0">
            {cover ? (
              <figure className="mb-10 overflow-hidden rounded-3xl border border-line bg-surface-subtle">
                <img
                  src={cover}
                  alt={article.coverAlt?.trim() || `${article.title} cover image`}
                  width={1280}
                  height={720}
                  className="h-auto w-full"
                />
              </figure>
            ) : null}

            <div className="prose-article max-w-none text-sm sm:text-base">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeSlug, rehypeHighlight]}
                components={{
                  a: ({ href, children }) => {
                    const safeHref = getSafeMarkdownHref(href);
                    if (!safeHref) return <span>{children}</span>;
                    const external =
                      isExternalHref(safeHref) || safeHref.startsWith("http");
                    return (
                      <a
                        href={safeHref}
                        {...(external
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                      >
                        {children}
                      </a>
                    );
                  },
                  img: ({ src, alt }) => {
                    const safeSrc = getSafeAssetUrl(
                      typeof src === "string" ? src : undefined,
                    );
                    if (!safeSrc) return null;
                    return (
                      <img
                        src={safeSrc}
                        alt={alt?.trim() || ""}
                        loading="lazy"
                        decoding="async"
                        className="h-auto w-full rounded-2xl border border-line"
                      />
                    );
                  },
                }}
              >
                {article.body}
              </ReactMarkdown>
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
              <Link
                to="/blog"
                className="inline-flex items-center gap-1.5 rounded-sm text-xs font-medium text-ink-muted transition-colors hover:text-ink"
              >
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                All articles
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-1.5 rounded-sm text-xs font-medium text-accent-cyan transition-colors hover:text-cyan-200"
              >
                Discuss this topic
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>

            {related.length > 0 ? (
              <section className="mt-14" aria-labelledby="related-articles-heading">
                <h2 id="related-articles-heading" className="text-display-sm">
                  Related articles
                </h2>
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  {related.map((item) => (
                    <ArticleCard key={item.slug} article={item} />
                  ))}
                </div>
              </section>
            ) : null}
          </article>

          <aside className="no-print lg:sticky lg:top-24 lg:self-start">
            {headings.length > 0 ? (
              <nav aria-label="On this page">
                <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-ink-faint">
                  On this page
                </p>
                <ul className="mt-3 space-y-1.5 border-l border-line pl-3">
                  {headings.map((heading) => (
                    <li key={heading.id}>
                      <a
                        href={`#${heading.id}`}
                        className={
                          heading.depth === 3
                            ? "block rounded-sm pl-3 py-0.5 text-[0.7rem] leading-relaxed text-ink-faint transition-colors hover:text-ink"
                            : "block rounded-sm py-0.5 text-xs leading-relaxed text-ink-faint transition-colors hover:text-ink"
                        }
                      >
                        {heading.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ) : null}
          </aside>
        </div>
      </Container>
    </>
  );
}
