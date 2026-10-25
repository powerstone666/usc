export const dynamic = "force-static";
export const revalidate = 86400;

import { NextResponse } from "next/server";
import { bangaloreAreas, site } from "@/app/(config)/site";
import { slugify } from "@/app/(common-lib)/slugify";
import { url, buildSitemap } from "@/app/(config)/sitemap-helpers";

export function GET() {
  const base = site.url;

  const urls = bangaloreAreas.map((a) =>
    url(`${base}/areas/${slugify(a.name)}`),
  );

  return new NextResponse(buildSitemap(urls), {
    headers: { "Content-Type": "application/xml" },
  });
}
