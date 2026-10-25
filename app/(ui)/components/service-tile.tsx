import Link from "next/link";
import Image from "next/image";
import type { Service } from "@/app/(config)/site";
import { Icon } from "@/app/(ui)/components/icons";

export function ServiceTile({ service }: { service: Service }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="card-zoom group flex h-full flex-col overflow-hidden rounded-2xl border border-outline-variant bg-surface"
    >
      <span className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={`/${service.icon}.png`}
          alt={service.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </span>
      <span className="flex flex-1 flex-col gap-1.5 p-3 sm:gap-2 sm:p-4">
        <span className="text-base font-extrabold leading-tight text-on-surface sm:text-lg">
          {service.name}
        </span>
        <span className="hidden text-sm text-on-surface-variant sm:line-clamp-2">
          {service.tagline}
        </span>
        <span className="mt-auto inline-flex items-center gap-1 pt-1 text-sm font-bold text-primary">
          Book now
          <Icon
            name="arrow"
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
          />
        </span>
      </span>
    </Link>
  );
}
