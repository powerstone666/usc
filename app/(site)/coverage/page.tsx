import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { site, areas, bangaloreAreas, areaRegions, steps } from "@/app/(config)/site";
import { slugify } from "@/app/(common-lib)/slugify";
import { Coverage } from "@/app/(ui)/components/coverage";
import { Reveal } from "@/app/(ui)/components/reveal";
import { ServiceHero } from "@/app/(ui)/components/service-hero";
import { coverageAnswer } from "@/app/(config)/aeo";

export const metadata: Metadata = {
  title: "Coverage — Areas We Serve in Bengaluru",
  description:
    "Same-day appliance repair across 85+ neighbourhoods in Bengaluru — from Indiranagar to Whitefield, Jayanagar to Hebbal. Microwave, AC, washing machine & refrigerator repair.",
  alternates: { canonical: "/coverage" },
};

export default function Page() {
  return (
    <div className="flex flex-col">
      <ServiceHero
        path="/coverage"
        pageType="CollectionPage"
        answer={coverageAnswer}
        image="/city.png"
        title={`Areas we serve in ${site.city}`}
        tagline={`Same-day appliance repair across ${areas.length}+ neighbourhoods — from Indiranagar to Whitefield, Jayanagar to Hebbal.`}
      />

      <section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <Coverage />
        </div>
      </section>

      <section className="bg-surface-variant py-12 sm:py-16 lg:py-20">
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
              <p className="mt-1 text-base text-on-surface-variant">
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
                      <p className="text-sm text-on-surface-variant">
                        {regionAreas.length} areas
                      </p>
                    </div>
                    <ul className="flex flex-wrap gap-2">
                      {regionAreas.map((a) => (
                        <li key={a.name}>
                          <Link
                            href={`/areas/${slugify(a.name)}`}
                            className="block rounded-xl border border-outline-variant bg-surface px-3 py-1.5 text-base text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
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


      <section className="bg-surface-variant py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-extrabold tracking-tight text-on-surface sm:text-3xl">
            How booking works in every area
          </h2>
          <p className="mt-2 max-w-2xl text-base text-on-surface-variant">
            The process is the same in all {areas.length} neighbourhoods. {site.name} repairs microwaves, ACs, washing machines, refrigerators, water filters and kitchen chimneys, with a free diagnosis and a quote you approve before any work starts.
          </p>
          <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((st, i) => (
              <li key={st.title} className="rounded-2xl bg-surface p-5">
                <p className="text-sm font-bold uppercase tracking-wide text-primary">Step {i + 1}</p>
                <h3 className="mt-1 text-base font-extrabold text-on-surface">{st.title}</h3>
                <p className="mt-2 text-base text-on-surface-variant">{st.text}</p>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-base text-on-surface-variant">
            Bookings are taken {site.hours}. Call {site.phoneDisplay} or request a callback from any area page.
          </p>
        </div>
      </section>
    </div>
  );
}
