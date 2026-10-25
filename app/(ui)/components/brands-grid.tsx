"use client";

import { useState } from "react";
import Link from "next/link";
import { brands } from "@/app/(config)/content";
import { slugify } from "@/app/(common-lib)/slugify";
import { SectionHeading } from "@/app/(ui)/components/section-heading";

const PREVIEW_COUNT = 8;

export function BrandsGrid() {
  const [expanded, setExpanded] = useState(false);
  const remaining = brands.length - PREVIEW_COUNT;

  return (
    <section className="content-auto py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading
          title="Brands we service"
          subtitle="Genuine spare parts for every major appliance brand."
        />
        {/* All links stay in the HTML; extras are only hidden visually. */}
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {brands.map((b, i) => (
            <li key={b} className={!expanded && i >= PREVIEW_COUNT ? "hidden" : undefined}>
              <Link
                href={`/brands/${slugify(b)}`}
                className="card-zoom flex min-h-14 items-center justify-center rounded-xl border border-outline-variant bg-surface px-4 py-3 text-center text-base font-bold text-on-surface hover:text-primary"
              >
                {b}
              </Link>
            </li>
          ))}
        </ul>
        {remaining > 0 && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="btn-tonal mt-4"
          >
            {expanded ? "Show fewer brands" : `Show all ${brands.length} brands`}
          </button>
        )}
      </div>
    </section>
  );
}
