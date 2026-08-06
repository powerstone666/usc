import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { services, site, areas } from "@/app/(config)/site";
import { serviceProblems, serviceFaqs } from "@/app/(config)/content";
import { ServiceHero } from "@/app/(ui)/components/service-hero";
import { LeadForm } from "@/app/(ui)/components/lead-form";
import { FaqSection } from "@/app/(ui)/components/faq-section";
import { Icon, type IconName } from "@/app/(ui)/components/icons";
import { CallButton } from "@/app/(ui)/components/call-button";
import { JsonLd } from "@/app/(ui)/components/json-ld";

export function generateStaticParams() {
  return services.map((s) => ({ service: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ service: string }>;
}): Promise<Metadata> {
  const { service } = await params;
  const s = services.find((sv) => sv.slug === service);
  if (!s) return { title: "Not found" };
  return {
    title: `${s.short} Repair Near Me in Bengaluru`,
    description: `${s.name} near you in Bengaluru — same-day repair by verified technicians, free diagnosis, genuine parts, quality assured. ${s.tagline}`,
    alternates: { canonical: `/near-me/${service}` },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ service: string }>;
}) {
  const { service } = await params;
  const s = services.find((sv) => sv.slug === service);
  if (!s) notFound();

  const problems = serviceProblems[s.slug];
  const faqs = serviceFaqs[s.slug].slice(0, 6);

  return (
    <div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: `${s.name} Near Me in ${site.city}`,
          serviceType: s.name,
          areaServed: site.city,
          provider: { "@type": "LocalBusiness", name: site.name, address: { "@type": "PostalAddress", streetAddress: site.address.streetAddress, addressLocality: site.address.addressLocality, addressRegion: site.address.addressRegion, postalCode: site.address.postalCode, addressCountry: site.address.addressCountry }, telephone: site.phone, url: site.url },
        }}
      />
      <ServiceHero
        image={s.icon === "microwave" ? "/microwave-repair.png" : s.icon === "ac" ? "/ac-repair.png" : s.icon === "washing-machine" ? "/wm-repair.png" : "/fridge-repair.png"}
        title={`${s.name} Near Me in Bengaluru`}
        tagline={`Looking for ${s.name.toLowerCase()} near you in ${site.city}? Same-day slots across ${areas.length}+ neighbourhoods, verified technicians, free diagnosis, genuine parts, quality assured.`}
      >
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <CallButton variant="light"  />
          <Link
            href={`/services/${s.slug}`}
            className="inline-flex items-center justify-center gap-2 btn-zoom rounded-lg border-2 border-white/40 px-5 py-3 text-sm font-bold text-on-primary hover:bg-white/10"
          >
            View service details
            <Icon name="arrow" className="h-4 w-4" />
          </Link>
        </div>
      </ServiceHero>

      <section className="py-14 lg:py-20">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-extrabold tracking-tight text-on-surface sm:text-3xl">
            {s.name} near you — same day
          </h2>
          <p className="mt-3 text-sm text-on-surface-variant">
            {s.blurb} Our technicians reach every neighbourhood in {site.city}{" "}
            — from Indiranagar to Whitefield, Jayanagar to Hebbal. Call us and
            a verified technician will be at your doorstep within 45 to 60
            minutes.
          </p>
        </div>
      </section>

      <section className="bg-surface-variant py-14 lg:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-extrabold tracking-tight text-on-surface sm:text-3xl">
            Common {s.short.toLowerCase()} problems we fix
          </h2>
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
        title={`${s.name} near me — FAQ`}
        subtitle={`Common questions about ${s.name.toLowerCase()} in ${site.city}.`}
        faqs={faqs}
      />

      <section id="book" className="scroll-mt-16 py-14 lg:py-20">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="text-2xl font-extrabold tracking-tight text-on-surface sm:text-3xl">
            Book {s.name.toLowerCase()} near you
          </h2>
          <p className="mt-2 text-sm text-on-surface-variant">
            Share your number and our technician will call you back within 15
            minutes.
          </p>
          <div className="mt-8">
            <LeadForm appliance={s.slug} source={`near-me-${service}`} />
          </div>
        </div>
      </section>
    </div>
  );
}
