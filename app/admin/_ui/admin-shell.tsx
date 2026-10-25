"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const NAV: { href: string; label: string; exact?: boolean; also?: string[] }[] = [
  { href: "/admin", label: "Overview", exact: true },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/traffic", label: "Traffic" },
  { href: "/admin/visitors", label: "Visitors" },
  { href: "/admin/settings", label: "Settings", also: ["/admin/keywords"] },
];

function LogoutButton({ className }: { className: string }) {
  return (
    <form action="/api/admin/logout" method="POST">
      <button type="submit" className={className}>
        Log out
      </button>
    </form>
  );
}

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin/login")) return <>{children}</>;

  const isActive = (item: (typeof NAV)[number]) =>
    item.exact ? pathname === item.href : [item.href, ...(item.also ?? [])].some((h) => pathname === h || pathname.startsWith(`${h}/`));

  return (
    <div className="min-h-screen bg-surface-variant/50 text-on-surface">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col border-r border-outline-variant bg-surface p-4 md:flex">
        <Link href="/admin" className="block rounded-xl px-3 py-2">
          <p className="text-lg font-extrabold text-primary">USC Admin</p>
          <p className="text-sm text-muted">Leads &amp; traffic</p>
        </Link>
        <nav aria-label="Admin" className="mt-4 flex flex-col gap-1">
          {NAV.map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-11 items-center rounded-xl px-3 text-base font-semibold transition-colors ${
                  active ? "bg-primary-container text-primary" : "text-on-surface-variant hover:bg-surface-variant hover:text-on-surface"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto flex flex-col gap-1 border-t border-outline-variant pt-3">
          <Link href="/" className="flex min-h-11 items-center rounded-xl px-3 text-base font-semibold text-on-surface-variant hover:bg-surface-variant">
            View site
          </Link>
          <LogoutButton className="flex min-h-11 w-full items-center rounded-xl px-3 text-left text-base font-semibold text-on-surface-variant hover:bg-surface-variant" />
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-outline-variant bg-surface px-4 py-2.5 md:hidden">
        <Link href="/admin" className="text-lg font-extrabold text-primary">USC Admin</Link>
        <LogoutButton className="min-h-10 rounded-lg px-3 text-sm font-bold text-on-surface-variant hover:bg-surface-variant" />
      </header>

      <main className="px-4 pb-28 pt-5 md:ml-60 md:px-8 md:pb-12 md:pt-8">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>

      {/* Mobile bottom tabs */}
      <nav aria-label="Admin" className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-outline-variant bg-surface pb-[env(safe-area-inset-bottom)] md:hidden">
        {NAV.map((item) => {
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex min-h-14 flex-col items-center justify-center gap-0.5 text-sm font-semibold transition-colors ${active ? "text-primary" : "text-on-surface-variant"}`}
            >
              <span className={`h-1 w-8 rounded-full ${active ? "bg-primary" : "bg-transparent"}`} aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
