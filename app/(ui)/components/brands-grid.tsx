"use client";

import { useState } from "react";
import Link from "next/link";
import { brands } from "@/app/(config)/content";
import { slugify } from "@/app/(common-lib)/slugify";
import { Reveal } from "@/app/(ui)/components/reveal";

export function BrandsGrid() {
  const [expanded, setExpanded] = useState(false);
  const previewCount = 8;
  const shown = expanded ? brands : brands.slice(0, previewCount);
  const remaining = brands.length - previewCount;

  return (
    <section className="py-14 lg:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <Reveal>
          <h2 className="text-2xl font-extrabold tracking-tight text-on-surface sm:text-3xl">
            Brands we service
          </h2>
          <p className="mt-1 text-sm text-on-surface-variant">
            Genuine spare parts for every major appliance brand.
          </p>
        </Reveal>
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {shown.map((b, i) => (
            <li key={b}>
              <Link
                href={`/brands/${slugify(b)}`}
                className="group relative flex h-20 items-center justify-center overflow-hidden card-zoom rounded-2xl border border-outline-variant bg-surface px-4 transition-colors hover:border-primary hover:bg-primary-container"
              >
                <span
                  className="water-fill"
                  style={{
                    animation: `waterFill 32s ease-in-out infinite`,
                    animationDelay: `${-32 + (i * 32 / shown.length)}s`,
                  }}
                  aria-hidden="true"
                />
                <span className="relative text-base font-extrabold tracking-tight text-on-surface transition-colors group-hover:text-primary">
                  {b}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        {!expanded && remaining > 0 && (
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="mt-4 inline-flex items-center gap-1 btn-zoom rounded-lg bg-primary px-4 py-2 text-sm font-bold text-on-primary transition-transform hover:scale-[1.02] active:scale-95"
          >
            Show all {brands.length} brands
          </button>
        )}
        {expanded && (
          <button
            type="button"
            onClick={() => setExpanded(false)}
            className="mt-4 inline-flex items-center gap-1 btn-zoom rounded-lg bg-primary px-4 py-2 text-sm font-bold text-on-primary transition-transform hover:scale-[1.02] active:scale-95"
          >
            Show less
          </button>
        )}
      </div>
    </section>
  );
}
