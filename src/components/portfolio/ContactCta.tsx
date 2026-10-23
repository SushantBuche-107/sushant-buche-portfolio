import { ArrowRight, CalendarClock, Mail } from "lucide-react";
import { ActionLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SocialLinks } from "@/components/portfolio/SocialLinks";
import {
  getBookingUrl,
  getContactChannels,
  getContactEmail,
} from "@/lib/portfolio";

export function ContactCta(): React.ReactElement | null {
  const channels = getContactChannels();
  const email = getContactEmail();
  const bookingUrl = getBookingUrl();

  if (!channels.hasAny) return null;

  return (
    <section className="pb-8 pt-4 sm:pb-12" aria-labelledby="contact-cta-heading">
      <Container>
        <div className="surface-card relative overflow-hidden rounded-3xl p-6 sm:p-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-accent-cyan/[0.08] blur-3xl"
          />
          <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="eyebrow mb-3">Contact</p>
              <h2
                id="contact-cta-heading"
                className="max-w-2xl text-display-sm text-balance"
              >
                Let&apos;s talk about the team, product, or problem.
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-muted">
                For roles, collaborations, and technical conversations, use the
                contact page or the configured channels below.
              </p>
              {channels.socials.length > 0 ? (
                <SocialLinks
                  links={channels.socials}
                  className="mt-5"
                  showLabels={false}
                />
              ) : null}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:justify-end">
              <ActionLink to="/contact" size="lg">
                Contact Me
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </ActionLink>
              {email ? (
                <ActionLink
                  href={`mailto:${email}`}
                  variant="secondary"
                  size="lg"
                >
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  Email
                </ActionLink>
              ) : null}
              {bookingUrl ? (
                <ActionLink href={bookingUrl} variant="outline" size="lg">
                  <CalendarClock className="h-4 w-4" aria-hidden="true" />
                  Book a call
                </ActionLink>
              ) : null}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
