import { Search, Sparkles, X } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/field";
import { cn } from "@/lib/cn";
import {
  getProjectBySlug,
  getProjectPath,
  getVisibleSkills,
} from "@/lib/portfolio";
import type { SkillCategory, SkillFocus, SkillItem } from "@/types/portfolio";

const ALL_TAB = "all";

const focusLabels: Record<SkillFocus, string> = {
  core: "Core",
  working: "Working knowledge",
  exploring: "Exploring",
};

const focusVariants: Record<SkillFocus, "accent" | "cyan" | "warning"> = {
  core: "accent",
  working: "cyan",
  exploring: "warning",
};

function SkillCard({ item }: { item: SkillItem }): React.ReactElement {
  const relatedProjects = (item.relatedProjects ?? [])
    .map((slug) => getProjectBySlug(slug))
    .filter((project): project is NonNullable<typeof project> => Boolean(project));

  return (
    <li className="rounded-xl border border-line bg-white/[0.02] p-4 transition-colors hover:border-line-strong">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="font-display text-sm font-semibold text-ink">{item.name}</h4>
        {item.focus ? (
          <Badge variant={focusVariants[item.focus]}>{focusLabels[item.focus]}</Badge>
        ) : null}
      </div>
      {item.description ? (
        <p className="mt-2 text-xs leading-relaxed text-ink-muted">
          {item.description}
        </p>
      ) : null}
      {relatedProjects.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {relatedProjects.map((project) => (
            <Link
              key={project.slug}
              to={getProjectPath(project.slug)}
              className="rounded-sm font-mono text-[0.62rem] uppercase tracking-wide text-accent-cyan transition-colors hover:text-cyan-200"
            >
              {project.title}
            </Link>
          ))}
        </div>
      ) : null}
    </li>
  );
}

function CategoryBlock({ category }: { category: SkillCategory }): React.ReactElement {
  return (
    <section aria-labelledby={`skill-category-${category.id}`}>
      <div className="flex flex-col gap-1.5">
        <h3
          id={`skill-category-${category.id}`}
          className="text-xl font-semibold tracking-tight text-ink"
        >
          {category.name}
        </h3>
        <p className="max-w-2xl text-sm leading-relaxed text-ink-muted">
          {category.description}
        </p>
      </div>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {category.items.map((item) => (
          <SkillCard key={`${category.id}-${item.name}`} item={item} />
        ))}
      </ul>
    </section>
  );
}

export function SkillExplorer(): React.ReactElement {
  const categories = getVisibleSkills();
  const [activeTab, setActiveTab] = useState(ALL_TAB);
  const [query, setQuery] = useState("");
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const tabs = useMemo(
    () => [
      { id: ALL_TAB, name: "All skills" },
      ...categories.map((category) => ({ id: category.id, name: category.name })),
    ],
    [categories],
  );

  const normalizedQuery = query.trim().toLowerCase();

  const filteredCategories = useMemo(() => {
    const base =
      activeTab === ALL_TAB
        ? categories
        : categories.filter((category) => category.id === activeTab);

    if (!normalizedQuery) return base;

    return base
      .map((category) => ({
        ...category,
        items: category.items.filter((item) =>
          [item.name, item.description ?? "", ...(item.relatedProjects ?? [])]
            .join(" ")
            .toLowerCase()
            .includes(normalizedQuery),
        ),
      }))
      .filter((category) => category.items.length > 0);
  }, [activeTab, categories, normalizedQuery]);

  const resultCount = filteredCategories.reduce(
    (total, category) => total + category.items.length,
    0,
  );

  const handleTabKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
  ): void => {
    const navigationKeys = ["ArrowRight", "ArrowLeft", "Home", "End"];
    if (!navigationKeys.includes(event.key)) return;

    event.preventDefault();
    let nextIndex = index;

    if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
    if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = tabs.length - 1;

    const nextTab = tabs[nextIndex];
    if (!nextTab) return;
    setActiveTab(nextTab.id);
    requestAnimationFrame(() => tabRefs.current[nextTab.id]?.focus());
  };

  const activePanelId = `skill-panel-${activeTab}`;

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div
          className="filter-scroll -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 lg:mx-0 lg:flex-wrap lg:px-0"
          role="tablist"
          aria-label="Skill categories"
        >
          {tabs.map((tab, index) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                ref={(element) => {
                  tabRefs.current[tab.id] = element;
                }}
                id={`skill-tab-${tab.id}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`skill-panel-${tab.id}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActiveTab(tab.id)}
                onKeyDown={(event) => handleTabKeyDown(event, index)}
                className={cn(
                  "shrink-0 rounded-full border px-3.5 py-2 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  isActive
                    ? "border-accent/50 bg-accent/15 text-ink"
                    : "border-line-strong bg-white/[0.02] text-ink-muted hover:text-ink",
                )}
              >
                {tab.name}
              </button>
            );
          })}
        </div>

        <div className="relative w-full max-w-sm">
          <label htmlFor="skill-search" className="sr-only">
            Search skills
          </label>
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint"
            aria-hidden="true"
          />
          <Input
            id="skill-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search technologies"
            className="h-11 pl-10 pr-10"
            autoComplete="off"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-2.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-ink-faint transition-colors hover:bg-white/5 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
              aria-label="Clear skill search"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          ) : null}
        </div>
      </div>

      <div className="mt-7">
        <div
          id={activePanelId}
          role="tabpanel"
          aria-labelledby={`skill-tab-${activeTab}`}
          tabIndex={0}
          className="rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
        >
          <p
            className="mb-6 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-ink-faint"
            aria-live="polite"
          >
            {resultCount} skills shown
          </p>

          {filteredCategories.length > 0 ? (
            <div className="space-y-12">
              {filteredCategories.map((category) => (
                <CategoryBlock key={category.id} category={category} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Sparkles}
              title="No skills match that search"
              description="Try a broader term, or clear the search to browse the full technical toolkit."
            />
          )}
        </div>
      </div>
    </div>
  );
}
