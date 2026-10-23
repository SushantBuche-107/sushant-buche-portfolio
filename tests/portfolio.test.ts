import { describe, expect, it } from "vitest";
import {
  getArticleBySlug,
  getContactChannels,
  getContactEmail,
  getEffectiveContactMode,
  getFeaturedProjects,
  getProjectBySlug,
  getProjectPath,
  getPublishedArticles,
  getPublishedProjects,
  getResumeUrl,
  getVisibleExperience,
  getVisibleSkills,
} from "@/lib/portfolio";

describe("portfolio content selectors", () => {
  it("returns only published, complete projects", () => {
    const projects = getPublishedProjects();

    expect(projects.length).toBeGreaterThan(0);
    for (const project of projects) {
      expect(project.status).toBe("published");
      expect(project.slug.trim()).not.toBe("");
      expect(project.title.trim()).not.toBe("");
      expect(project.summary.trim()).not.toBe("");
    }
  });

  it("sorts featured projects first and resolves slugs", () => {
    const featured = getFeaturedProjects();
    const portfolio = getProjectBySlug("portfolio-platform");

    expect(featured.length).toBeGreaterThan(0);
    expect(featured.every((project) => project.featured)).toBe(true);
    expect(portfolio?.title).toBe("Developer Portfolio Platform");
    expect(getProjectBySlug("missing-project")).toBeUndefined();
    expect(getProjectPath("sample")).toBe("/projects/sample");
  });

  it("returns visible skill categories with named items", () => {
    const categories = getVisibleSkills();

    expect(categories.length).toBeGreaterThan(0);
    for (const category of categories) {
      expect(category.name.trim()).not.toBe("");
      expect(category.items.some((item) => item.name.trim())).toBe(true);
    }
  });

  it("publishes experience and articles without inventing a resume file", () => {
    expect(getResumeUrl()).toBeUndefined();
    expect(getVisibleExperience()).toHaveLength(1);
    expect(getPublishedArticles()).toHaveLength(5);
    expect(
      getArticleBySlug("yaml-defined-ai-workflows-agentflow")?.title,
    ).toMatch(/yaml-defined ai workflows/i);
    expect(getArticleBySlug("anything")).toBeUndefined();
  });

  it("exposes the configured email contact channel", () => {
    const channels = getContactChannels();

    expect(getEffectiveContactMode()).toBe("mailto");
    expect(getContactEmail()).toBe("107sushant@gmail.com");
    expect(channels.hasAny).toBe(true);
    expect(channels.socials.length).toBeGreaterThan(0);
  });
});
