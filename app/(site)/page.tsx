import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { services, site } from "@/app/(config)/site";
import { homeFaqs, serviceProblems } from "@/app/(config)/content";
import { blogPosts } from "@/app/(config)/blog";
import { formatDate } from "@/app/(common-lib)/format-date";
import { Icon, type IconName } from "@/app/(ui)/components/icons";
import { CallButton } from "@/app/(ui)/components/call-button";
import { ServiceTile } from "@/app/(ui)/components/service-tile";
import { HowItWorks } from "@/app/(ui)/components/how-it-works";
import { Reviews } from "@/app/(ui)/components/reviews";
import { Coverage } from "@/app/(ui)/components/coverage";
import { WhyChooseUs } from "@/app/(ui)/components/why-choose-us";
import { BrandsGrid } from "@/app/(ui)/components/brands-grid";
import { FaqSection } from "@/app/(ui)/components/faq-section";
import { TrustBadges } from "@/app/(ui)/components/trust-badges";
import { SectionHeading } from "@/app/(ui)/components/section-heading";
import { LastUpdated } from "@/app/(ui)/components/last-updated";
import { PageSchema } from "@/app/(ui)/components/page-schema";
import { homeAnswer } from "@/app/(config)/aeo";
import { JsonLd } from "@/app/(ui)/components/json-ld";

export const metadata: Metadata = {
  title: "Appliance Repair in Bengaluru — Same-Day Service",
  description:
    "Same-day microwave, AC, washing machine, fridge, water filter and chimney repair across Bengaluru. Verified experts, genuine parts and transparent quotes.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <div className="flex flex-col">
      <PageSchema path="/" name={site.name} description={site.tagline} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "@id": `${site.url}/#website`,
          url: site.url,
          name: site.name,
          description: site.tagline,
          publisher: {
            "@id": `${site.url}/#business`,
          },
        }}
      />
      {/* Hero: solid brand surface for readable text, photo as its own card */}
      <section className="bg-primary text-on-primary">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 pb-16 pt-28 min-[360px]:pt-24 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12 lg:pb-24 lg:pt-32">
          <div>
            <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-on-primary/85">
              <Icon name="clock" className="h-4 w-4" />
              {site.city} · same-day repair
            </p>
            <h1 className="mt-4 max-w-3xl text-xl font-extrabold leading-[1.2] tracking-tight min-[360px]:text-2xl min-[380px]:text-[1.75rem] min-[380px]:leading-[1.15] sm:text-4xl sm:leading-[1.1] lg:text-5xl">
              Microwave, AC, washing machine, fridge, water filter &amp; chimney repair services in Bengaluru
            </h1>
            <p data-answer-block className="mt-4 max-w-xl text-base text-on-primary/90 sm:text-lg">
              {homeAnswer}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <CallButton variant="light" />
              <Link
                href="/services/microwave-repair"
                className="btn-zoom btn-outline-light"
              >
                Diagnose my microwave
                <Icon name="arrow" className="h-4 w-4" />
              </Link>
            </div>
            <p className="mt-5 text-sm text-on-primary/85">
              {site.warranty} · {site.damageCover} · {site.hours}
            </p>
            <LastUpdated />
          </div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-secondary lg:aspect-[4/3]">
            <Image
              src="/hero.webp"
              alt="Appliance repair technician at work in a Bengaluru kitchen"
              fill
              priority
              fetchPriority="high"
              sizes="(max-width: 640px) 92vw, (max-width: 1024px) 85vw, 40vw"
              className="object-cover object-right"
            />
          </div>
        </div>
      </section>

      {/* Trust strip overlaps the hero edge so proof is visible without scrolling far */}
      <section aria-label="Why customers trust us" className="relative z-10 -mt-8 px-4">
        <div className="mx-auto max-w-6xl">
          <TrustBadges />
        </div>
      </section>

      {/* Services */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading
            title="What can we fix today?"
            subtitle={`Pick your appliance. Same-day repair across ${site.city}.`}
          />
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {services.map((s) => (
              <ServiceTile key={s.slug} service={s} />
            ))}
          </div>
        </div>
      </section>

      {/* Common problems */}
      <section className="content-auto bg-surface-variant py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading
            title="Common problems we fix"
            subtitle="From microwave not heating to AC gas refill — we repair every common appliance fault in Bengaluru."
          />
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {services.map((s) => (
              <li
                key={s.slug}
                className="flex gap-4 rounded-2xl bg-surface p-3 sm:flex-col sm:p-4"
              >
                <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl sm:aspect-[4/3] sm:h-auto sm:w-full">
                  <Image
                    src={`/${s.icon}-problem.webp`}
                    alt={`${s.name} — common problems and repair in Bengaluru`}
                    fill
                    sizes="(max-width: 640px) 112px, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <h3 className="text-base font-extrabold text-on-surface">
                    {s.name}
                  </h3>
                  <ul className="mt-2 space-y-1.5">
                    {serviceProblems[s.slug].slice(0, 3).map((p) => (
                      <li
                        key={p.title}
                        className="flex items-start gap-2 text-base text-on-surface-variant"
                      >
                        <Icon
                          name={p.icon as IconName}
                          className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                        />
                        {p.title}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/services/${s.slug}`}
                    className="mt-3 inline-flex min-h-10 items-center gap-1 self-start text-sm font-bold text-primary hover:underline"
                  >
                    {s.short} details
                    <Icon name="arrow" className="h-4 w-4" />
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <WhyChooseUs />

      <section className="content-auto py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading
            title="How it works"
            subtitle="Four steps from fault to fixed — same day, at your doorstep."
          />
          <div className="mt-8">
            <HowItWorks />
          </div>
        </div>
      </section>

      <section
        id="reviews"
        className="content-auto scroll-mt-20 bg-surface-variant py-12 sm:py-16 lg:py-20"
      >
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading title="Bengaluru trusts us with their appliances" />
          <div className="mt-6">
            <Reviews />
          </div>
        </div>
      </section>

      <BrandsGrid />

      <FaqSection
        title="Frequently asked questions"
        subtitle="Everything you need to know about appliance repair in Bengaluru — microwave, AC, washing machine and refrigerator."
        faqs={homeFaqs.slice(0, 6)}
        image="/microwave.webp"
        includeSchema
      />

      <section id="coverage" className="content-auto scroll-mt-20 py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <Coverage />
        </div>
      </section>

      {/* Blog */}
      <section id="blog" className="content-auto scroll-mt-20 bg-surface-variant py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading
            title="Blog & guides"
            subtitle="Expert tips to keep your appliances running longer."
            action={
              <Link
                href="/blog"
                className="btn-zoom inline-flex min-h-11 items-center gap-1 self-start rounded-xl bg-primary px-5 text-sm font-bold text-on-primary hover:bg-secondary sm:self-auto"
              >
                All articles
                <Icon name="arrow" className="h-4 w-4" />
              </Link>
            }
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {blogPosts.slice(0, 3).map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="card-zoom flex h-full flex-col gap-3 rounded-2xl border border-outline-variant bg-surface p-4"
              >
                <div className="relative aspect-[16/10] overflow-hidden rounded-xl">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <p className="text-sm font-bold uppercase tracking-wide text-primary">
                  {post.category}
                </p>
                <h3 className="text-lg font-extrabold leading-snug text-on-surface">
                  {post.title}
                </h3>
                <p className="text-base text-on-surface-variant">
                  {post.excerpt}
                </p>
                <p className="mt-auto pt-1 text-sm text-muted">
                  {formatDate(post.date)} · {post.readTime}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
