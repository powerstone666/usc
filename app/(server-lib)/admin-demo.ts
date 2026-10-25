// Deterministic sample data for previewing the admin when the database is empty.
// Enabled only with ADMIN_DEMO=1. Names and phone numbers are obviously fictional.
import type { LeadRow, PageViewRow } from "./supabase";

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Weighted<T> = [T, number][];

export function makeDemoData(now = new Date()): { leads: LeadRow[]; views: PageViewRow[] } {
  const rand = rng(20261025);
  const pick = <T,>(items: Weighted<T>): T => {
    const total = items.reduce((s, [, w]) => s + w, 0);
    let x = rand() * total;
    for (const [v, w] of items) if ((x -= w) <= 0) return v;
    return items[items.length - 1][0];
  };
  const hex = (n: number) => Array.from({ length: n }, () => Math.floor(rand() * 16).toString(16)).join("");

  type Ch = { referrer: string; category: string; source: string; medium: string; campaign: string; gclid: string; leadRate: number };
  const channels: Weighted<Ch> = [
    [{ referrer: "https://www.google.com/", category: "organic-search", source: "google", medium: "organic", campaign: "", gclid: "", leadRate: 0.07 }, 34],
    [{ referrer: "", category: "direct", source: "", medium: "none", campaign: "", gclid: "", leadRate: 0.05 }, 20],
    [{ referrer: "https://www.google.com/", category: "utm", source: "google", medium: "cpc", campaign: "microwave-search", gclid: "demo", leadRate: 0.14 }, 14],
    [{ referrer: "https://l.facebook.com/", category: "utm", source: "facebook", medium: "paid", campaign: "diwali-offer", gclid: "", leadRate: 0.04 }, 10],
    [{ referrer: "https://chatgpt.com/", category: "utm", source: "chatgpt.com", medium: "referral", campaign: "", gclid: "", leadRate: 0.1 }, 6],
    [{ referrer: "https://maps.google.com/", category: "google-maps", source: "google_maps", medium: "local", campaign: "", gclid: "", leadRate: 0.11 }, 7],
    [{ referrer: "https://wa.me/", category: "whatsapp", source: "whatsapp", medium: "social", campaign: "", gclid: "", leadRate: 0.09 }, 5],
    [{ referrer: "https://www.instagram.com/", category: "social", source: "instagram", medium: "social", campaign: "", gclid: "", leadRate: 0.02 }, 4],
  ];
  const paths: Weighted<string> = [
    ["/", 16], ["/services/microwave-repair", 20], ["/services/ac-repair", 11], ["/services/washing-machine-repair", 7],
    ["/services/refrigerator-repair", 5], ["/areas/indiranagar", 6], ["/areas/hsr-layout", 5], ["/areas/whitefield", 5],
    ["/brands/samsung", 4], ["/blog/microwave-repair-bengaluru-complete-guide", 6], ["/keywords/microwave-not-heating", 7], ["/coverage", 3], ["/reviews", 3],
  ];
  const cities: Weighted<string> = [["Bengaluru", 84], ["Mysuru", 4], ["Hosur", 3], ["Chennai", 3], ["Hyderabad", 3], ["Mumbai", 3]];
  type Dev = { type: string; vendor: string; model: string; os: string; browser: string };
  const devices: Weighted<Dev> = [
    [{ type: "mobile", vendor: "Samsung", model: "SM-S911B", os: "Android", browser: "Chrome" }, 22],
    [{ type: "mobile", vendor: "Xiaomi", model: "Redmi Note 12", os: "Android", browser: "Chrome" }, 18],
    [{ type: "mobile", vendor: "Apple", model: "iPhone", os: "iOS", browser: "Safari" }, 14],
    [{ type: "mobile", vendor: "Realme", model: "RMX3511", os: "Android", browser: "Chrome" }, 10],
    [{ type: "desktop", vendor: "", model: "", os: "Windows", browser: "Chrome" }, 24],
    [{ type: "desktop", vendor: "Apple", model: "Macintosh", os: "macOS", browser: "Safari" }, 8],
    [{ type: "tablet", vendor: "Apple", model: "iPad", os: "iOS", browser: "Safari" }, 4],
  ];
  const hours: Weighted<number> = [[9, 3], [10, 5], [11, 8], [12, 9], [13, 6], [14, 4], [15, 4], [16, 5], [17, 7], [18, 10], [19, 12], [20, 9], [21, 4], [22, 2], [8, 2]];
  const appliances: Weighted<string> = [["microwave-repair", 40], ["ac-repair", 24], ["washing-machine-repair", 16], ["refrigerator-repair", 12], ["water-filter-repair", 5], ["chimney-repair", 3]];
  const issues: Record<string, string[]> = {
    "microwave-repair": ["Microwave not heating", "Sparking inside", "Turntable not rotating"],
    "ac-repair": ["AC not cooling", "Water leakage", "Gas refill needed"],
    "washing-machine-repair": ["Not draining", "Noisy drum"],
    "refrigerator-repair": ["Not cooling", "Frost build-up"],
    "water-filter-repair": ["Not purifying"],
    "chimney-repair": ["Low suction power"],
  };

  const IST = 5.5 * 3600 * 1000;
  const stamp = (daysAgo: number, hour: number) => {
    const d = new Date(now.getTime() - daysAgo * 86400000 + IST);
    d.setUTCHours(hour, Math.floor(rand() * 60), Math.floor(rand() * 60), 0);
    const t = d.getTime() - IST;
    return new Date(Math.min(t, now.getTime() - 60000)).toISOString();
  };

  const views: PageViewRow[] = [];
  const leads: LeadRow[] = [];
  let leadSeq = 0;

  for (let i = 0; i < 360; i++) {
    const ch = pick(channels);
    const dev = pick(devices);
    const city = pick(cities);
    const fp = hex(16);
    const sessions = rand() < 0.18 ? 2 + Math.floor(rand() * 2) : 1;
    const base = { traffic_source: ch.source, traffic_medium: ch.medium, traffic_category: ch.category, traffic_campaign: ch.campaign, gclid: ch.gclid };
    for (let s = 0; s < sessions; s++) {
      const day = Math.floor(Math.pow(rand(), 1.15) * 30);
      const sid = `s_${hex(8)}`;
      const t0 = stamp(day, pick(hours));
      const pageCount = 1 + Math.floor(rand() * 4);
      let lastPath = "/";
      for (let p = 0; p < pageCount; p++) {
        lastPath = pick(paths);
        const at = new Date(new Date(t0).getTime() + p * 45000).toISOString();
        views.push({
          view_id: `v_${hex(10)}`, received_at: at, session_id: sid, page_url: `https://urbanservicecompany.in${lastPath}`, page_path: lastPath,
          page_title: "", referrer: p === 0 ? ch.referrer : "", ip_address: `49.37.${Math.floor(rand() * 255)}.${Math.floor(rand() * 255)}`, city, region: "Karnataka", country: "India",
          isp: "", browser: dev.browser, os: dev.os, device_type: dev.type, screen_resolution: "", language: "en-IN",
          traffic_source: base.traffic_source, traffic_medium: base.traffic_medium, traffic_category: base.traffic_category, time_on_page: 20 + Math.floor(rand() * 140), fingerprint: fp,
        });
      }
      if (s === 0 && rand() < ch.leadRate * 1.15) {
        const appliance = pick(appliances);
        const r = rand();
        const type = r < 0.36 ? "form" : r < 0.78 ? "call" : "whatsapp";
        leadSeq++;
        const at = new Date(new Date(t0).getTime() + pageCount * 45000 + 30000).toISOString();
        leads.push({
          id: `${type === "form" ? "lead" : type === "call" ? "call" : "wa"}_demo${leadSeq}`, received_at: at, appliance,
          issue: type === "form" ? issues[appliance][Math.floor(rand() * issues[appliance].length)] : type === "call" ? "Direct Phone Call" : "WhatsApp Inquiry",
          name: type === "form" ? `Demo Customer ${leadSeq}` : "", phone: type === "form" ? `900000${String(1000 + leadSeq).slice(-4)}` : "", phone_hash: "", phone_last4: type === "form" ? String(1000 + leadSeq).slice(-4) : "",
          source: type === "form" ? pick<string>([["diagnostic-popup", 6], ["wm-repair-page", 1], ["area-indiranagar", 1]]) : type === "call" ? "call-now" : "whatsapp-now",
          page_url: `https://urbanservicecompany.in${lastPath}`, user_agent: "", ip_address: "49.37.1.1", city, region: "Karnataka", country: "India", isp: "", asn: "",
          browser: dev.browser, browser_version: "", os: dev.os, os_version: "", device_type: dev.type, device_model: dev.model, device_vendor: dev.vendor,
          session_id: sid, time_on_page: 60 + Math.floor(rand() * 200), screen_resolution: "", viewport: "", language: "en-IN", referrer: ch.referrer,
          traffic_source: base.traffic_source, traffic_medium: base.traffic_medium, traffic_category: base.traffic_category, traffic_campaign: base.traffic_campaign, gclid: base.gclid, fingerprint: fp,
        });
      }
    }
  }
  return { leads, views };
}
