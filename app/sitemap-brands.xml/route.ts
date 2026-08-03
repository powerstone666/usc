import { NextResponse } from "next/server";
import { brands } from "@/app/(config)/content";
import { services, site } from "@/app/(config)/site";
import { slugify } from "@/app/(common-lib)/slugify";
import { url, buildSitemap } from "@/app/(config)/sitemap-helpers";

export function GET() {
  const now = new Date().toISOString();
  const base = site.url;

  const urls = [
    ...brands.map((b) =>
      url(`${base}/brands/${slugify(b)}`, now, "monthly", "0.6"),
    ),
    ...brands.flatMap((brand) =>
      services.map((service) =>
        url(`${base}/brands/${slugify(brand)}/${service.slug}`, now, "monthly", "0.5"),
      ),
    ),
  ];

  return new NextResponse(buildSitemap(urls), {
    headers: { "Content-Type": "application/xml" },
  });
}
