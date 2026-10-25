import type { Metadata } from "next";
import { site } from "@/app/(config)/site";
import { ServiceHero } from "@/app/(ui)/components/service-hero";
import { Coverage } from "@/app/(ui)/components/coverage";
import { Icon } from "@/app/(ui)/components/icons";
import { CallButton } from "@/app/(ui)/components/call-button";
import { LeadForm } from "@/app/(ui)/components/lead-form";
import { Reveal } from "@/app/(ui)/components/reveal";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact ${site.name} — call for same-day appliance repair across Bengaluru, or request a callback.`,
  alternates: { canonical: "/contact" },
};

export default function Page() {
  return (
    <div className="flex flex-col">
      <ServiceHero
        path="/contact"
        pageType="ContactPage"
        image="/customer-service.png"
        title={`Contact ${site.name}`}
        tagline={`Call for the fastest response, or share your number and we'll call you back within 15 minutes. ${site.hours}.`}
      >
        <div className="mt-6">
          <CallButton variant="light" />
        </div>
      </ServiceHero>

      <section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <Reveal>
              <div className="flex flex-col items-start gap-3 card-zoom rounded-2xl border border-outline-variant bg-surface p-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-on-primary">
                  <Icon name="phone" className="h-6 w-6" filled />
                </span>
                <div>
                  <p className="text-base text-on-surface-variant">Call us</p>
                  <a
                    href={`tel:${site.phone}`}
                    className="text-base font-extrabold text-on-surface transition-colors hover:text-primary"
                  >
                    {site.phoneDisplay}
                  </a>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <div className="flex flex-col items-start gap-3 card-zoom rounded-2xl border border-outline-variant bg-surface p-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-on-primary">
                  <Icon name="clock" className="h-6 w-6" />
                </span>
                <div>
                  <p className="text-base text-on-surface-variant">Hours</p>
                  <p className="text-base font-extrabold text-on-surface">
                    {site.hours}
                  </p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="flex flex-col items-start gap-3 card-zoom rounded-2xl border border-outline-variant bg-surface p-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-on-primary">
                  <Icon name="shield" className="h-6 w-6" />
                </span>
                <div>
                  <p className="text-base text-on-surface-variant">Warranty</p>
                  <p className="text-base font-extrabold text-on-surface">
                    {site.warranty}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-2xl px-4">
          <Reveal>
            <h2 className="text-center text-2xl font-extrabold tracking-tight text-on-surface sm:text-3xl">
              Request a callback
            </h2>
            <p className="mt-2 text-center text-base text-on-surface-variant">
              Share your number and our technician will call you back within 15
              minutes.
            </p>
          </Reveal>
          <div className="mt-8">
            <LeadForm appliance="general" source="contact-page" />
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <Coverage />
        </div>
      </section>
    </div>
  );
}
