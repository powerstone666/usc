import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { site } from "@/app/(config)/site";
import { Icon, type IconName } from "@/app/(ui)/components/icons";
import { Reveal } from "@/app/(ui)/components/reveal";

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
      <section className="relative isolate overflow-hidden">
        <Image
          src="/team.png"
          alt="Urban Service Company technician in Bengaluru"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary to-primary/30" />
        <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-28 text-on-primary lg:pb-20 lg:pt-32">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-wide text-on-primary/80">
              About
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
              {site.name}
            </h1>
            <p className="mt-4 max-w-xl text-base text-on-primary/90">
              We started with one frustration: getting a microwave fixed in
              Bengaluru meant waiting days for a brand service centre, with
              vague quotes and no accountability. We built the opposite —
              same-day slots, specialists who diagnose before they quote, and a
              quality that actually means something.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Points — with small accent image */}
      <section className="py-14 lg:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-8 lg:grid-cols-[1fr,2fr] lg:items-center">
            <div className="relative h-48 overflow-hidden rounded-3xl lg:h-64">
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
                  <div className="flex h-full flex-col gap-2 card-zoom rounded-3xl border border-outline-variant bg-surface p-6">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-container text-primary">
                      <Icon name="check-circle" className="h-5 w-5" />
                    </span>
                    <p className="text-base font-bold text-on-surface">
                      {p.title}
                    </p>
                    <p className="text-sm text-on-surface-variant">{p.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
