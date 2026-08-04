import { NextResponse } from "next/server";

const SEARCH_DOMAINS = ["google.com", "bing.com", "yahoo.com", "duckduckgo.com"];
const SOCIAL_DOMAINS = ["facebook.com", "instagram.com", "twitter.com", "linkedin.com", "youtube.com"];
const PPC_DOMAINS = ["g.doubleclick.net", "googleads"];

function detectFromUrl(url: string, referrer: string): { category: string; source: string; medium: string } {
  try {
    const params = new URL(url).searchParams;
    const utmSource = params.get("utm_source");
    const utmMedium = params.get("utm_medium");
    const gclid = params.get("gclid");

    if (gclid) return { category: "ppc", source: "google", medium: "ppc" };
    if (utmSource && utmMedium) return { category: "utm", source: utmSource, medium: utmMedium };

    if (!referrer) return { category: "direct", source: "", medium: "" };

    let refHost = "";
    try { refHost = new URL(referrer).hostname.replace(/^www\./, ""); } catch { refHost = referrer; }

    if (SEARCH_DOMAINS.some((d) => refHost.includes(d))) return { category: "organic-search", source: refHost, medium: "organic" };
    if (refHost.includes("whatsapp.com") || refHost.includes("wa.me")) return { category: "whatsapp", source: "whatsapp", medium: "social" };
    if (SOCIAL_DOMAINS.some((d) => refHost.includes(d))) return { category: "social", source: refHost, medium: "social" };
    if (PPC_DOMAINS.some((d) => refHost.includes(d))) return { category: "ppc", source: "google", medium: "ppc" };

    return { category: "referral", source: refHost, medium: "referral" };
  } catch {
    return { category: "error", source: "", medium: "" };
  }
}

export async function GET() {
  const testCases = [
    { url: "https://urbanservicecompany.in/?utm_source=google&utm_medium=ppc&utm_campaign=microwave_repair", ref: "", expect: "utm" },
    { url: "https://urbanservicecompany.in/?gclid=Cj0KCQjwabc123", ref: "", expect: "ppc" },
    { url: "https://urbanservicecompany.in/services/ac-repair", ref: "", expect: "direct" },
    { url: "https://urbanservicecompany.in/", ref: "https://www.google.com/search?q=ac+repair+bengaluru", expect: "organic-search" },
    { url: "https://urbanservicecompany.in/", ref: "https://www.facebook.com/", expect: "social" },
    { url: "https://urbanservicecompany.in/", ref: "https://wa.me/919019349170", expect: "whatsapp" },
    { url: "https://urbanservicecompany.in/", ref: "https://g.doubleclick.net/pcs/click", expect: "ppc" },
    { url: "https://urbanservicecompany.in/", ref: "https://urbancompany.com/", expect: "referral" },
  ];

  let allPass = true;
  const results = testCases.map((t) => {
    const result = detectFromUrl(t.url, t.ref);
    const pass = result.category === t.expect;
    if (!pass) allPass = false;
    return { input: `${t.expect} → ${t.ref || "(direct)"}`, detected: result.category, source: result.source, medium: result.medium, pass };
  });

  return NextResponse.json({
    ok: allPass,
    detail: allPass
      ? `All ${results.length} source detection tests passed`
      : `${results.filter((r) => !r.pass).length}/${results.length} tests failed`,
    results,
  });
}
