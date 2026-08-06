import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { keywords } from "@/app/(config)/keywords";
import { serviceProblems, serviceFaqs } from "@/app/(config)/content";
import { services, site } from "@/app/(config)/site";
import { ServiceHero } from "@/app/(ui)/components/service-hero";
import { LeadForm } from "@/app/(ui)/components/lead-form";
import { FaqSection } from "@/app/(ui)/components/faq-section";
import { Icon, type IconName } from "@/app/(ui)/components/icons";
import { CallButton } from "@/app/(ui)/components/call-button";
import { JsonLd } from "@/app/(ui)/components/json-ld";

export function generateStaticParams() {
  return keywords.map((k) => ({ keyword: k.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ keyword: string }>;
}): Promise<Metadata> {
  const { keyword } = await params;
  const kw = keywords.find((k) => k.slug === keyword);
  if (!kw) return { title: "Not found" };
  const serviceData = services.find((s) => s.slug === kw.service);
  return {
    title: `${kw.title} — ${serviceData?.name ?? "Repair"} Service`,
    description: `${kw.title}? Same-day repair by verified technicians in Bengaluru. ${serviceData?.tagline ?? ""} Free diagnosis, genuine parts, quality assured.`,
    alternates: { canonical: `/keywords/${keyword}` },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ keyword: string }>;
}) {
  const { keyword } = await params;
  const kw = keywords.find((k) => k.slug === keyword);
  if (!kw) notFound();

  const serviceData = services.find((s) => s.slug === kw.service);
  if (!serviceData) notFound();

  const problem = serviceProblems[kw.service].find(
    (p) => p.title === kw.problem,
  );
  const relatedProblems = serviceProblems[kw.service]
    .filter((p) => p.title !== kw.problem)
    .slice(0, 4);
  const faqs = serviceFaqs[kw.service].slice(0, 6);

  return (
    <div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: kw.title,
          serviceType: serviceData.name,
          areaServed: site.city,
          provider: { "@type": "LocalBusiness", name: site.name, address: { "@type": "PostalAddress", streetAddress: site.address.streetAddress, addressLocality: site.address.addressLocality, addressRegion: site.address.addressRegion, postalCode: site.address.postalCode, addressCountry: site.address.addressCountry }, telephone: site.phone, url: site.url },
        }}
      />
      <ServiceHero
        title={kw.title}
        tagline={problem?.description ?? serviceData.tagline}
      >
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <CallButton variant="light"  />
          <Link
            href={`/services/${serviceData.slug}`}
            className="inline-flex items-center justify-center gap-2 btn-zoom rounded-lg border-2 border-white/40 px-5 py-3 text-sm font-bold text-on-primary hover:bg-white/10"
          >
            {serviceData.name}
            <Icon name="arrow" className="h-4 w-4" />
          </Link>
        </div>
      </ServiceHero>

      <section className="py-14 lg:py-20">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-extrabold tracking-tight text-on-surface sm:text-3xl">
            What causes {kw.problem.toLowerCase()}?
          </h2>
          <p className="mt-3 text-sm text-on-surface-variant">
            {problem?.description} Our technician diagnoses the exact cause and
            fixes it at your doorstep in {site.city}.
          </p>
          <div className="mt-6 card-zoom rounded-3xl border border-outline-variant bg-surface-variant p-6">
            <p className="text-sm font-bold text-on-surface">
              How we fix it
            </p>
            <p className="mt-2 text-sm text-on-surface-variant">
              Our technician visits your home, inspects the appliance, and
              identifies the root cause. After a free diagnosis, we share a
              transparent, fixed-rate quote. You approve before any work begins.
              Repairs are done at your home using genuine spare parts.
              Quality assured.
            </p>
          </div>
        </div>
      </section>

      {relatedProblems.length > 0 && (
        <section className="bg-surface-variant py-14 lg:py-20">
          <div className="mx-auto max-w-3xl px-4">
            <h2 className="text-2xl font-extrabold tracking-tight text-on-surface sm:text-3xl">
              Other {serviceData.short.toLowerCase()} problems we fix
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {relatedProblems.map((p) => (
                <div
                  key={p.title}
                  className="flex items-start gap-2 card-zoom rounded-2xl border border-outline-variant bg-surface p-4"
                >
                  <Icon
                    name={p.icon as IconName}
                    className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                  />
                  <div>
                    <p className="text-sm font-bold text-on-surface">
                      {p.title}
                    </p>
                    <p className="text-sm text-on-surface-variant">
                      {p.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <FaqSection
        title={`${kw.title} — FAQ`}
        subtitle={`Common questions about ${kw.problem.toLowerCase()} and ${serviceData.name.toLowerCase()} in ${site.city}.`}
        faqs={faqs}
      />

      <section id="book" className="scroll-mt-16 bg-surface-variant py-14 lg:py-20">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="text-2xl font-extrabold tracking-tight text-on-surface sm:text-3xl">
            Book your repair now
          </h2>
          <p className="mt-2 text-sm text-on-surface-variant">
            Is your {serviceData.short.toLowerCase()} {kw.problem.toLowerCase()}?
            Share your number and our technician will call you back within 15
            minutes.
          </p>
          <div className="mt-8">
            <LeadForm
              appliance={serviceData.slug}
              source={`keyword-${keyword}`}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
