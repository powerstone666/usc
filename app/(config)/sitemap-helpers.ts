import { site } from "@/app/(config)/site";

function xmlEscape(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function url(loc: string, lastmod: string = site.contentUpdated) {
  let xml = "<url>";
  xml += `<loc>${xmlEscape(loc)}</loc>`;
  if (lastmod) xml += `<lastmod>${lastmod}</lastmod>`;
  xml += "</url>";
  return xml;
}

function buildSitemap(urls: string[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`;
}

export { url, buildSitemap };
