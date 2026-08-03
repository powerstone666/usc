export const dynamic = "force-static";
export const revalidate = 86400;

import { NextResponse } from "next/server";
import { services, site } from "@/app/(config)/site";
import { url, buildSitemap } from "@/app/(config)/sitemap-helpers";

export function GET() {
  const now = new Date().toISOString();
  const base = site.url;

  const urls = [
    ...services.map((s) =>
      url(`${base}/services/${s.slug}`, now, "weekly", "0.8"),
    ),
    ...services.map((s) =>
      url(`${base}/near-me/${s.slug}`, now, "monthly", "0.7"),
    ),
  ];

  return new NextResponse(buildSitemap(urls), {
    headers: { "Content-Type": "application/xml" },
  });
}
