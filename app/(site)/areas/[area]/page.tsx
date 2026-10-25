import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { bangaloreAreas, services, site } from "@/app/(config)/site";
import { slugify } from "@/app/(common-lib)/slugify";
import { ServiceHero } from "@/app/(ui)/components/service-hero";
import { LeadForm } from "@/app/(ui)/components/lead-form";
import { Icon } from "@/app/(ui)/components/icons";
import { CallButton } from "@/app/(ui)/components/call-button";
import { JsonLd } from "@/app/(ui)/components/json-ld";
import { areaAnswer, areaFaqs } from "@/app/(config)/aeo";
import { FaqSection } from "@/app/(ui)/components/faq-section";

export function generateStaticParams() {
  return bangaloreAreas.map((a) => ({ area: slugify(a.name) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ area: string }>;
}): Promise<Metadata> {
  const { area } = await params;
  const areaData = bangaloreAreas.find((a) => slugify(a.name) === area);
  if (!areaData) return { title: "Not found" };
  return {
    title: `Appliance Repair in ${areaData.name}`,
    description: `Same-day microwave, AC, washing machine and refrigerator repair in ${areaData.name}, Bengaluru. Verified technicians, free diagnosis, genuine parts, quality assured.`,
    alternates: { canonical: `/areas/${area}` },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ area: string }>;
}) {
  const { area } = await params;
  const areaData = bangaloreAreas.find((a) => slugify(a.name) === area);
  if (!areaData) notFound();

  const regionNeighbours = bangaloreAreas
    .filter((a) => a.region === areaData.region && a.name !== areaData.name)
    .map((a) => a.name);
  const fallbackNeighbours = bangaloreAreas
    .filter((a) => a.region !== areaData.region && a.name !== areaData.name)
    .map((a) => a.name);
  const nearby = [...regionNeighbours, ...fallbackNeighbours].slice(0, 8);

  return (
    <div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: `Appliance Repair in ${areaData.name}`,
          serviceType: "Appliance repair",
          areaServed: { "@type": "Place", name: areaData.name },
          provider: { "@type": "LocalBusiness", name: site.name, address: { "@type": "PostalAddress", streetAddress: site.address.streetAddress, addressLocality: site.address.addressLocality, addressRegion: site.address.addressRegion, postalCode: site.address.postalCode, addressCountry: site.address.addressCountry }, telephone: site.phone, url: site.url },
        }}
      />
      <ServiceHero
        path={`/areas/${area}`}
        parent={{ name: "Coverage", path: "/coverage" }}
        answer={areaAnswer(areaData.name)}
        title={`Appliance Repair in ${areaData.name}, Bengaluru`}
        tagline={`Same-day microwave, AC, washing machine & refrigerator repair in ${areaData.name}. Verified technicians, free diagnosis, genuine parts, quality assured.`}
      >
        <div className="mt-5">
          <CallButton variant="light"  />
        </div>
      </ServiceHero>

      <section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-8 rounded-2xl border border-primary/20 bg-primary/5 p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-on-primary">
                  <Icon name="microwave" className="h-5 w-5" />
                </span>
                <div>
                  <span className="text-sm font-bold uppercase tracking-wider text-primary">Priority Service in {areaData.name}</span>
                  <h2 className="text-lg font-bold text-on-surface">Same-Day Microwave Oven Repair in {areaData.name}</h2>
                  <p className="mt-1 text-sm text-on-surface-variant">
                    Microwave not heating, sparking or dead panel? Our microwave technician reaches {areaData.name} within 45 minutes with genuine magnetrons and parts.
                  </p>
                </div>
              </div>
              <Link
                href="/services/microwave-repair"
                className="btn-zoom inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-on-primary hover:bg-secondary"
              >
                Book Microwave Repair
                <Icon name="arrow" className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <h2 className="text-2xl font-extrabold tracking-tight text-on-surface sm:text-3xl">
            Our services in {areaData.name}
          </h2>
          <p className="mt-1 text-base text-on-surface-variant">
            Same-day repair slots available in {areaData.name} and nearby
            neighbourhoods across {site.city}.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="group flex flex-col gap-2 card-zoom rounded-2xl border border-outline-variant bg-surface p-5 transition-colors hover:border-primary"
              >
                <h3 className="text-base font-extrabold text-on-surface">
                  {s.name}
                </h3>
                <p className="text-base text-on-surface-variant">
                  {s.tagline}
                </p>
                <span className="mt-auto inline-flex items-center gap-1 pt-2 text-sm font-bold text-primary">
                  Book now
                  <Icon name="arrow" className="h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface-variant py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-extrabold tracking-tight text-on-surface sm:text-3xl">
            Nearby areas we serve
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {nearby.map((a) => (
              <li key={a}>
                <Link
                  href={`/areas/${slugify(a)}`}
                  className="rounded-xl border border-outline-variant bg-surface px-3 py-1.5 text-base text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
                >
                  {a}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="text-2xl font-extrabold tracking-tight text-on-surface sm:text-3xl">
            Book a repair in {areaData.name}
          </h2>
          <p className="mt-2 text-base text-on-surface-variant">
            Share your number and our technician will call you back within 15
            minutes.
          </p>
          <div className="mt-8">
            <LeadForm appliance="general" source={`area-${area}`} />
          </div>
        </div>
      </section>

      <FaqSection
        title={`Appliance repair in ${areaData.name} — FAQ`}
        subtitle={`Answers about same-day repair, diagnosis and booking in ${areaData.name}, ${site.city}.`}
        faqs={areaFaqs(areaData.name, areaData.region, regionNeighbours)}
      />
    </div>
  );
}
