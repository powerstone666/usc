import { NextResponse } from "next/server";
import { site } from "@/app/(config)/site";

export function GET() {
  const now = new Date().toISOString();
  const base = site.url;

  const sitemaps = [
    { loc: `${base}/sitemap-static.xml`, lastmod: now },
    { loc: `${base}/sitemap-services.xml`, lastmod: now },
    { loc: `${base}/sitemap-areas.xml`, lastmod: now },
    { loc: `${base}/sitemap-brands.xml`, lastmod: now },
    { loc: `${base}/sitemap-keywords.xml`, lastmod: now },
    { loc: `${base}/sitemap-blog.xml`, lastmod: now },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map((s) => `  <sitemap><loc>${s.loc}</loc><lastmod>${s.lastmod}</lastmod></sitemap>`).join("\n")}
</sitemapindex>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
