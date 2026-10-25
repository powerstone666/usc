import type { Metadata } from "next";
import Link from "next/link";
import { site, getService } from "@/app/(config)/site";
import { serviceFaqs, serviceProblems, serviceTips } from "@/app/(config)/content";
import { LeadForm } from "@/app/(ui)/components/lead-form";
import { ServiceHero } from "@/app/(ui)/components/service-hero";
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
  title: "Microwave Oven Repair in Bengaluru",
  description:
    "Same-day microwave oven repair in Bengaluru. Not heating, sparking or panel issues fixed at home by verified experts. Free diagnosis, genuine parts.",
  alternates: { canonical: "/services/microwave-repair" },
  openGraph: {
    title: "Microwave Oven Repair in Bengaluru",
    description:
      "Same-day microwave oven repair in Bengaluru. Not heating, sparking, panel dead? Tell us the symptom — our specialist diagnoses and fixes it at home.",
    url: `${site.url}/services/microwave-repair`,
  },
};

export default function Page() {
  const s = getService("microwave-repair");
  const problems = serviceProblems["microwave-repair"];
  const faqs = serviceFaqs["microwave-repair"];
  const tips = serviceTips["microwave-repair"];

  const problemSlugMap: Record<string, string> = {
    "Microwave not heating": "microwave-not-heating",
    "Sparking inside": "microwave-sparking",
    "Turntable not rotating": "microwave-turntable-not-rotating",
    "Buttons not working": "microwave-buttons-not-working",
    "Not turning on": "microwave-not-turning-on",
  };

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
          serviceType: "Microwave oven repair",
          areaServed: {
            "@type": "City",
            name: site.city,
          },
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Microwave Oven Repair Services",
            itemListElement: [
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Doorstep Microwave Diagnostic Inspection",
                },
                price: "0",
                priceCurrency: "INR",
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Waveguide Mica Sheet Sparking Fix",
                },
                price: "299",
                priceCurrency: "INR",
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Microwave Turntable Motor Repair",
                },
                price: "450",
                priceCurrency: "INR",
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "High-Voltage Diode & Capacitor Fix",
                },
                price: "550",
                priceCurrency: "INR",
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Touchpad Membrane & Control Board Repair",
                },
                price: "850",
                priceCurrency: "INR",
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Genuine Microwave Magnetron Replacement",
                },
                price: "1200",
                priceCurrency: "INR",
              },
            ],
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
      <ServiceHero path="/services/microwave-repair" answer={serviceAnswer(s)} image="/microwave-repair.png" title={s.name} tagline={s.tagline}>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <CallButton variant="light"  />
          <Link
            href="#diagnose"
            className="btn-zoom btn-outline-light"
          >
            Diagnose my microwave
            <Icon name="arrow" className="h-4 w-4" />
          </Link>
        </div>
      </ServiceHero>

      {/* Common problems — keyword-rich */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal>
            <h2 className="text-2xl font-extrabold tracking-tight text-on-surface sm:text-3xl">
              Common microwave problems we fix in Bengaluru
            </h2>
            <p className="mt-1 text-base text-on-surface-variant">
              From microwave not heating to sparking — we repair every fault at
              your doorstep across {site.city}.
            </p>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {problems.map((p, i) => {
              const kwSlug = problemSlugMap[p.title];
              return (
                <Reveal key={p.title} delay={i * 0.03}>
                  <div className="flex h-full flex-col justify-between gap-2 card-zoom rounded-2xl border border-outline-variant bg-surface p-5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-container text-primary">
                          <Icon name={p.icon as IconName} className="h-4 w-4" />
                        </span>
                        <h3 className="text-base font-bold text-on-surface">
                          {p.title}
                        </h3>
                      </div>
                      <p className="mt-2 text-base text-on-surface-variant">
                        {p.description}
                      </p>
                    </div>
                    {kwSlug && (
                      <Link
                        href={`/keywords/${kwSlug}`}
                        className="mt-3 inline-flex items-center gap-1 self-start text-sm font-bold text-primary hover:underline"
                      >
                        Detailed {p.title.toLowerCase()} fix
                        <Icon name="arrow" className="h-3.5 w-3.5" />
                      </Link>
                    )}
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Types of Microwaves Serviced */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal>
            <h2 className="text-2xl font-extrabold tracking-tight text-on-surface sm:text-3xl">
              Solo, Grill &amp; Convection Microwave Ovens Repaired
            </h2>
            <p className="mt-1 text-base text-on-surface-variant">
              Our technicians are factory-trained across all three generations of microwave technology.
            </p>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-outline-variant bg-surface p-5">
              <span className="inline-block rounded-xl bg-primary/10 px-2.5 py-1 text-sm font-bold text-primary">Daily Reheating</span>
              <h3 className="mt-3 text-lg font-bold text-on-surface">Solo Microwave Ovens</h3>
              <p className="mt-1.5 text-sm text-on-surface-variant">
                Ideal for uniform reheating and defrosting. Common fixes include magnetron replacement, diode testing, and turntable motor repair.
              </p>
            </div>
            <div className="rounded-2xl border border-outline-variant bg-surface p-5">
              <span className="inline-block rounded-xl bg-primary/10 px-2.5 py-1 text-sm font-bold text-primary">Grilling &amp; Toasting</span>
              <h3 className="mt-3 text-lg font-bold text-on-surface">Grill Microwave Ovens</h3>
              <p className="mt-1.5 text-sm text-on-surface-variant">
                Features heating coils for crisping and grilling. Common fixes include quartz heater replacement, dual selector switch, and thermostat wiring.
              </p>
            </div>
            <div className="rounded-2xl border border-outline-variant bg-surface p-5">
              <span className="inline-block rounded-xl bg-primary/10 px-2.5 py-1 text-sm font-bold text-primary">Baking &amp; Roasting</span>
              <h3 className="mt-3 text-lg font-bold text-on-surface">Convection Microwave Ovens</h3>
              <p className="mt-1.5 text-sm text-on-surface-variant">
                Combines microwave energy with forced hot air for baking. Common fixes include convection fan motor, heating elements, and PCB sensor calibration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Blog & Educational Silo */}
      <section className="bg-primary/5 py-10 sm:py-12">
        <div className="mx-auto max-w-5xl px-4">
          <div className="flex flex-col items-center justify-between gap-6 rounded-3xl border border-primary/20 bg-surface p-6 sm:flex-row sm:p-8">
            <div>
              <span className="text-sm font-bold uppercase tracking-wider text-primary">Expert Diagnostic Guide</span>
              <h3 className="mt-1 text-xl font-bold text-on-surface sm:text-2xl">
                Want to understand why your microwave stopped heating?
              </h3>
              <p className="mt-1.5 max-w-2xl text-sm text-on-surface-variant">
                Read our in-depth diagnostic teardown covering magnetron resistance readings, capacitor safety precautions, and waveguide maintenance for Bengaluru homes.
              </p>
            </div>
            <Link
              href="/blog/microwave-repair-bengaluru-complete-guide"
              className="btn-zoom inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-on-primary hover:bg-secondary"
            >
              Read 2026 Guide
              <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Brand-Specific Microwave Repair */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal>
            <h2 className="text-2xl font-extrabold tracking-tight text-on-surface sm:text-3xl">
              Brand-Specific Microwave Specialists in Bengaluru
            </h2>
            <p className="mt-1 text-base text-on-surface-variant">
              Direct access to brand-certified technicians carrying authentic OEM parts.
            </p>
          </Reveal>
          <div className="mt-6 flex flex-wrap gap-2.5">
            <Link
              href="/keywords/lg-microwave-repair-near-me"
              className="rounded-xl border border-outline-variant bg-surface px-4 py-2.5 text-sm font-bold text-on-surface transition-colors hover:border-primary hover:text-primary"
            >
              LG Microwave Repair Bengaluru →
            </Link>
            <Link
              href="/keywords/samsung-microwave-repair-near-me"
              className="rounded-xl border border-outline-variant bg-surface px-4 py-2.5 text-sm font-bold text-on-surface transition-colors hover:border-primary hover:text-primary"
            >
              Samsung Microwave Repair Bengaluru →
            </Link>
            <Link
              href="/keywords/ifb-microwave-repair-near-me"
              className="rounded-xl border border-outline-variant bg-surface px-4 py-2.5 text-sm font-bold text-on-surface transition-colors hover:border-primary hover:text-primary"
            >
              IFB Microwave Repair Bengaluru →
            </Link>
            <Link
              href="/brands/whirlpool"
              className="rounded-xl border border-outline-variant bg-surface px-4 py-2.5 text-sm font-bold text-on-surface transition-colors hover:border-primary hover:text-primary"
            >
              Whirlpool Microwave Repair →
            </Link>
            <Link
              href="/brands/panasonic"
              className="rounded-xl border border-outline-variant bg-surface px-4 py-2.5 text-sm font-bold text-on-surface transition-colors hover:border-primary hover:text-primary"
            >
              Panasonic Inverter Microwave Repair →
            </Link>
            <Link
              href="/brands/godrej"
              className="rounded-xl border border-outline-variant bg-surface px-4 py-2.5 text-sm font-bold text-on-surface transition-colors hover:border-primary hover:text-primary"
            >
              Godrej Microwave Repair →
            </Link>
            <Link
              href="/brands/bajaj"
              className="rounded-xl border border-outline-variant bg-surface px-4 py-2.5 text-sm font-bold text-on-surface transition-colors hover:border-primary hover:text-primary"
            >
              Bajaj Microwave Oven Service →
            </Link>
          </div>
        </div>
      </section>

      <WhyChooseUs serviceSlug="microwave-repair" />

      {/* Process */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal>
            <h2 className="text-2xl font-extrabold tracking-tight text-on-surface sm:text-3xl">
              How our microwave repair works
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

      {/* Callback form */}
      <section id="diagnose" className="scroll-mt-16 py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-4">
          <Reveal>
            <h2 className="text-2xl font-extrabold tracking-tight text-on-surface sm:text-3xl">
              Book your microwave repair in Bengaluru
            </h2>
            <p className="mt-2 text-base text-on-surface-variant">{s.blurb}</p>
          </Reveal>
          <div className="mt-8">
            <LeadForm appliance="microwave-repair" source="microwave-repair-page" />
          </div>
        </div>
      </section>

      {/* FAQ — keyword-rich with JSON-LD */}
      <FaqSection
        title="Microwave repair in Bengaluru — FAQ"
        subtitle="Answers to the most searched questions about microwave oven repair in Bengaluru — cost, brands, common faults and quality."
        faqs={faqs}
        image="/microwave.png"
        includeSchema
      />

      <TipsSection tips={tips} image="/microwave.png" />
    </div>
  );
}
