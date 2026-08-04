export const dynamic = "force-static";
export const revalidate = 86400;

import { NextResponse } from "next/server";
import { keywords } from "@/app/(config)/keywords";
import { site } from "@/app/(config)/site";
import { url, buildSitemap } from "@/app/(config)/sitemap-helpers";

export function GET() {
  const now = new Date().toISOString();
  const base = site.url;

  const urls = keywords.map((k) =>
    url(`${base}/keywords/${k.slug}`, now, "daily", "0.5"),
  );

  return new NextResponse(buildSitemap(urls), {
    headers: { "Content-Type": "application/xml" },
  });
}
