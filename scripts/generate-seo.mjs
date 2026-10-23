import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dataPath = join(root, "src", "data", "portfolioData.json");
const publicDir = join(root, "public");

function getSiteOrigin(domain) {
  const raw = domain?.trim();
  if (!raw) return undefined;

  const candidate = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;

  try {
    const url = new URL(candidate);
    if (url.protocol !== "http:" && url.protocol !== "https:") return undefined;
    return url.origin;
  } catch {
    return undefined;
  }
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function absolute(origin, path) {
  return new URL(path, origin).toString();
}

async function main() {
  const raw = await readFile(dataPath, "utf8");
  const data = JSON.parse(raw);
  const origin = getSiteOrigin(data.site?.domain);
  const sitemapPath = join(publicDir, "sitemap.xml");

  await mkdir(publicDir, { recursive: true });

  const robots = ["User-agent: *", "Allow: /", ""];

  if (origin) {
    robots.push(`Sitemap: ${absolute(origin, "/sitemap.xml")}`, "");
  } else {
    robots.push("# Set site.domain in src/data/portfolioData.json to publish a sitemap.", "");
  }

  await writeFile(join(publicDir, "robots.txt"), robots.join("\n"), "utf8");

  if (!origin) {
    await rm(sitemapPath, { force: true });
    console.log("robots.txt written. Sitemap skipped because site.domain is not configured.");
    return;
  }

  const lastmod = data.site?.contentUpdatedAt?.trim() || undefined;
  const staticRoutes = [
    "/",
    "/about",
    "/skills",
    "/projects",
    "/experience",
    "/resume",
    "/blog",
    "/contact",
  ];

  const entries = staticRoutes.map((path) => ({
    loc: absolute(origin, path),
    lastmod,
    priority: path === "/" ? "1.0" : "0.8",
    changefreq: path === "/" ? "monthly" : "yearly",
  }));

  const projects = (data.projects ?? []).filter(
    (project) =>
      project.status === "published" &&
      project.slug?.trim() &&
      project.title?.trim(),
  );

  for (const project of projects) {
    entries.push({
      loc: absolute(origin, `/projects/${project.slug}`),
      lastmod,
      priority: project.featured ? "0.9" : "0.7",
      changefreq: "yearly",
    });
  }

  const articles = (data.articles ?? []).filter(
    (article) =>
      article.published &&
      article.slug?.trim() &&
      article.title?.trim() &&
      article.publicationDate?.trim(),
  );

  for (const article of articles) {
    entries.push({
      loc: absolute(origin, `/blog/${article.slug}`),
      lastmod: article.publicationDate,
      priority: "0.6",
      changefreq: "yearly",
    });
  }

  const urls = entries
    .map(
      (entry) => `  <url>
    <loc>${escapeXml(entry.loc)}</loc>
${entry.lastmod ? `    <lastmod>${escapeXml(entry.lastmod)}</lastmod>\n` : ""}    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`,
    )
    .join("\n");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

  await writeFile(sitemapPath, sitemap, "utf8");
  console.log(`robots.txt and sitemap.xml written for ${origin} (${entries.length} URLs).`);
}

main().catch((error) => {
  console.error("Failed to generate SEO files:", error);
  process.exitCode = 1;
});
