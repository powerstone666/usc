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
import { brandAnswer, brandFaqs } from "@/app/(config)/aeo";
import { FaqSection } from "@/app/(ui)/components/faq-section";

const microwaveBrands = new Set([
  "Samsung",
  "LG",
  "IFB",
  "Whirlpool",
  "Panasonic",
  "Bajaj",
  "Godrej",
  "Morphy Richards",
  "Haier",
]);

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
    title: `${brandName} Appliance Repair in Bengaluru`,
    description: `Expert ${brandName} appliance repair in Bengaluru. Verified technicians, quality-tested spare parts, free diagnosis and quality assurance across ${site.city}.`,
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
          provider: { "@type": "LocalBusiness", name: site.name, address: { "@type": "PostalAddress", streetAddress: site.address.streetAddress, addressLocality: site.address.addressLocality, addressRegion: site.address.addressRegion, postalCode: site.address.postalCode, addressCountry: site.address.addressCountry }, telephone: site.phone, url: site.url },
        }}
      />
      <ServiceHero
        path={`/brands/${brand}`}
        answer={brandAnswer(brandName)}
        title={`${brandName} Appliance Repair in Bengaluru`}
        tagline={`Quality-tested spare parts, verified technicians, same-day repair across ${site.city}. Free diagnosis, quality assured.`}
      >
        <div className="mt-5">
          <CallButton variant="light"  />
        </div>
      </ServiceHero>

      <section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-4">
          {microwaveBrands.has(brandName) && (
            <div className="mb-8 rounded-2xl border border-primary/20 bg-primary/5 p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className="text-sm font-bold uppercase tracking-wider text-primary">Specialist Microwave Service</span>
                  <h2 className="text-lg font-bold text-on-surface">Same-Day {brandName} Microwave Oven Repair</h2>
                  <p className="mt-1 text-sm text-on-surface-variant">
                    Genuine {brandName} magnetrons, waveguide covers, and control boards in stock for doorstep replacement across {site.city}.
                  </p>
                </div>
                <Link
                  href="/services/microwave-repair"
                  className="btn-zoom inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-on-primary hover:bg-secondary"
                >
                  {brandName} Microwave Repair
                  <Icon name="arrow" className="h-4 w-4" />
                </Link>
              </div>
            </div>
          )}

          <h2 className="text-2xl font-extrabold tracking-tight text-on-surface sm:text-3xl">
            Common {brandName} problems we fix
          </h2>
          <p className="mt-1 text-base text-on-surface-variant">
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
                      className="flex items-start gap-1.5 text-base text-on-surface-variant"
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
                  className="inline-flex min-h-10 items-center gap-1 text-sm font-bold text-primary hover:underline"
                >
                  {brandName} {s.short} repair
                  <Icon name="arrow" className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="text-2xl font-extrabold tracking-tight text-on-surface sm:text-3xl">
            Book your {brandName} repair in Bengaluru
          </h2>
          <p className="mt-2 text-base text-on-surface-variant">
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

      <section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-extrabold tracking-tight text-on-surface sm:text-3xl">
            Other brands we service
          </h2>
          <ul className="mt-6 flex flex-wrap gap-2">
            {brands
              .filter((b) => b !== brandName)
              .map((b) => (
                <li key={b}>
                  <Link
                    href={`/brands/${slugify(b)}`}
                    className="block rounded-xl border border-outline-variant bg-surface px-3 py-1.5 text-base text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
                  >
                    {b}
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      </section>

      <FaqSection
        title={`${brandName} repair in ${site.city} — FAQ`}
        subtitle={`Answers about booking, diagnosis and spare parts for ${brandName} appliances.`}
        faqs={brandFaqs(brandName)}
      />
    </div>
  );
}
