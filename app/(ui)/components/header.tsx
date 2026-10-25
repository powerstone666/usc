"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav, secondaryNav } from "@/app/(config)/site";
import { Wordmark } from "@/app/(ui)/components/wordmark";
import { Icon } from "@/app/(ui)/components/icons";
import { useDiagnostic } from "@/app/(ui)/components/diagnostic-provider";
import { analytics } from "@/app/(common-lib)/analytics";

function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const { openDiagnostic } = useDiagnostic();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-3">
      <div className="pointer-events-auto relative w-full max-w-6xl">
        <nav className="flex items-center justify-between gap-4 rounded-2xl border border-outline-variant bg-background p-2 pl-4 shadow-lg shadow-black/5">
          <Link href="/" className="rounded-xl">
            <Wordmark />
          </Link>
          <div className="hidden items-center gap-1 md:flex" aria-label="Primary">
            {nav.map((n) => {
              const active = isActive(pathname, n.href);
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                    active
                      ? "bg-primary-container text-primary"
                      : "text-on-surface-variant hover:bg-surface-variant hover:text-on-surface"
                  }`}
                >
                  {n.label}
                </Link>
              );
            })}
            <Link
              href="/blog"
              aria-current={isActive(pathname, "/blog") ? "page" : undefined}
              className={`hidden rounded-lg px-3 py-2 text-sm font-semibold transition-colors lg:block ${
                isActive(pathname, "/blog")
                  ? "bg-primary-container text-primary"
                  : "text-on-surface-variant hover:bg-surface-variant hover:text-on-surface"
              }`}
            >
              Blog
            </Link>
          </div>
          <button
            type="button"
            onClick={() => {
              analytics.clickToCall("header");
              openDiagnostic();
            }}
            className="btn-zoom hidden items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-on-primary hover:bg-secondary md:inline-flex"
          >
            <Icon name="phone" className="h-4 w-4" filled />
            <span>Call</span>
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-xl bg-surface-variant px-3 text-sm font-bold text-on-surface transition-colors hover:bg-primary-container md:hidden"
          >
            <Icon name="menu" className="h-5 w-5" />
            {menuOpen ? "Close" : "Menu"}
          </button>
        </nav>

        {menuOpen && (
          <div
            id="mobile-menu"
            className="absolute inset-x-0 top-full mt-2 max-h-[calc(100dvh-6rem)] overflow-y-auto rounded-2xl border border-outline-variant bg-background p-2 shadow-lg shadow-black/10 md:hidden"
          >
            <p className="px-4 pb-1 pt-2 text-sm font-bold uppercase tracking-wide text-primary">
              Services
            </p>
            <ul>
              {nav.map((n) => (
                <MobileLink
                  key={n.href}
                  href={n.href}
                  label={n.label}
                  active={isActive(pathname, n.href)}
                  onNavigate={() => setMenuOpen(false)}
                />
              ))}
            </ul>
            <p className="mt-2 border-t border-outline-variant px-4 pb-1 pt-3 text-sm font-bold uppercase tracking-wide text-primary">
              More
            </p>
            <ul>
              {secondaryNav.map((n) => (
                <MobileLink
                  key={n.href}
                  href={n.href}
                  label={n.label}
                  active={isActive(pathname, n.href)}
                  onNavigate={() => setMenuOpen(false)}
                />
              ))}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}

function MobileLink({
  href,
  label,
  active,
  onNavigate,
}: {
  href: string;
  label: string;
  active: boolean;
  onNavigate: () => void;
}) {
  return (
    <li>
      <Link
        href={href}
        onClick={onNavigate}
        aria-current={active ? "page" : undefined}
        className={`flex min-h-12 items-center justify-between rounded-xl px-4 text-base transition-colors ${
          active
            ? "bg-primary-container font-bold text-primary"
            : "font-semibold text-on-surface hover:bg-surface-variant"
        }`}
      >
        {label}
        <Icon
          name="chevron"
          className={`h-4 w-4 ${active ? "text-primary" : "text-muted"}`}
        />
      </Link>
    </li>
  );
}
