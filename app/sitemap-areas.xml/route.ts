import { NextResponse } from "next/server";
import { bangaloreAreas, services, site } from "@/app/(config)/site";
import { slugify } from "@/app/(common-lib)/slugify";
import { url, buildSitemap } from "@/app/(config)/sitemap-helpers";

export function GET() {
  const now = new Date().toISOString();
  const base = site.url;

  const urls = [
    ...bangaloreAreas.map((a) =>
      url(`${base}/areas/${slugify(a.name)}`, now, "monthly", "0.7"),
    ),
    ...bangaloreAreas.flatMap((area) =>
      services.map((service) =>
        url(`${base}/areas/${slugify(area.name)}/${service.slug}`, now, "monthly", "0.6"),
      ),
    ),
  ];

  return new NextResponse(buildSitemap(urls), {
    headers: { "Content-Type": "application/xml" },
  });
}
