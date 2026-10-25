import Link from "next/link";
import { popularAreas, site, type Service } from "@/app/(config)/site";
import { slugify } from "@/app/(common-lib)/slugify";
import { SectionHeading } from "@/app/(ui)/components/section-heading";
import { Icon } from "@/app/(ui)/components/icons";

export function ServiceAreas({ service }: { service: Service }) {
  return (
    <section className="bg-surface-variant py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading
          title={`${service.name} across ${site.city}`}
          subtitle={`Same-day ${service.name.toLowerCase()} in your neighbourhood — pick your area for local details.`}
        />
        <ul className="mt-6 flex flex-wrap gap-2">
          {popularAreas.map((a) => (
            <li key={a}>
              <Link
                href={`/areas/${slugify(a)}/${service.slug}`}
                className="flex min-h-10 items-center rounded-lg border border-outline-variant bg-surface px-3.5 text-sm font-medium text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
              >
                {a}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-1 text-base font-bold">
          <Link
            href={`/near-me/${service.slug}`}
            className="inline-flex min-h-10 items-center gap-1 text-primary hover:underline"
          >
            {service.short} repair near me
            <Icon name="arrow" className="h-4 w-4" />
          </Link>
          <Link
            href="/coverage"
            className="inline-flex min-h-10 items-center gap-1 text-primary hover:underline"
          >
            All coverage areas
            <Icon name="arrow" className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
