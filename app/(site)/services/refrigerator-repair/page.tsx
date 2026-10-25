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
import { serviceAnswer } from "@/app/(config)/aeo";

export const metadata: Metadata = {
  title: "Refrigerator Repair in Bengaluru",
  description:
    "Same-day refrigerator repair in Bengaluru. Cooling faults, gas leaks & compressor issues fixed for single, double & side-by-side fridges. Free diagnosis.",
  alternates: { canonical: "/services/refrigerator-repair" },
  openGraph: {
    title: "Refrigerator Repair in Bengaluru",
    description:
      "Same-day refrigerator repair in Bengaluru — all brands, all types. Free diagnosis, quality assured.",
    url: `${site.url}/services/refrigerator-repair`,
  },
};

export default function Page() {
  const s = getService("refrigerator-repair");
  const problems = serviceProblems["refrigerator-repair"];
  const faqs = serviceFaqs["refrigerator-repair"];
  const tips = serviceTips["refrigerator-repair"];

  return (
    <div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          "@id": `${site.url}/services/${s.slug}#service`,
          url: `${site.url}/services/${s.slug}`,
          name: s.name,
          description: s.blurb,
          serviceType: "Refrigerator repair",
          areaServed: {
            "@type": "City",
            name: site.city,
          },
          provider: {
            "@type": "HomeAndConstructionBusiness",
            "@id": `${site.url}/#business`,
            name: site.name,
            telephone: site.phone,
            url: site.url,
            image: `${site.url}/hero.png`,
            address: {
              "@type": "PostalAddress",
              streetAddress: site.address.streetAddress,
              addressLocality: site.address.addressLocality,
              addressRegion: site.address.addressRegion,
              postalCode: site.address.postalCode,
              addressCountry: site.address.addressCountry,
            },
            openingHoursSpecification: [
              {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                opens: "08:00",
                closes: "21:00",
              },
            ],
          },
        }}
      />
      <ServiceHero path="/services/refrigerator-repair" answer={serviceAnswer(s)} image="/fridge-repair.png" title={s.name} tagline={s.tagline}>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <CallButton variant="light"  />
          <Link
            href="#book"
            className="btn-zoom btn-outline-light"
          >
            Request a callback
          </Link>
        </div>
      </ServiceHero>

      <section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal>
            <h2 className="text-2xl font-extrabold tracking-tight text-on-surface sm:text-3xl">
              Common refrigerator problems we fix in Bengaluru
            </h2>
            <p className="mt-1 text-base text-on-surface-variant">
              From fridge not cooling to water leakage — we repair every fault
              at your doorstep across {site.city}.
            </p>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {problems.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.03}>
                <div className="flex h-full flex-col gap-2 card-zoom rounded-2xl border border-outline-variant bg-surface p-5">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-container text-primary">
                      <Icon name={p.icon as IconName} className="h-4 w-4" />
                    </span>
                    <h3 className="text-base font-bold text-on-surface">
                      {p.title}
                    </h3>
                  </div>
                  <p className="text-base text-on-surface-variant">
                    {p.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <WhyChooseUs serviceSlug="refrigerator-repair" />

      <section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal>
            <h2 className="text-2xl font-extrabold tracking-tight text-on-surface sm:text-3xl">
              How our refrigerator repair works
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

      <section id="book" className="scroll-mt-16 py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-4">
          <Reveal>
            <h2 className="text-2xl font-extrabold tracking-tight text-on-surface sm:text-3xl">
              Book your refrigerator repair in Bengaluru
            </h2>
            <p className="mt-2 text-base text-on-surface-variant">{s.blurb}</p>
          </Reveal>
          <div className="mt-8">
            <LeadForm appliance="refrigerator-repair" source="fridge-repair-page" />
          </div>
        </div>
      </section>

      <FaqSection
        title="Refrigerator repair in Bengaluru — FAQ"
        subtitle="Answers to the most searched questions about refrigerator repair in Bengaluru — cost, brands, common faults and quality."
        faqs={faqs}
        image="/refrigerator.png"
        includeSchema
      />

      <TipsSection tips={tips} image="/refrigerator.png" />
    </div>
  );
}
