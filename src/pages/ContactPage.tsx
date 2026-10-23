import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  FileText,
  Mail,
  MessageSquareOff,
} from "lucide-react";
import { ContactForm } from "@/components/forms/ContactForm";
import { SocialLinks } from "@/components/portfolio/SocialLinks";
import { ActionLink } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import {
  getContactChannels,
  getContactConfig,
  getContactEndpoint,
  getEffectiveContactMode,
  getPersonalProfile,
} from "@/lib/portfolio";
import { Seo } from "@/lib/seo";
import { createBreadcrumbJsonLd } from "@/lib/seo-jsonld";

export default function ContactPage(): React.ReactElement {
  const contact = getContactConfig();
  const channels = getContactChannels();
  const mode = getEffectiveContactMode();
  const endpoint = getContactEndpoint();
  const personal = getPersonalProfile();
  const isFormAvailable = mode === "endpoint" || mode === "mailto";

  return (
    <>
      <Seo
        title="Contact"
        description="Contact Sushant Buche for roles, technical collaborations, and engineering conversations."
        path="/contact"
        jsonLd={createBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />

      <PageHeader
        eyebrow="Contact"
        title="Start a conversation"
        description="For roles, collaborations, or technical questions, use the configured contact options below. Direct contact details are only shown when they have been published."
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Contact" }]}
      />

      <Container>
        <div className="grid gap-10 pb-20 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-14">
          <div className="min-w-0">
            {isFormAvailable ? (
              <ContactForm
                mode={mode}
                endpoint={endpoint}
                email={channels.email}
                successMessage={contact.successMessage}
                formIntro={contact.formIntro}
                privacyNote={contact.privacyNote}
              />
            ) : (
              <div className="surface-card rounded-2xl p-6 sm:p-8">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-line-strong bg-white/[0.04] text-accent-cyan">
                  <MessageSquareOff className="h-5 w-5" aria-hidden="true" />
                </span>
                <h2 className="mt-4 text-xl font-semibold text-ink">
                  Direct contact is not available yet
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-muted">
                  {contact.notice}
                </p>
                {contact.responseNote ? (
                  <p className="mt-3 max-w-xl text-xs leading-relaxed text-ink-faint">
                    {contact.responseNote}
                  </p>
                ) : null}

                <div className="mt-6 flex flex-wrap gap-2">
                  <ActionLink to="/resume" variant="secondary" size="sm">
                    <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                    View resume
                  </ActionLink>
                  <ActionLink to="/projects" variant="outline" size="sm">
                    Explore projects
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </ActionLink>
                </div>
              </div>
            )}
          </div>

          <aside className="space-y-4">
            <Card className="p-5">
              <h2 className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-ink-faint">
                Direct channels
              </h2>

              {channels.hasAny ? (
                <div className="mt-4 space-y-3">
                  {channels.email ? (
                    <div>
                      <p className="text-[0.68rem] text-ink-faint">Email</p>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <a
                          href={`mailto:${channels.email}`}
                          className="inline-flex items-center gap-1.5 rounded-sm text-sm text-ink transition-colors hover:text-accent-cyan"
                        >
                          <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                          {channels.email}
                        </a>
                        <CopyButton
                          text={channels.email}
                          label="Copy email"
                          copiedLabel="Copied"
                        />
                      </div>
                    </div>
                  ) : null}

                  {channels.phone ? (
                    <div>
                      <p className="text-[0.68rem] text-ink-faint">Phone</p>
                      <p className="mt-1 text-sm text-ink">{channels.phone}</p>
                    </div>
                  ) : null}

                  {channels.bookingUrl ? (
                    <ActionLink
                      href={channels.bookingUrl}
                      variant="outline"
                      size="sm"
                      className="mt-1"
                    >
                      <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />
                      Book a call
                    </ActionLink>
                  ) : null}

                  {channels.socials.length > 0 ? (
                    <div className="border-t border-line pt-3">
                      <p className="text-[0.68rem] text-ink-faint">Profiles</p>
                      <SocialLinks links={channels.socials} className="mt-2" />
                    </div>
                  ) : null}
                </div>
              ) : (
                <p className="mt-3 text-xs leading-relaxed text-ink-muted">
                  No public contact channel has been configured yet. This is
                  intentional: the site does not present placeholder links or a form
                  that cannot deliver a message.
                </p>
              )}
            </Card>

            <Card className="p-5">
              <h2 className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-ink-faint">
                Location
              </h2>
              <p className="mt-3 text-sm text-ink">{personal.location}</p>
              <p className="text-xs text-ink-faint">{personal.timezone}</p>
            </Card>

            <Card className="p-5">
              <h2 className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-ink-faint">
                Good fit
              </h2>
              <ul className="mt-3 space-y-2 text-xs leading-relaxed text-ink-muted">
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" aria-hidden="true" />
                  Full-stack .NET and backend engineering roles
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" aria-hidden="true" />
                  API, data, and integration-heavy product work
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" aria-hidden="true" />
                  Technical conversations about architecture and delivery
                </li>
              </ul>
            </Card>
          </aside>
        </div>
      </Container>
    </>
  );
}
