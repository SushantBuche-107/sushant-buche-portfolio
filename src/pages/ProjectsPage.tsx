import { ProjectsExplorer } from "@/components/portfolio/ProjectsExplorer";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { getPublishedProjects } from "@/lib/portfolio";
import { Seo } from "@/lib/seo";
import {
  createBreadcrumbJsonLd,
  getProjectListItemJsonLd,
} from "@/lib/seo-jsonld";

export default function ProjectsPage(): React.ReactElement {
  const projects = getPublishedProjects();

  return (
    <>
      <Seo
        title="Projects"
        description="Engineering case studies covering architecture, API design, data flow, security, performance, and trade-offs."
        path="/projects"
        jsonLd={[
          getProjectListItemJsonLd(),
          createBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Projects", path: "/projects" },
          ]),
        ]}
      />

      <PageHeader
        eyebrow="Selected work"
        title="Case studies with the decisions left in"
        description="A project is more than a stack list. These write-ups cover the problem, constraints, architecture, trade-offs, and what changed after building it."
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Projects" }]}
      >
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-ink-faint">
          {projects.length} published {projects.length === 1 ? "project" : "projects"}
        </p>
      </PageHeader>

      <Container>
        <div className="pb-20">
          <ProjectsExplorer />
          <p className="mt-10 max-w-2xl border-t border-line pt-5 text-xs leading-relaxed text-ink-faint">
            Employer and client work is described only at a level that respects
            confidentiality. No proprietary code, customer data, or internal
            architecture is published.
          </p>
        </div>
      </Container>
    </>
  );
}
