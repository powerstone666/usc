import Link from "next/link";
import Image from "next/image";
import type { Service } from "@/app/(config)/site";
import { Icon } from "@/app/(ui)/components/icons";

export function ServiceTile({ service }: { service: Service }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="card-zoom group flex h-full flex-col overflow-hidden rounded-3xl bg-surface-variant"
    >
      <span className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={`/${service.icon}.png`}
          alt={service.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </span>
      <span className="flex flex-1 flex-col gap-2 p-5">
        <span className="text-lg font-extrabold leading-tight text-on-surface">
          {service.name}
        </span>
        <span className="text-sm text-on-surface-variant">
          {service.tagline}
        </span>
        <span className="mt-auto inline-flex items-center gap-1 pt-2 text-sm font-bold text-primary">
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
