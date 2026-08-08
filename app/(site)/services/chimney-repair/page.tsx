import type { Metadata } from "next";
import Link from "next/link";
import { site, getService } from "@/app/(config)/site";
import { serviceFaqs, serviceProblems, serviceTips } from "@/app/(config)/content";
import { ServiceHero } from "@/app/(ui)/components/service-hero";
import { LeadForm } from "@/app/(ui)/components/lead-form";
import { FaqSection } from "@/app/(ui)/components/faq-section";
import { BrandsGrid } from "@/app/(ui)/components/brands-grid";
import { ServiceAreas } from "@/app/(ui)/components/service-areas";
import { TipsSection } from "@/app/(ui)/components/tips-section";
import { WhyChooseUs } from "@/app/(ui)/components/why-choose-us";
import { HowItWorks } from "@/app/(ui)/components/how-it-works";
import { Reveal } from "@/app/(ui)/components/reveal";
import { Icon, type IconName } from "@/app/(ui)/components/icons";
import { CallButton } from "@/app/(ui)/components/call-button";
import { JsonLd } from "@/app/(ui)/components/json-ld";

export const metadata: Metadata = {
  title: "Kitchen Chimney Repair in Bengaluru — Faber, Elica, Bosch",
  description:
    "Kitchen chimney repair in Bengaluru — not sucking smoke, noisy motor, touch panel dead. Faber, Elica, Bosch, Hindware. Free diagnosis, genuine parts, quality assured.",
  alternates: { canonical: "/services/chimney-repair" },
  openGraph: {
    title: "Kitchen Chimney Repair in Bengaluru — All Brands",
    description:
      "Same-day kitchen chimney repair in Bengaluru — all brands. Free diagnosis, genuine parts, quality assured.",
    url: `${site.url}/services/chimney-repair`,
  },
};

export default function Page() {
  const s = getService("chimney-repair");
  const problems = serviceProblems["chimney-repair"];
  const faqs = serviceFaqs["chimney-repair"];
  const tips = serviceTips["chimney-repair"];

  return (
    <div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: s.name,
          serviceType: "Kitchen chimney repair",
          areaServed: site.city,
          provider: { "@type": "LocalBusiness", name: site.name, address: { "@type": "PostalAddress", streetAddress: site.address.streetAddress, addressLocality: site.address.addressLocality, addressRegion: site.address.addressRegion, postalCode: site.address.postalCode, addressCountry: site.address.addressCountry }, telephone: site.phone, url: site.url },
        }}
      />
      <ServiceHero image="/chimney-repair.png" title={s.name} tagline={s.tagline}>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <CallButton variant="light"  />
          <Link
            href="#book"
            className="inline-flex items-center justify-center gap-2 btn-zoom rounded-lg border-2 border-white/40 px-5 py-3 text-sm font-bold text-on-primary hover:bg-white/10"
          >
            Request a callback
          </Link>
        </div>
      </ServiceHero>

      <section className="py-14 lg:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal>
            <h2 className="text-2xl font-extrabold tracking-tight text-on-surface sm:text-3xl">
              Common chimney problems we fix in Bengaluru
            </h2>
            <p className="mt-1 text-sm text-on-surface-variant">
              From not sucking smoke to noisy motor — we repair every fault at
              your doorstep across {site.city}.
            </p>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {problems.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.03}>
                <div className="flex h-full flex-col gap-2 card-zoom rounded-3xl border border-outline-variant bg-surface p-5">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-container text-primary">
                      <Icon name={p.icon as IconName} className="h-4 w-4" />
                    </span>
                    <h3 className="text-base font-bold text-on-surface">
                      {p.title}
                    </h3>
                  </div>
                  <p className="text-sm text-on-surface-variant">
                    {p.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <WhyChooseUs />

      <section className="py-14 lg:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal>
            <h2 className="text-2xl font-extrabold tracking-tight text-on-surface sm:text-3xl">
              How our chimney repair works
            </h2>
          </Reveal>
          <div className="mt-8">
            <Reveal>
              <HowItWorks />
            </Reveal>
          </div>
        </div>
      </section>

      <BrandsGrid />

      <ServiceAreas service={s} />

      <section id="book" className="scroll-mt-16 bg-surface-variant py-14 lg:py-20">
        <div className="mx-auto max-w-3xl px-4">
          <Reveal>
            <h2 className="text-2xl font-extrabold tracking-tight text-on-surface sm:text-3xl">
              Book your chimney repair in Bengaluru
            </h2>
            <p className="mt-2 text-sm text-on-surface-variant">{s.blurb}</p>
          </Reveal>
          <div className="mt-8">
            <LeadForm appliance="chimney-repair" source="chimney-repair-page" />
          </div>
        </div>
      </section>

      <FaqSection
        title="Chimney repair in Bengaluru — FAQ"
        subtitle="Answers to the most searched questions about kitchen chimney repair in Bengaluru — brands, common faults and quality."
        faqs={faqs}
        image="/chimney.png"
      />

      <TipsSection tips={tips} image="/chimney.png" />
    </div>
  );
}
