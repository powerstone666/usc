import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { keywords as staticKeywords } from "@/app/(config)/keywords";
import { serviceProblems, serviceFaqs } from "@/app/(config)/content";
import { services, site } from "@/app/(config)/site";
import { ServiceHero } from "@/app/(ui)/components/service-hero";
import { LeadForm } from "@/app/(ui)/components/lead-form";
import { FaqSection } from "@/app/(ui)/components/faq-section";
import { Icon, type IconName } from "@/app/(ui)/components/icons";
import { CallButton } from "@/app/(ui)/components/call-button";
import { JsonLd } from "@/app/(ui)/components/json-ld";
import { keywordAnswer } from "@/app/(config)/aeo";
import { truncate } from "@/app/(common-lib)/truncate";

export function generateStaticParams() {
  return staticKeywords.map((k) => ({ keyword: k.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ keyword: string }>;
}): Promise<Metadata> {
  const { keyword } = await params;
  const kw = staticKeywords.find((k) => k.slug === keyword);
  if (!kw) return { title: "Not found" };
  const serviceData = services.find((s) => s.slug === kw.service);

  const description = kw.isComparison
    ? `Looking for an alternative to Urban Company for ${serviceData?.name.toLowerCase() ?? "appliance repair"} in Bengaluru? Discover Urban Service Company — direct technicians, free doorstep diagnosis, and upfront pricing.`
    : `Same-day repair for ${kw.problem.toLowerCase()} in Bengaluru. Verified ${serviceData?.short ?? "appliance"} technicians, transparent quotes, genuine parts.`;

  return {
    // Long titles skip the " · Site name" suffix so they stay within a search-result width.
    title: kw.title.length + 25 > 70 ? { absolute: kw.title } : kw.title,
    description: truncate(description),
    alternates: {
      canonical: `/keywords/${keyword}`,
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ keyword: string }>;
}) {
  const { keyword } = await params;
  const kw = staticKeywords.find((k) => k.slug === keyword);
  if (!kw) notFound();

  const serviceData = services.find((s) => s.slug === kw.service);
  if (!serviceData) notFound();

  const problem = serviceProblems[kw.service]?.find(
    (p) => p.title === kw.problem,
  );
  const relatedProblems = (serviceProblems[kw.service] || [])
    .filter((p) => p.title !== kw.problem)
    .slice(0, 4);
  const faqs = (serviceFaqs[kw.service] || []).slice(0, 6);

  const heroTagline = kw.isComparison
    ? `Comparing appliance repair options in Bengaluru? Discover the Urban Service Company advantage — direct local specialists, free doorstep diagnosis, and zero platform surcharges.`
    : (problem?.description ?? serviceData.tagline);

  return (
    <div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: kw.title,
          serviceType: serviceData.name,
          areaServed: site.city,
          provider: {
            "@type": "LocalBusiness",
            name: site.name,
            address: {
              "@type": "PostalAddress",
              streetAddress: site.address.streetAddress,
              addressLocality: site.address.addressLocality,
              addressRegion: site.address.addressRegion,
              postalCode: site.address.postalCode,
              addressCountry: site.address.addressCountry,
            },
            telephone: site.phone,
            url: site.url,
          },
        }}
      />
      <ServiceHero
        path={`/keywords/${kw.slug}`}
        answer={keywordAnswer(kw)}
        title={kw.title}
        tagline={heroTagline}
      >
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <CallButton variant="light"  />
          <Link
            href={`/services/${serviceData.slug}`}
            className="btn-zoom btn-outline-light"
          >
            {serviceData.name}
            <Icon name="arrow" className="h-4 w-4" />
          </Link>
        </div>
      </ServiceHero>

      {kw.isComparison ? (
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-4xl px-4">
            <h2 className="text-2xl font-extrabold tracking-tight text-on-surface sm:text-3xl">
              Urban Service Company vs Marketplace Platforms in {site.city}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-on-surface-variant">
              When booking {serviceData.name.toLowerCase()} in {site.city}, knowing who enters your home matters. Here is an honest, transparent breakdown of how our direct-technician model compares to marketplace aggregator platforms like Urban Company.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-outline-variant bg-surface p-5">
                <span className="inline-block rounded-xl bg-primary/10 px-2.5 py-1 text-sm font-bold text-primary">
                  {site.name}
                </span>
                <h3 className="mt-3 text-base font-bold text-on-surface">Direct In-House Pros</h3>
                <p className="mt-1 text-sm text-on-surface-variant">
                  We employ and dispatch our own background-verified appliance specialists across 85+ {site.city} neighbourhoods with full accountability.
                </p>
              </div>

              <div className="rounded-2xl border border-outline-variant bg-surface-variant p-5">
                <span className="inline-block rounded-xl bg-black/10 px-2.5 py-1 text-sm font-bold text-on-surface-variant">
                  Marketplace Aggregators
                </span>
                <h3 className="mt-3 text-base font-bold text-on-surface">Rotating Gig Contractors</h3>
                <p className="mt-1 text-sm text-on-surface-variant">
                  Platform brokers that distribute jobs to independent gig contractors who bid on leads and change from visit to visit.
                </p>
              </div>

              <div className="rounded-2xl border border-outline-variant bg-surface p-5">
                <span className="inline-block rounded-xl bg-primary/10 px-2.5 py-1 text-sm font-bold text-primary">
                  {site.name}
                </span>
                <h3 className="mt-3 text-base font-bold text-on-surface">Free Doorstep Diagnosis</h3>
                <p className="mt-1 text-sm text-on-surface-variant">
                  Our technician inspects your appliance and gives an exact quote before any work starts. No surprise platform fees or surge pricing.
                </p>
              </div>

              <div className="rounded-2xl border border-outline-variant bg-surface-variant p-5">
                <span className="inline-block rounded-xl bg-black/10 px-2.5 py-1 text-sm font-bold text-on-surface-variant">
                  Marketplace Aggregators
                </span>
                <h3 className="mt-3 text-base font-bold text-on-surface">Upfront Booking Charges</h3>
                <p className="mt-1 text-sm text-on-surface-variant">
                  Often charge mandatory advance booking fees, platform convenience charges, and strict cancellation penalties.
                </p>
              </div>

              <div className="rounded-2xl border border-outline-variant bg-surface p-5">
                <span className="inline-block rounded-xl bg-primary/10 px-2.5 py-1 text-sm font-bold text-primary">
                  {site.name}
                </span>
                <h3 className="mt-3 text-base font-bold text-on-surface">Dedicated Appliance Experts</h3>
                <p className="mt-1 text-sm text-on-surface-variant">
                  Focused 100% on appliances: microwaves, ACs, washing machines, refrigerators, water filters, and kitchen chimneys.
                </p>
              </div>

              <div className="rounded-2xl border border-outline-variant bg-surface-variant p-5">
                <span className="inline-block rounded-xl bg-black/10 px-2.5 py-1 text-sm font-bold text-on-surface-variant">
                  Marketplace Aggregators
                </span>
                <h3 className="mt-3 text-base font-bold text-on-surface">General Multi-Service Catalog</h3>
                <p className="mt-1 text-sm text-on-surface-variant">
                  Broad apps juggling hundreds of diverse verticals from haircuts and salon grooming to pest control and deep cleaning.
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-surface-variant/50 p-4 text-sm leading-relaxed text-muted">
              *Disclaimer: Urban Company is a registered trademark of Urban Company Limited. Urban Service Company is an independent local appliance repair service in Bengaluru and is not affiliated with, authorized by, or sponsored by Urban Company. This comparison is provided for informational purposes to consumers comparing service alternatives.
            </div>
          </div>
        </section>
      ) : (
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-3xl px-4">
            <h2 className="text-2xl font-extrabold tracking-tight text-on-surface sm:text-3xl">
              What causes {kw.problem.toLowerCase()}?
            </h2>
            <p className="mt-3 text-base text-on-surface-variant">
              {problem?.description} Our technician diagnoses the exact cause and
              fixes it at your doorstep in {site.city}.
            </p>
            <div className="mt-6 card-zoom rounded-2xl border border-outline-variant bg-surface-variant p-6">
              <h3 className="text-sm font-bold text-on-surface">
                How we fix it
              </h3>
              <p className="mt-2 text-base text-on-surface-variant">
                Our verified {serviceData.short.toLowerCase()} technician inspects your unit to identify the exact cause of {kw.problem.toLowerCase()}. After a free doorstep diagnosis, we share a transparent, fixed quote before any work starts. The repair is completed at your home using genuine spare parts with quality assurance.
              </p>
            </div>
          </div>
        </section>
      )}

      {relatedProblems.length > 0 && (
        <section className="bg-surface-variant py-12 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-3xl px-4">
            <h2 className="text-2xl font-extrabold tracking-tight text-on-surface sm:text-3xl">
              Other {serviceData.short.toLowerCase()} problems we fix
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {relatedProblems.map((p) => {
                const relatedKw = staticKeywords.find(
                  (k) => k.service === kw.service && k.problem === p.title && k.slug !== kw.slug,
                );
                return relatedKw ? (
                  <Link
                    key={p.title}
                    href={`/keywords/${relatedKw.slug}`}
                    className="flex flex-col justify-between card-zoom rounded-2xl border border-outline-variant bg-surface p-4 transition-colors hover:border-primary"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <Icon
                          name={p.icon as IconName}
                          className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                        />
                        <p className="text-sm font-bold text-on-surface">
                          {p.title}
                        </p>
                      </div>
                      <p className="mt-1 text-sm text-on-surface-variant">
                        {p.description}
                      </p>
                    </div>
                    <span className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-primary">
                      View guide <Icon name="arrow" className="h-3 w-3" />
                    </span>
                  </Link>
                ) : (
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
                      <p className="text-base text-on-surface-variant">
                        {p.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <FaqSection
        title={`${kw.title} — FAQ`}
        subtitle={`Common questions about ${kw.problem.toLowerCase()} and ${serviceData.name.toLowerCase()} in ${site.city}.`}
        faqs={faqs}
      />

      <section id="book" className="scroll-mt-16 py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="text-2xl font-extrabold tracking-tight text-on-surface sm:text-3xl">
            Book your repair now
          </h2>
          <p className="mt-2 text-base text-on-surface-variant">
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
