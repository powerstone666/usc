"use client";

import { useState } from "react";
import Link from "next/link";
import { areas, site } from "@/app/(config)/site";
import { slugify } from "@/app/(common-lib)/slugify";
import { Icon } from "@/app/(ui)/components/icons";

export function Coverage() {
  const [expanded, setExpanded] = useState(false);
  const previewCount = 12;
  const shown = expanded ? areas : areas.slice(0, previewCount);
  const remaining = areas.length - previewCount;

  return (
    <div className="grid gap-8 card-zoom rounded-3xl bg-surface-variant p-6 sm:p-8 lg:grid-cols-[2fr,3fr]">
      <div className="flex flex-col justify-center gap-3">
        <p className="text-sm font-bold uppercase tracking-wide text-primary">
          Coverage
        </p>
        <p className="text-4xl font-extrabold text-on-surface">
          {areas.length}+
        </p>
        <p className="text-base font-bold text-on-surface">
          neighbourhoods in {site.city}
        </p>
        <p className="text-sm text-on-surface-variant">
          Same-day slots from Indiranagar to Whitefield, Jayanagar to Hebbal —
          our technicians reach every corner of the city.
        </p>
      </div>
      <div className="flex flex-col justify-center">
        <ul className="flex flex-wrap gap-2">
          {shown.map((a) => (
            <li key={a}>
              <Link
                href={`/areas/${slugify(a)}`}
                className="block rounded-lg bg-background px-3 py-1.5 text-sm text-on-surface-variant transition-colors hover:bg-primary hover:text-on-primary"
              >
                {a}
              </Link>
            </li>
          ))}
        </ul>
        {!expanded && remaining > 0 && (
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="mt-4 inline-flex items-center gap-1 self-start btn-zoom rounded-lg bg-primary px-4 py-2 text-sm font-bold text-on-primary transition-transform hover:scale-[1.02] active:scale-95"
          >
            Show all {areas.length} areas
            <Icon name="chevron" className="h-4 w-4 rotate-90" />
          </button>
        )}
        {expanded && (
          <button
            type="button"
            onClick={() => setExpanded(false)}
            className="mt-4 inline-flex items-center gap-1 self-start btn-zoom rounded-lg bg-primary px-4 py-2 text-sm font-bold text-on-primary transition-transform hover:scale-[1.02] active:scale-95"
          >
            Show less
            <Icon name="chevron" className="h-4 w-4 -rotate-90" />
          </button>
        )}
      </div>
    </div>
  );
}
