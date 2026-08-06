import Link from "next/link";
import type { Metadata } from "next";
import { site, services, areas } from "@/app/(config)/site";
import { slugify } from "@/app/(common-lib)/slugify";
import { CallButton } from "@/app/(ui)/components/call-button";
import { Icon } from "@/app/(ui)/components/icons";

export const metadata: Metadata = {
  title: "Page Not Found — Appliance Repair in Bengaluru",
  description:
    "The page you're looking for doesn't exist. Find microwave repair, AC repair, washing machine repair, refrigerator repair, water filter repair and chimney repair services across 84+ Bengaluru neighbourhoods.",
  robots: { index: false, follow: true },
  alternates: { canonical: site.url + "/404" },
};

const popularAreas = [
  "Indiranagar", "Koramangala", "Whitefield", "HSR Layout",
  "Jayanagar", "Marathahalli", "BTM Layout", "Electronic City",
  "Hebbal", "Malleswaram", "Rajajinagar", "Yelahanka",
];

const keywords = [
  "appliance repair bengaluru",
  "microwave repair near me",
  "ac repair bengaluru",
  "washing machine repair bengaluru",
  "refrigerator repair near me",
  "fridge repair bengaluru",
  "water filter repair bengaluru",
  "chimney repair bengaluru",
  "ro purifier service bengaluru",
  "ac gas refill bengaluru",
  "microwave not heating",
  "ac not cooling",
  "washing machine not draining",
  "fridge not cooling",
  "chimney not sucking smoke",
  "same day appliance repair bengaluru",
];

export default function NotFound() {
  return (
    <div className="min-h-[70vh] bg-background">
      <section className="relative overflow-hidden bg-gradient-to-br from-primary to-[#1565c0] py-16 lg:py-24">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <p className="text-6xl font-extrabold text-on-primary/20 lg:text-8xl">404</p>
          <h1 className="mt-4 text-2xl font-extrabold text-on-primary lg:text-4xl">
            Oops! This page broke down
          </h1>
          <p className="mt-3 max-w-lg mx-auto text-sm text-on-primary/80">
            But your appliance doesn't have to. We fix microwaves, ACs, washing machines,
            refrigerators, water filters and chimneys across {site.city} — same day.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <CallButton variant="dark"  />
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg border-2 border-white/40 px-5 py-3 text-sm font-bold text-on-primary hover:bg-white/10"
            >
              <Icon name="arrow" className="h-4 w-4 rotate-180" />
              Go Home
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <h2 className="text-xl font-extrabold text-on-surface lg:text-2xl">
              Find what you're looking for
            </h2>
            <p className="mt-2 text-sm text-on-surface-variant">
              Same-day repair services across {site.city}
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="card-zoom flex flex-col gap-2 rounded-3xl border border-outline-variant bg-surface p-6"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-container">
                    <Icon name={s.icon} className="h-5 w-5 text-on-primary-container" />
                  </span>
                  <div>
                    <h3 className="text-sm font-extrabold text-on-surface">{s.name}</h3>
                    <p className="text-xs text-on-surface-variant">{s.short} repair</p>
                  </div>
                </div>
                <p className="text-xs leading-6 text-on-surface-variant">{s.blurb}</p>
                <span className="mt-auto inline-flex items-center gap-1 pt-2 text-xs font-bold text-primary">
                  Book now <Icon name="arrow" className="h-3 w-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-outline-variant bg-surface-variant py-12">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-lg font-extrabold text-on-surface">
            Popular areas we serve
          </h2>
          <p className="mt-1 text-center text-xs text-on-surface-variant">
            Same-day repair in {areas.length}+ Bengaluru neighbourhoods
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {popularAreas.map((area) => (
              <Link
                key={area}
                href={`/areas/${slugify(area)}`}
                className="rounded-lg border border-outline-variant bg-surface px-3 py-1.5 text-xs font-medium text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
              >
                {area}
              </Link>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Link
              href="/coverage"
              className="text-xs font-bold text-primary hover:underline"
            >
              View all {areas.length}+ areas
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-lg font-extrabold text-on-surface">
            Quick links
          </h2>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {[
              { label: "Microwave Repair", href: "/services/microwave-repair" },
              { label: "AC Repair & Gas Refill", href: "/services/ac-repair" },
              { label: "Washing Machine Repair", href: "/services/washing-machine-repair" },
              { label: "Refrigerator Repair", href: "/services/refrigerator-repair" },
              { label: "Water Filter / RO Repair", href: "/services/water-filter-repair" },
              { label: "Kitchen Chimney Repair", href: "/services/chimney-repair" },
              { label: "Blog — Repair Guides", href: "/blog" },
              { label: "About Us", href: "/about" },
              { label: "Contact", href: "/contact" },
              { label: "Customer Reviews", href: "/reviews" },
              { label: "Coverage Areas", href: "/coverage" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg bg-primary-container px-3 py-1.5 text-xs font-medium text-on-primary-container transition-colors hover:opacity-80"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-outline-variant bg-surface py-8">
        <div className="mx-auto max-w-4xl px-4">
          <p className="text-center text-[10px] leading-5 text-muted">
            {keywords.join(" · ")}
          </p>
          <p className="mt-4 text-center text-xs text-on-surface-variant">
            {site.name} ·  · {site.email} · {site.hours} · {site.city}
          </p>
        </div>
      </section>
    </div>
  );
}
