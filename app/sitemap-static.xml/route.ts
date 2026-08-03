export const dynamic = "force-static";
export const revalidate = 86400;

import { NextResponse } from "next/server";
import { site } from "@/app/(config)/site";
import { url, buildSitemap } from "@/app/(config)/sitemap-helpers";

export function GET() {
  const now = new Date().toISOString();
  const base = site.url;

  const urls = [
    url(`${base}/`, now, "monthly", "1"),
    url(`${base}/about`, now, "monthly", "0.5"),
    url(`${base}/contact`, now, "monthly", "0.5"),
    url(`${base}/coverage`, now, "monthly", "0.5"),
    url(`${base}/reviews`, now, "monthly", "0.5"),
    url(`${base}/blog`, now, "monthly", "0.5"),
    url(`${base}/terms`, now, "monthly", "0.3"),
    url(`${base}/privacy`, now, "monthly", "0.3"),
  ];

  return new NextResponse(buildSitemap(urls), {
    headers: { "Content-Type": "application/xml" },
  });
}
