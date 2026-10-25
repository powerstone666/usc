export const dynamic = "force-static";
export const revalidate = 86400;

import { NextResponse } from "next/server";
import { site } from "@/app/(config)/site";
import { url, buildSitemap } from "@/app/(config)/sitemap-helpers";

export function GET() {
  const base = site.url;

  const urls = [
    url(`${base}/`),
    url(`${base}/about`),
    url(`${base}/contact`),
    url(`${base}/coverage`),
    url(`${base}/reviews`),
    url(`${base}/urban-company-alternative`),
    url(`${base}/blog`),
    url(`${base}/terms`),
    url(`${base}/privacy`),
  ];

  return new NextResponse(buildSitemap(urls), {
    headers: { "Content-Type": "application/xml" },
  });
}
