export const dynamic = "force-static";
export const revalidate = 86400;

import { NextResponse } from "next/server";
import { brands } from "@/app/(config)/content";
import { site } from "@/app/(config)/site";
import { slugify } from "@/app/(common-lib)/slugify";
import { url, buildSitemap } from "@/app/(config)/sitemap-helpers";

const lowProfileBrands = new Set([
  "Mi",
  "AmazonBasics",
  "Videocon",
  "Onida",
  "Sansui",
  "Cello",
]);

export function GET() {
  const base = site.url;

  const activeBrands = brands.filter((b) => !lowProfileBrands.has(b));
  const urls = activeBrands.map((b) =>
    url(`${base}/brands/${slugify(b)}`),
  );

  return new NextResponse(buildSitemap(urls), {
    headers: { "Content-Type": "application/xml" },
  });
}
