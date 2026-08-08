import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { site, areas, bangaloreAreas, areaRegions } from "@/app/(config)/site";
import { slugify } from "@/app/(common-lib)/slugify";
import { Coverage } from "@/app/(ui)/components/coverage";
import { Reveal } from "@/app/(ui)/components/reveal";

export const metadata: Metadata = {
  title: "Coverage — Areas We Serve in Bengaluru",
  description:
    "Same-day appliance repair across 84+ neighbourhoods in Bengaluru — from Indiranagar to Whitefield, Jayanagar to Hebbal. Microwave, AC, washing machine & refrigerator repair.",
  alternates: { canonical: "/coverage" },
};

export default function Page() {
  return (
    <div className="flex flex-col">
      <section className="relative isolate overflow-hidden">
        <Image
          src="/city.png"
          alt="Bengaluru city — areas we serve"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary to-primary/30" />
        <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-28 text-on-primary lg:pb-20 lg:pt-32">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-wide text-on-primary/80">
              Coverage
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Areas we serve in {site.city}
            </h1>
            <p className="mt-4 max-w-lg text-base text-on-primary/90">
              Same-day appliance repair across {areas.length}+ neighbourhoods —
              from Indiranagar to Whitefield, Jayanagar to Hebbal.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-14 lg:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <Coverage />
        </div>
      </section>

      <section className="bg-surface-variant py-14 lg:py-20">
        <div className="mx-auto max-w-5xl px-4">
          <div className="flex items-center gap-4">
            <div className="relative hidden h-20 w-20 shrink-0 overflow-hidden rounded-2xl sm:block">
              <Image
                src="/scooter.png"
                alt="Technician travelling across Bengaluru"
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>
            <Reveal>
              <h2 className="text-2xl font-extrabold tracking-tight text-on-surface sm:text-3xl">
                All neighbourhoods by region
              </h2>
              <p className="mt-1 text-sm text-on-surface-variant">
                We serve every part of {site.city} — {areas.length}+ neighbourhoods
                across 9 regions.
              </p>
            </Reveal>
          </div>
          <div className="mt-8 space-y-1">
            {areaRegions.map((region, i) => {
              const regionAreas = bangaloreAreas.filter(
                (a) => a.region === region,
              );
              if (regionAreas.length === 0) return null;
              return (
                <Reveal key={region} delay={i * 0.03}>
                  <div className="flex flex-col gap-3 border-b border-outline-variant py-5 sm:flex-row sm:items-start sm:gap-8">
                    <div className="shrink-0 sm:w-48">
                      <p className="text-base font-extrabold text-on-surface">
                        {region}
                      </p>
                      <p className="text-xs text-on-surface-variant">
                        {regionAreas.length} areas
                      </p>
                    </div>
                    <ul className="flex flex-wrap gap-2">
                      {regionAreas.map((a) => (
                        <li key={a.name}>
                          <Link
                            href={`/areas/${slugify(a.name)}`}
                            className="block rounded-lg border border-outline-variant bg-surface px-3 py-1.5 text-sm text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
                          >
                            {a.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
}
