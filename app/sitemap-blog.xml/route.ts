export const dynamic = "force-static";
export const revalidate = 86400;

import { NextResponse } from "next/server";
import { blogPosts } from "@/app/(config)/blog";
import { site } from "@/app/(config)/site";
import { url, buildSitemap } from "@/app/(config)/sitemap-helpers";

export function GET() {
  const base = site.url;

  const urls = blogPosts.map((post) =>
    url(`${base}/blog/${post.slug}`, new Date(post.date).toISOString(), "daily", "0.5"),
  );

  return new NextResponse(buildSitemap(urls), {
    headers: { "Content-Type": "application/xml" },
  });
}
