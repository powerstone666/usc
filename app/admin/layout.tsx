export const dynamic = "force-dynamic";

import Link from "next/link";

const navItems = [
  { href: "/admin", label: "Overview", icon: "M3 3h7v7H3V3zm11 0h7v7h-7V3zM3 14h7v7H3v-7zm11 0h7v7h-7v-7z" },
  { href: "/admin/leads", label: "Leads", icon: "M3 5h18M3 12h18M3 19h18" },
  { href: "/admin/sources", label: "Sources", icon: "M9 19l-7-7 7-7M3 12h18" },
  { href: "/admin/traffic", label: "Traffic", icon: "M3 3v18h18M7 16l4-4 4 4 6-6" },
  { href: "/admin/geo", label: "Geo & Device", icon: "M12 2a10 10 0 100 20 10 10 0 000-20zM2 12h20M12 2a15 15 0 010 20M12 2a15 15 0 000 20" },
  { href: "/admin/test", label: "Test", icon: "M22 12h-4l-3 9L9 3l-3 9H2" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0a1929] text-white">
      <div className="flex min-h-screen flex-col md:flex-row">
        <aside className="sticky top-0 z-30 shrink-0 border-b border-white/10 bg-[#0d2843] p-3 md:w-60 md:border-b-0 md:border-r md:p-4">
          <div className="flex items-center justify-between md:block">
            <Link href="/admin" className="block">
              <p className="text-sm font-extrabold text-white">USC Admin</p>
              <p className="text-[10px] text-white/40">Analytics Dashboard</p>
            </Link>
          </div>
          <nav className="mt-3 flex gap-1 overflow-x-auto md:mt-0 md:flex-col md:gap-1 md:overflow-visible">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white md:shrink-auto md:text-sm md:py-2.5"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={item.icon} />
                </svg>
                <span className="hidden sm:inline md:inline">{item.label}</span>
              </Link>
            ))}
          </nav>
          <div className="mt-3 hidden border-t border-white/10 pt-3 md:mt-auto md:block md:pt-8">
            <form action="/api/admin/logout" method="POST">
              <button
                type="submit"
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
                </svg>
                Logout
              </button>
            </form>
            <Link
              href="/"
              className="mt-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
              View Site
            </Link>
          </div>
        </aside>
        <main className="flex-1 overflow-x-auto p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
