import type { Metadata } from "next";
import Image from "next/image";
import { site } from "@/app/(config)/site";
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
      <section className="bg-primary pb-14 pt-28 text-on-primary lg:pb-20 lg:pt-32">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-6 lg:grid-cols-[2fr,1fr] lg:items-center">
            <Reveal>
              <p className="text-sm font-bold uppercase tracking-wide text-on-primary/80">
                Contact
              </p>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Let&apos;s get it fixed
              </h1>
              <p className="mt-4 max-w-lg text-base text-on-primary/90">
                Call for the fastest response, or share your number and we&apos;ll
                call you back within 15 minutes. {site.hours}.
              </p>
              <div className="mt-6">
                <CallButton variant="light" showNumber />
              </div>
            </Reveal>
            <div className="relative hidden h-48 overflow-hidden rounded-3xl lg:block">
              <Image
                src="/customer-service.png"
                alt="Happy Bengaluru homes with working appliances"
                fill
                sizes="25vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 lg:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <Reveal>
              <div className="flex flex-col items-start gap-3 card-zoom rounded-3xl border border-outline-variant bg-surface p-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-on-primary">
                  <Icon name="phone" className="h-6 w-6" filled />
                </span>
                <div>
                  <p className="text-sm text-on-surface-variant">Call us</p>
                  <p className="text-base font-extrabold text-on-surface">
                    {site.phoneDisplay}
                  </p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <div className="flex flex-col items-start gap-3 card-zoom rounded-3xl border border-outline-variant bg-surface p-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-on-primary">
                  <Icon name="clock" className="h-6 w-6" />
                </span>
                <div>
                  <p className="text-sm text-on-surface-variant">Hours</p>
                  <p className="text-base font-extrabold text-on-surface">
                    {site.hours}
                  </p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="flex flex-col items-start gap-3 card-zoom rounded-3xl border border-outline-variant bg-surface p-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-on-primary">
                  <Icon name="shield" className="h-6 w-6" />
                </span>
                <div>
                  <p className="text-sm text-on-surface-variant">Warranty</p>
                  <p className="text-base font-extrabold text-on-surface">
                    {site.warranty}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-surface-variant py-14 lg:py-20">
        <div className="mx-auto max-w-2xl px-4">
          <Reveal>
            <h2 className="text-center text-2xl font-extrabold tracking-tight text-on-surface sm:text-3xl">
              Request a callback
            </h2>
            <p className="mt-2 text-center text-sm text-on-surface-variant">
              Share your number and our technician will call you back within 15
              minutes.
            </p>
          </Reveal>
          <div className="mt-8">
            <LeadForm appliance="general" source="contact-page" />
          </div>
        </div>
      </section>

      <section className="py-14 lg:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <Coverage />
        </div>
      </section>
    </div>
  );
}
