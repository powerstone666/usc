import type { Metadata } from "next";
import { areas, site, reviews } from "@/app/(config)/site";
import { CallButton } from "@/app/(ui)/components/call-button";
import { SectionHeading } from "@/app/(ui)/components/section-heading";
import { Reviews } from "@/app/(ui)/components/reviews";
import { ServiceHero } from "@/app/(ui)/components/service-hero";
import { JsonLd } from "@/app/(ui)/components/json-ld";

export const metadata: Metadata = {
  title: "Customer Reviews",
  description:
    "Verified reviews from Bengaluru homeowners for microwave, AC, washing machine and fridge repairs. Rated 4.8★ for same-day service and genuine parts.",
  alternates: { canonical: "/reviews" },
};

export default function Page() {
  return (
    <div className="flex flex-col">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "HomeAndConstructionBusiness",
          "@id": `${site.url}/#business`,
          name: site.name,
          url: site.url,
          telephone: site.phone,
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1),
            reviewCount: reviews.length.toString(),
            bestRating: "5",
            worstRating: "1",
          },
          review: reviews.map((r) => ({
            "@type": "Review",
            author: { "@type": "Person", name: r.name },
            reviewRating: {
              "@type": "Rating",
              ratingValue: r.rating.toString(),
              bestRating: "5",
            },
            reviewBody: r.text,
          })),
        }}
      />
      <ServiceHero
        path="/reviews"
        image="/happy-customer.png"
        title="Bengaluru trusts us with their appliances"
        tagline={`${reviews.length} customer reviews from across ${site.city}. Same-day repair, genuine parts, quality assured.`}
      />

      <section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading
            title="What our customers say"
            subtitle={`Reviews from customers across ${site.city}. The average below is calculated from the reviews shown on this page.`}
          />
          <div className="mt-6">
            <Reviews layout="grid" />
          </div>
        </div>
      </section>
      <section className="bg-surface-variant py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-extrabold tracking-tight text-on-surface sm:text-3xl">Book your repair</h2>
          <p className="mt-2 max-w-2xl text-base text-on-surface-variant">
            Call {site.name} {site.hours}. Diagnosis is free, you get a quote before any work, and same-day slots are available across {areas.length}+ neighbourhoods in {site.city}.
          </p>
          <div className="mt-5">
            <CallButton variant="dark" />
          </div>
        </div>
      </section>
    </div>
  );
}
