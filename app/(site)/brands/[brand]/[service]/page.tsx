import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { brands, serviceProblems, serviceFaqs, serviceTips } from "@/app/(config)/content";
import { services, site } from "@/app/(config)/site";
import { slugify } from "@/app/(common-lib)/slugify";
import { ServiceHero } from "@/app/(ui)/components/service-hero";
import { LeadForm } from "@/app/(ui)/components/lead-form";
import { FaqSection } from "@/app/(ui)/components/faq-section";
import { TipsSection } from "@/app/(ui)/components/tips-section";
import { Icon, type IconName } from "@/app/(ui)/components/icons";
import { CallButton } from "@/app/(ui)/components/call-button";
import { JsonLd } from "@/app/(ui)/components/json-ld";

export function generateStaticParams() {
  const params: { brand: string; service: string }[] = [];
  for (const brand of brands) {
    for (const service of services) {
      params.push({ brand: slugify(brand), service: service.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ brand: string; service: string }>;
}): Promise<Metadata> {
  const { brand, service } = await params;
  const brandName = brands.find((b) => slugify(b) === brand);
  const serviceData = services.find((s) => s.slug === service);
  if (!brandName || !serviceData) return { title: "Not found" };
  return {
    title: `${brandName} ${serviceData.short} Repair`,
    description: `${brandName} ${serviceData.name.toLowerCase()} in Bengaluru — genuine ${brandName} spare parts, verified technicians, free diagnosis, quality assured. ${serviceData.tagline}`,
    alternates: { canonical: `/brands/${brand}/${service}` },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ brand: string; service: string }>;
}) {
  const { brand, service } = await params;
  const brandName = brands.find((b) => slugify(b) === brand);
  const serviceData = services.find((s) => s.slug === service);
  if (!brandName || !serviceData) notFound();

  const problems = serviceProblems[serviceData.slug];
  const faqs = serviceFaqs[serviceData.slug].slice(0, 6);
  const tips = serviceTips[serviceData.slug];

  return (
    <div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: `${brandName} ${serviceData.name}`,
          serviceType: serviceData.name,
          areaServed: site.city,
          provider: { "@type": "LocalBusiness", name: site.name, address: { "@type": "PostalAddress", streetAddress: site.address.streetAddress, addressLocality: site.address.addressLocality, addressRegion: site.address.addressRegion, postalCode: site.address.postalCode, addressCountry: site.address.addressCountry }, telephone: site.phone, url: site.url },
        }}
      />
      <ServiceHero
        image={serviceData.icon === "microwave" ? "/microwave-repair.png" : serviceData.icon === "ac" ? "/ac-repair.png" : serviceData.icon === "washing-machine" ? "/wm-repair.png" : "/fridge-repair.png"}
        title={`${brandName} ${serviceData.name} in Bengaluru`}
        tagline={`Genuine ${brandName} spare parts, verified technicians, same-day ${serviceData.name.toLowerCase()} across ${site.city}. Free diagnosis, quality assured.`}
      >
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <CallButton variant="light" showNumber />
          <Link
            href={`/brands/${brand}`}
            className="inline-flex items-center justify-center gap-2 btn-zoom rounded-lg border-2 border-white/40 px-5 py-3 text-sm font-bold text-on-primary hover:bg-white/10"
          >
            All {brandName} repairs
            <Icon name="arrow" className="h-4 w-4" />
          </Link>
        </div>
      </ServiceHero>

      <section className="py-14 lg:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-extrabold tracking-tight text-on-surface sm:text-3xl">
            Common {brandName} {serviceData.short.toLowerCase()} problems we fix
          </h2>
          <p className="mt-1 text-sm text-on-surface-variant">
            We repair {brandName} {serviceData.name.toLowerCase()} across{" "}
            {site.city} — from {problems[0].title.toLowerCase()} to{" "}
            {problems[problems.length - 1].title.toLowerCase()}.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {problems.map((p) => (
              <div
                key={p.title}
                className="flex h-full flex-col gap-2 card-zoom rounded-3xl border border-outline-variant bg-surface p-5"
              >
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
            ))}
          </div>
        </div>
      </section>

      <FaqSection
        title={`${brandName} ${serviceData.name} — FAQ`}
        subtitle={`Common questions about ${brandName} ${serviceData.name.toLowerCase()} in ${site.city}.`}
        faqs={faqs}
      />

      <section id="book" className="scroll-mt-16 bg-surface-variant py-14 lg:py-20">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="text-2xl font-extrabold tracking-tight text-on-surface sm:text-3xl">
            Book your {brandName} {serviceData.short.toLowerCase()} repair
          </h2>
          <p className="mt-2 text-sm text-on-surface-variant">
            {serviceData.blurb} Share your number and our technician will call
            you back within 15 minutes.
          </p>
          <div className="mt-8">
            <LeadForm
              appliance={serviceData.slug}
              source={`brand-${brand}-${service}`}
            />
          </div>
        </div>
      </section>

      <TipsSection tips={tips} image={serviceData.icon === "microwave" ? "/microwave.png" : serviceData.icon === "ac" ? "/ac.png" : serviceData.icon === "washing-machine" ? "/washing-machine.png" : "/refrigerator.png"} />
    </div>
  );
}
