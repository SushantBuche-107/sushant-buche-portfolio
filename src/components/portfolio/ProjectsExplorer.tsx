import { Search, X, FolderSearch } from "lucide-react";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { ProjectCard } from "@/components/portfolio/ProjectCard";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/field";
import { cn } from "@/lib/cn";
import {
  getProjectCategories,
  getPublishedProjects,
} from "@/lib/portfolio";

const ALL_CATEGORIES = "All";

export function ProjectsExplorer(): React.ReactElement {
  const projects = getPublishedProjects();
  const categories = getProjectCategories();
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get("q") ?? "";
  const activeCategory = searchParams.get("category") ?? ALL_CATEGORIES;

  const updateParam = (key: string, value: string): void => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === ALL_CATEGORIES) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next, { replace: true });
  };

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const category of categories) {
      map.set(
        category,
        projects.filter((project) => project.categories.includes(category)).length,
      );
    }
    return map;
  }, [categories, projects]);

  const filteredProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesCategory =
        activeCategory === ALL_CATEGORIES ||
        project.categories.includes(activeCategory);

      if (!matchesCategory) return false;
      if (!normalizedQuery) return true;

      const haystack = [
        project.title,
        project.summary,
        project.description,
        ...project.technologies,
        ...project.categories,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [activeCategory, projects, query]);

  const hasFilters = query.trim().length > 0 || activeCategory !== ALL_CATEGORIES;

  const clearFilters = (): void => {
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  const filterOptions = [ALL_CATEGORIES, ...categories];

  return (
    <div>
      <div className="flex flex-col gap-5">
        <div className="relative max-w-xl">
          <label htmlFor="project-search" className="sr-only">
            Search projects
          </label>
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint"
            aria-hidden="true"
          />
          <Input
            id="project-search"
            type="search"
            value={query}
            onChange={(event) => updateParam("q", event.target.value)}
            placeholder="Search by project, technology, or category"
            className="h-12 pl-10 pr-10"
            autoComplete="off"
          />
          {query ? (
            <button
              type="button"
              onClick={() => updateParam("q", "")}
              className="absolute right-2.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-ink-faint transition-colors hover:bg-white/5 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
              aria-label="Clear project search"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          ) : null}
        </div>

        <div
          className="filter-scroll -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:-mx-0 sm:flex-wrap sm:px-0"
          role="group"
          aria-label="Filter projects by category"
        >
          {filterOptions.map((category) => {
            const isActive = activeCategory === category;
            const count =
              category === ALL_CATEGORIES
                ? projects.length
                : counts.get(category) ?? 0;

            return (
              <button
                key={category}
                type="button"
                aria-pressed={isActive}
                onClick={() => updateParam("category", category)}
                className={cn(
                  "inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  isActive
                    ? "border-accent/50 bg-accent/15 text-ink"
                    : "border-line-strong bg-white/[0.02] text-ink-muted hover:border-line-strong hover:text-ink",
                )}
              >
                {category}
                <span className="font-mono text-[0.62rem] text-ink-faint">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between gap-3">
        <p
          className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-ink-faint"
          aria-live="polite"
        >
          {filteredProjects.length} of {projects.length} projects
        </p>
        {hasFilters ? (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear filters
          </Button>
        ) : null}
      </div>

      {filteredProjects.length > 0 ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FolderSearch}
          title="No projects match those filters"
          description="Try a different technology or category, or clear the filters to see everything that is published."
          className="mt-6"
          action={
            <Button variant="secondary" onClick={clearFilters}>
              Clear filters
            </Button>
          }
        />
      )}
    </div>
  );
}
