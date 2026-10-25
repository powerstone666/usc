import { NextResponse } from "next/server";
import { site } from "@/app/(config)/site";
import { getApprovedTopics } from "@/app/(server-lib)/keyword-sync";

export const revalidate = 3600;

export async function GET() {
  const base = site.url;

  const sitemaps = [
    `${base}/sitemap-static.xml`,
    `${base}/sitemap-services.xml`,
    `${base}/sitemap-areas.xml`,
    `${base}/sitemap-brands.xml`,
    `${base}/sitemap-keywords.xml`,
    `${base}/sitemap-blog.xml`,
  ];
  if ((await getApprovedTopics()).length > 0) sitemaps.push(`${base}/sitemap-topics.xml`);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map((loc) => `  <sitemap><loc>${loc}</loc><lastmod>${site.contentUpdated}</lastmod></sitemap>`).join("\n")}
</sitemapindex>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
