import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { bangaloreAreas, areas, services, site } from "@/app/(config)/site";
import { slugify } from "@/app/(common-lib)/slugify";
import { ServiceHero } from "@/app/(ui)/components/service-hero";
import { LeadForm } from "@/app/(ui)/components/lead-form";
import { Icon } from "@/app/(ui)/components/icons";
import { CallButton } from "@/app/(ui)/components/call-button";
import { JsonLd } from "@/app/(ui)/components/json-ld";

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

  const nearby = areas
    .filter((a) => a !== areaData.name)
    .slice(0, 8);

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
        title={`Appliance Repair in ${areaData.name}, Bengaluru`}
        tagline={`Same-day microwave, AC, washing machine & refrigerator repair in ${areaData.name}. Verified technicians, free diagnosis, genuine parts, quality assured.`}
      >
        <div className="mt-5">
          <CallButton variant="light"  />
        </div>
      </ServiceHero>

      <section className="py-14 lg:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-extrabold tracking-tight text-on-surface sm:text-3xl">
            Our services in {areaData.name}
          </h2>
          <p className="mt-1 text-sm text-on-surface-variant">
            Same-day repair slots available in {areaData.name} and nearby
            neighbourhoods across {site.city}.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <Link
                key={s.slug}
                href={`/areas/${area}/${s.slug}`}
                className="group flex flex-col gap-2 card-zoom rounded-3xl border border-outline-variant bg-surface p-5 transition-colors hover:border-primary"
              >
                <h3 className="text-base font-extrabold text-on-surface">
                  {s.name}
                </h3>
                <p className="text-sm text-on-surface-variant">
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

      <section className="bg-surface-variant py-14 lg:py-20">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-extrabold tracking-tight text-on-surface sm:text-3xl">
            Nearby areas we serve
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {nearby.map((a) => (
              <li key={a}>
                <Link
                  href={`/areas/${slugify(a)}`}
                  className="rounded-lg border border-outline-variant bg-surface px-3 py-1.5 text-sm text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
                >
                  {a}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-14 lg:py-20">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="text-2xl font-extrabold tracking-tight text-on-surface sm:text-3xl">
            Book a repair in {areaData.name}
          </h2>
          <p className="mt-2 text-sm text-on-surface-variant">
            Share your number and our technician will call you back within 15
            minutes.
          </p>
          <div className="mt-8">
            <LeadForm appliance="general" source={`area-${area}`} />
          </div>
        </div>
      </section>
    </div>
  );
}
