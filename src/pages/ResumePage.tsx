import { ResumeView } from "@/components/portfolio/ResumeView";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { getPersonalProfile } from "@/lib/portfolio";
import { Seo } from "@/lib/seo";
import {
  createBreadcrumbJsonLd,
  createPersonJsonLd,
} from "@/lib/seo-jsonld";

export default function ResumePage(): React.ReactElement {
  const personal = getPersonalProfile();

  return (
    <>
      <Seo
        title="Resume"
        description={`Print-ready professional resume for ${personal.name}, ${personal.title}.`}
        path="/resume"
        type="profile"
        jsonLd={[
          createPersonJsonLd(),
          createBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Resume", path: "/resume" },
          ]),
        ]}
      />

      <PageHeader
        eyebrow="Resume"
        title={`${personal.name} — ${personal.title}`}
        description="A current, print-ready overview of my experience, technical focus, and selected project work. Use Print / Save as PDF for a copy generated from this page."
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Resume" }]}
        className="no-print"
      />

      <Container>
        <div className="pb-20">
          <ResumeView />
        </div>
      </Container>
    </>
  );
}
