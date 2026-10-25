"use client";

import { useState } from "react";
import Link from "next/link";
import { areas, site } from "@/app/(config)/site";
import { slugify } from "@/app/(common-lib)/slugify";
import { Icon } from "@/app/(ui)/components/icons";

const PREVIEW_COUNT = 12;

export function Coverage() {
  const [expanded, setExpanded] = useState(false);
  const remaining = areas.length - PREVIEW_COUNT;

  return (
    <div className="grid gap-8 rounded-2xl bg-surface-variant p-5 sm:p-8 lg:grid-cols-[2fr_3fr]">
      <div className="flex flex-col justify-center gap-2">
        <h2 className="text-sm font-bold uppercase tracking-wide text-primary">
          Coverage
        </h2>
        <p className="text-4xl font-extrabold text-on-surface">
          {areas.length}+
        </p>
        <p className="text-lg font-bold text-on-surface">
          neighbourhoods in {site.city}
        </p>
        <p className="text-base text-on-surface-variant">
          Same-day slots from Indiranagar to Whitefield, Jayanagar to Hebbal —
          our technicians reach every corner of the city.
        </p>
      </div>
      <div className="flex flex-col justify-center">
        {/* All links stay in the HTML; extras are only hidden visually. */}
        <ul className="flex flex-wrap gap-2">
          {areas.map((a, i) => (
            <li key={a} className={!expanded && i >= PREVIEW_COUNT ? "hidden" : undefined}>
              <Link
                href={`/areas/${slugify(a)}`}
                className="flex min-h-10 items-center rounded-lg bg-background px-3.5 text-sm font-medium text-on-surface-variant transition-colors hover:bg-primary hover:text-on-primary"
              >
                {a}
              </Link>
            </li>
          ))}
        </ul>
        {remaining > 0 && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="btn-tonal mt-4 self-start"
          >
            {expanded ? "Show fewer areas" : `Show all ${areas.length} areas`}
            <Icon
              name="chevron"
              className={`h-4 w-4 ${expanded ? "-rotate-90" : "rotate-90"}`}
            />
          </button>
        )}
      </div>
    </div>
  );
}
