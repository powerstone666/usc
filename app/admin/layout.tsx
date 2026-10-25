export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { AdminShell } from "./_ui/admin-shell";

export const metadata: Metadata = {
  title: { absolute: "USC Admin" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
