import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { brands, serviceProblems } from "@/app/(config)/content";
import { services, site } from "@/app/(config)/site";
import { slugify } from "@/app/(common-lib)/slugify";
import { ServiceHero } from "@/app/(ui)/components/service-hero";
import { LeadForm } from "@/app/(ui)/components/lead-form";
import { Icon, type IconName } from "@/app/(ui)/components/icons";
import { CallButton } from "@/app/(ui)/components/call-button";
import { JsonLd } from "@/app/(ui)/components/json-ld";

export function generateStaticParams() {
  return brands.map((b) => ({ brand: slugify(b) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ brand: string }>;
}): Promise<Metadata> {
  const { brand } = await params;
  const brandName = brands.find((b) => slugify(b) === brand);
  if (!brandName) return { title: "Not found" };
  return {
    title: `${brandName} Appliance Repair in Bengaluru — All Appliances`,
    description: `${brandName} microwave, AC, washing machine and refrigerator repair in Bengaluru. Genuine ${brandName} spare parts, verified technicians, free diagnosis, quality assured.`,
    alternates: { canonical: `/brands/${brand}` },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ brand: string }>;
}) {
  const { brand } = await params;
  const brandName = brands.find((b) => slugify(b) === brand);
  if (!brandName) notFound();

  return (
    <div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: `${brandName} Appliance Repair`,
          serviceType: "Appliance repair",
          areaServed: site.city,
          provider: { "@type": "LocalBusiness", name: site.name },
        }}
      />
      <ServiceHero
        title={`${brandName} Appliance Repair in Bengaluru`}
        tagline={`Genuine ${brandName} spare parts, verified technicians, same-day repair across ${site.city}. Free diagnosis, quality assured.`}
      >
        <div className="mt-5">
          <CallButton variant="light" showNumber />
        </div>
      </ServiceHero>

      <section className="py-14 lg:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-extrabold tracking-tight text-on-surface sm:text-3xl">
            Common {brandName} problems we fix
          </h2>
          <p className="mt-1 text-sm text-on-surface-variant">
            We repair {brandName} microwaves, ACs, washing machines and
            refrigerators across {site.city}.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <div key={s.slug} className="flex flex-col gap-3">
                <h3 className="text-base font-extrabold text-on-surface">
                  {brandName} {s.short}
                </h3>
                <ul className="space-y-1.5">
                  {serviceProblems[s.slug].slice(0, 4).map((p) => (
                    <li
                      key={p.title}
                      className="flex items-start gap-1.5 text-sm text-on-surface-variant"
                    >
                      <Icon
                        name={p.icon as IconName}
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary"
                      />
                      {p.title}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/services/${s.slug}`}
                  className="mt-1 inline-flex items-center gap-1 text-sm font-bold text-primary"
                >
                  {brandName} {s.short} repair
                  <Icon name="arrow" className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface-variant py-14 lg:py-20">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="text-2xl font-extrabold tracking-tight text-on-surface sm:text-3xl">
            Book your {brandName} repair in Bengaluru
          </h2>
          <p className="mt-2 text-sm text-on-surface-variant">
            Share your number and our technician will call you back within 15
            minutes.
          </p>
          <div className="mt-8">
            <LeadForm
              appliance="general"
              source={`brand-${brand}`}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
