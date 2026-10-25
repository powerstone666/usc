import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { areas, bangaloreAreas, areaRegions, services, site, steps, trustBadges } from "@/app/(config)/site";
import { Icon } from "@/app/(ui)/components/icons";
import { Reveal } from "@/app/(ui)/components/reveal";
import { ServiceHero } from "@/app/(ui)/components/service-hero";
import { aboutAnswer } from "@/app/(config)/aeo";

export const metadata: Metadata = {
  title: "About",
  description: `About ${site.name} — Bengaluru's appliance repair specialists for microwave, AC, washing machine and refrigerator repair.`,
  alternates: { canonical: "/about" },
};

const points = [
  { title: "Microwave-first", text: "We lead with microwave oven repair — dedicated specialists, faster diagnosis, genuine parts." },
  { title: "Verified technicians", text: "Background-checked, trained pros — not random contractors. On-time, every time." },
  { title: "Transparent quotes", text: "Free diagnosis. You approve the quote before any work begins. No surprises." },
  { title: "Quality assured", text: "Every repair is quality assured and reliable." },
];

export default function Page() {
  return (
    <div className="flex flex-col">
      {/* Hero — image with horizontal gradient blend */}
      <ServiceHero
        path="/about"
        pageType="AboutPage"
        answer={aboutAnswer}
        image="/team.png"
        title={`About ${site.name}`}
        tagline="We started with one frustration: getting a microwave fixed in Bengaluru meant waiting days for a brand service centre, with vague quotes and no accountability. We built the opposite — same-day slots, specialists who diagnose before they quote, and a quality that actually means something."
      />

      {/* Points — with small accent image */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-8 text-2xl font-extrabold tracking-tight text-on-surface sm:text-3xl">What we stand for</h2>
          <div className="grid gap-8 lg:grid-cols-[1fr,2fr] lg:items-center">
            <div className="relative h-48 overflow-hidden rounded-2xl lg:h-64">
              <Image
                src="/happy-home.png"
                alt="Happy Bengaluru homes with working appliances"
                fill
                sizes="33vw"
                className="object-cover"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {points.map((p, i) => (
                <Reveal key={p.title} delay={i * 0.05}>
                  <div className="flex h-full flex-col gap-2 card-zoom rounded-2xl border border-outline-variant bg-surface p-6">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-container text-primary">
                      <Icon name="check-circle" className="h-5 w-5" />
                    </span>
                    <h3 className="text-base font-bold text-on-surface">
                      {p.title}
                    </h3>
                    <p className="text-base text-on-surface-variant">{p.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>


      <section className="bg-surface-variant py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-extrabold tracking-tight text-on-surface sm:text-3xl">What we repair</h2>
          <p className="mt-2 max-w-2xl text-base text-on-surface-variant">
            {site.name} repairs six kinds of home appliance in {site.city}. Each repair starts with a free diagnosis and a quote you approve before any work begins.
          </p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <li key={s.slug} className="rounded-2xl bg-surface p-5">
                <h3 className="text-base font-extrabold text-on-surface">
                  <Link href={`/services/${s.slug}`} className="hover:text-primary hover:underline">
                    {s.name}
                  </Link>
                </h3>
                <p className="mt-2 text-base text-on-surface-variant">{s.blurb}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-extrabold tracking-tight text-on-surface sm:text-3xl">How a repair works</h2>
          <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((st, i) => (
              <li key={st.title} className="rounded-2xl border border-outline-variant bg-surface p-5">
                <p className="text-sm font-bold uppercase tracking-wide text-primary">Step {i + 1}</p>
                <h3 className="mt-1 text-base font-extrabold text-on-surface">{st.title}</h3>
                <p className="mt-2 text-base text-on-surface-variant">{st.text}</p>
              </li>
            ))}
          </ol>
          <h3 className="mt-10 text-lg font-extrabold text-on-surface">Our commitments</h3>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {trustBadges.map((b) => (
              <li key={b.title} className="text-base text-on-surface-variant">
                <span className="font-bold text-on-surface">{b.title}.</span> {b.text}.
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-surface-variant py-12 sm:py-16 lg:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-on-surface sm:text-3xl">Where we work</h2>
            <p className="mt-2 text-base text-on-surface-variant">
              We serve {areas.length} neighbourhoods across {site.city}, grouped into {areaRegions.length} zones. Same-day slots are available in most areas.
            </p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {areaRegions.map((r) => (
                <li key={r} className="text-base text-on-surface-variant">
                  <span className="font-bold text-on-surface">{r}:</span>{" "}
                  {bangaloreAreas.filter((a) => a.region === r).length} neighbourhoods
                </li>
              ))}
            </ul>
            <p className="mt-4 text-base">
              <Link href="/coverage" className="font-bold text-primary hover:underline">See every area we cover</Link>
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-on-surface sm:text-3xl">Contact and hours</h2>
            <dl className="mt-4 space-y-3 text-base">
              <div><dt className="font-bold text-on-surface">Phone</dt><dd className="text-on-surface-variant">{site.phoneDisplay}</dd></div>
              <div><dt className="font-bold text-on-surface">Email</dt><dd className="text-on-surface-variant">{site.email}</dd></div>
              <div><dt className="font-bold text-on-surface">Hours</dt><dd className="text-on-surface-variant">{site.hours}</dd></div>
              <div><dt className="font-bold text-on-surface">Address</dt><dd className="text-on-surface-variant">{site.address.streetAddress}, {site.address.addressLocality}, {site.address.addressRegion} {site.address.postalCode}</dd></div>
            </dl>
          </div>
        </div>
      </section>
    </div>
  );
}
