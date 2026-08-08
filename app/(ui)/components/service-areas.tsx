import Link from "next/link";
import { popularAreas, site, type Service } from "@/app/(config)/site";
import { slugify } from "@/app/(common-lib)/slugify";
import { Reveal } from "@/app/(ui)/components/reveal";
import { Icon } from "@/app/(ui)/components/icons";

export function ServiceAreas({ service }: { service: Service }) {
  return (
    <section className="bg-surface-variant py-14 lg:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <Reveal>
          <h2 className="text-2xl font-extrabold tracking-tight text-on-surface sm:text-3xl">
            {service.name} across {site.city}
          </h2>
          <p className="mt-1 text-sm text-on-surface-variant">
            Same-day {service.name.toLowerCase()} in your neighbourhood — pick
            your area for local details.
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <ul className="mt-6 flex flex-wrap gap-2">
            {popularAreas.map((a) => (
              <li key={a}>
                <Link
                  href={`/areas/${slugify(a)}/${service.slug}`}
                  className="block rounded-lg border border-outline-variant bg-surface px-3 py-1.5 text-sm text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
                >
                  {a}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm font-bold">
            <Link
              href={`/near-me/${service.slug}`}
              className="inline-flex items-center gap-1 text-primary"
            >
              {service.short} repair near me
              <Icon name="arrow" className="h-4 w-4" />
            </Link>
            <Link href="/coverage" className="inline-flex items-center gap-1 text-primary">
              All coverage areas
              <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
