import type { MetadataRoute } from "next";
import { site } from "@/app/(config)/site";

const AI_SEARCH_BOTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "Google-Extended",
  "Googlebot",
  "PerplexityBot",
  "ClaudeBot",
  "anthropic-ai",
  "Applebot",
  "Applebot-Extended",
  "Bingbot",
  "Bytespider",
  "Cohere-ai",
  "Meta-ExternalAgent",
  "FacebookBot",
  "Amazonbot",
  "DuckDuckBot",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api"],
      },
      {
        userAgent: AI_SEARCH_BOTS,
        allow: "/",
        disallow: ["/admin", "/api"],
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
