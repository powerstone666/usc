export const revalidate = 3600;

import { NextResponse } from "next/server";
import { site } from "@/app/(config)/site";
import { url, buildSitemap } from "@/app/(config)/sitemap-helpers";
import { getApprovedTopics } from "@/app/(server-lib)/keyword-sync";

// Owner-approved keyword topics only. Separate from the main sitemaps.
export async function GET() {
  const topics = await getApprovedTopics();
  const urls = topics.length > 0 ? [url(`${site.url}/topics`), ...topics.map((t) => url(`${site.url}/topics/${t.slug}`, (t.reviewedAt ?? t.discoveredAt).slice(0, 10)))] : [];
  return new NextResponse(buildSitemap(urls), { headers: { "Content-Type": "application/xml" } });
}
