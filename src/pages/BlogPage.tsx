import { PenLine } from "lucide-react";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { ArticleCard } from "@/components/portfolio/ArticleCard";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { getPublishedArticles } from "@/lib/portfolio";
import { cn } from "@/lib/cn";
import { Seo } from "@/lib/seo";
import { createBreadcrumbJsonLd } from "@/lib/seo-jsonld";

const PLANNED_TOPICS = [
  ".NET and ASP.NET Core",
  "API design",
  "SQL performance",
  "Production troubleshooting",
  "Cloud architecture",
  "AI-enabled applications",
];

export default function BlogPage(): React.ReactElement {
  const articles = getPublishedArticles();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTag = searchParams.get("tag") ?? "all";

  const tags = useMemo(() => {
    const seen = new Set<string>();
    for (const article of articles) {
      for (const tag of article.tags) {
        const trimmed = tag.trim();
        if (trimmed) seen.add(trimmed);
      }
    }
    return [...seen].sort((a, b) => a.localeCompare(b));
  }, [articles]);

  const filtered =
    activeTag === "all"
      ? articles
      : articles.filter((article) => article.tags.includes(activeTag));

  return (
    <>
      <Seo
        title="Technical Writing"
        description="Practical notes on .NET, APIs, data, architecture, and production engineering."
        path="/blog"
        jsonLd={createBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
        ])}
      />

      <PageHeader
        eyebrow="Writing"
        title="Technical notes from building and maintaining software"
        description="Practical write-ups about .NET, APIs, data, architecture, and the details that make production systems easier to operate."
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Blog" }]}
      >
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-ink-faint">
          {articles.length} published {articles.length === 1 ? "article" : "articles"}
        </p>
      </PageHeader>

      <Container>
        <div className="pb-20">
          {articles.length === 0 ? (
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
              <EmptyState
                icon={PenLine}
                title="No articles published yet"
                description="This blog is ready for Markdown articles with tags, reading time, a table of contents, code highlighting, and article metadata. Nothing is fabricated to fill the space."
                action={
                  <p className="max-w-sm text-xs leading-relaxed text-ink-faint">
                    When the first article is ready, it will appear here with a stable,
                    shareable URL.
                  </p>
                }
              />
              <aside className="surface-card rounded-2xl p-6">
                <h2 className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-ink-faint">
                  Planned themes
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                  Topics I intend to write about as practical notes are ready to
                  publish.
                </p>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {PLANNED_TOPICS.map((topic) => (
                    <li key={topic}>
                      <Badge variant="outline">{topic}</Badge>
                    </li>
                  ))}
                </ul>
              </aside>
            </div>
          ) : (
            <>
              {tags.length > 0 ? (
                <div className="mb-8 flex flex-wrap items-center gap-2">
                  <span className="mr-1 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-ink-faint">
                    Filter
                  </span>
                  <button
                    type="button"
                    onClick={() => setSearchParams({})}
                    aria-pressed={activeTag === "all"}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs transition-colors",
                      activeTag === "all"
                        ? "border-accent-cyan/50 bg-accent-cyan/10 text-cyan-100"
                        : "border-line bg-transparent text-ink-muted hover:border-line-strong hover:text-ink",
                    )}
                  >
                    All
                  </button>
                  {tags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setSearchParams({ tag })}
                      aria-pressed={activeTag === tag}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-xs transition-colors",
                        activeTag === tag
                          ? "border-accent-cyan/50 bg-accent-cyan/10 text-cyan-100"
                          : "border-line bg-transparent text-ink-muted hover:border-line-strong hover:text-ink",
                      )}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              ) : null}

              {filtered.length > 0 ? (
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {filtered.map((article) => (
                    <ArticleCard key={article.slug} article={article} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={PenLine}
                  title="No articles with this tag"
                  description="Try another tag or return to all published articles."
                />
              )}
            </>
          )}
        </div>
      </Container>
    </>
  );
}
