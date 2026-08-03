"use client";

import Link from "next/link";
import { nav, site } from "@/app/(config)/site";
import { Wordmark } from "@/app/(ui)/components/wordmark";
import { Icon } from "@/app/(ui)/components/icons";
import { useDiagnostic } from "@/app/(ui)/components/diagnostic-provider";

export function Header() {
  const { openDiagnostic } = useDiagnostic();

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-3">
      <nav className="pointer-events-auto flex w-full max-w-6xl items-center justify-between gap-4 rounded-lg border border-outline-variant bg-background p-2 pl-5 shadow-lg shadow-black/5">
        <Link
          href="/"
          aria-label={`${site.name} — home`}
          className="rounded-xl"
        >
          <Wordmark />
        </Link>
        <div className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-on-surface-variant transition-colors hover:bg-surface-variant hover:text-on-surface"
            >
              {n.label}
            </Link>
          ))}
        </div>
        <button
          type="button"
          onClick={openDiagnostic}
          className="btn-zoom inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary transition-transform hover:scale-[1.02] active:scale-95"
        >
          <Icon name="phone" className="h-4 w-4" filled />
          <span>Call</span>
        </button>
      </nav>
    </header>
  );
}
