import { ArrowRight } from "lucide-react";
import { SkillExplorer } from "@/components/portfolio/SkillExplorer";
import { ActionLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { getVisibleSkills } from "@/lib/portfolio";
import { Seo } from "@/lib/seo";
import { createBreadcrumbJsonLd } from "@/lib/seo-jsonld";

export default function SkillsPage(): React.ReactElement {
  const categories = getVisibleSkills();
  const totalSkills = categories.reduce(
    (total, category) => total + category.items.length,
    0,
  );

  return (
    <>
      <Seo
        title="Skills"
        description="Backend, frontend, database, cloud, architecture, security, and domain engineering skills across the .NET ecosystem."
        path="/skills"
        jsonLd={createBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Skills", path: "/skills" },
        ])}
      />

      <PageHeader
        eyebrow="Technical toolkit"
        title="Skills organized by the work they support"
        description="Backend engineering, frontend delivery, data, cloud, architecture, security, and the domain context that shapes enterprise software."
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Skills" }]}
      >
        <div className="flex flex-wrap items-center gap-3">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-ink-faint">
            {categories.length} categories · {totalSkills} capabilities
          </p>
          <ActionLink to="/projects" variant="outline" size="sm">
            See the work
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </ActionLink>
        </div>
      </PageHeader>

      <Container>
        <div className="pb-20">
          <SkillExplorer />
          <p className="mt-10 max-w-2xl border-t border-line pt-5 text-xs leading-relaxed text-ink-faint">
            Proficiency labels appear only where explicitly configured. This portfolio
            does not use percentage scores or comparative rankings, because they tend
            to communicate less than a concrete project, decision, or constraint.
          </p>
        </div>
      </Container>
    </>
  );
}
