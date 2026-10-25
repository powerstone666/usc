// Fixture tests for the admin analytics. Every expected number is worked out by hand from the
// rows below. Run: node scripts/test-admin-insights.mjs
import assert from "node:assert/strict";
import { buildAdminData, channelOf, fmtHour, leadTypeOf, pathOf } from "../app/(server-lib)/admin-insights.ts";

let n = 0;
const test = (name, fn) => { fn(); n++; console.log("PASS", name); };

const lead = (o) => ({ id: "lead_x", received_at: "2026-10-25T10:00:00Z", appliance: "microwave-repair", issue: "", name: "", phone: "", source: "diagnostic-popup", page_url: "https://urbanservicecompany.in/services/microwave-repair", ip_address: "49.1.1.1", city: "Bengaluru", device_type: "mobile", session_id: "s1", fingerprint: "fpA", referrer: "", traffic_category: "direct", traffic_source: "", traffic_medium: "", traffic_campaign: "", gclid: "", ...o });
const view = (o) => ({ view_id: "v", received_at: "2026-10-25T10:00:00Z", session_id: "s1", page_url: "https://urbanservicecompany.in/", page_path: "/", referrer: "", ip_address: "49.1.1.1", city: "Bengaluru", device_type: "mobile", os: "Android", browser: "Chrome", traffic_category: "direct", traffic_source: "", traffic_medium: "", fingerprint: "fpA", ...o });
const NOW = new Date("2026-10-26T06:00:00Z"); // 11:30 IST on 26 Oct

// ---- fixtures
const views = [
  view({ fingerprint: "fpA", session_id: "s1", received_at: "2026-10-25T10:00:00Z" }),
  view({ fingerprint: "fpA", session_id: "s2", received_at: "2026-10-26T04:00:00Z", page_path: "/services/ac-repair" }), // same visitor, 2nd session -> returning
  view({ fingerprint: "fpB", session_id: "s3", traffic_category: "organic-search", referrer: "https://www.google.com/", received_at: "2026-10-25T11:00:00Z" }),
  view({ fingerprint: "fpC", session_id: "s4", traffic_category: "utm", traffic_source: "facebook", traffic_medium: "paid", traffic_campaign: "diwali", device_type: "desktop", received_at: "2026-10-25T12:00:00Z" }),
  view({ fingerprint: "fpD", session_id: "s5", traffic_category: "utm", traffic_source: "chatgpt.com", traffic_medium: "referral", received_at: "2026-10-25T12:30:00Z" }),
  view({ fingerprint: "fpT", session_id: "s6", page_url: "http://localhost:3100/", received_at: "2026-10-25T12:00:00Z" }), // test traffic
];
const leads = [
  lead({ id: "lead_1", fingerprint: "fpA", received_at: "2026-10-25T14:00:00Z", page_url: "https://urbanservicecompany.in/areas/hsr-layout", appliance: "ac-repair" }), // 19:30 IST
  lead({ id: "call_1", fingerprint: "fpB", session_id: "s3", source: "call-now", received_at: "2026-10-25T19:00:00Z", traffic_category: "organic-search", referrer: "https://www.google.com/" }), // 00:30 IST on 26th
  lead({ id: "wa_1", fingerprint: "fpC", session_id: "s4", source: "whatsapp-now", received_at: "2026-10-25T12:30:00Z", traffic_category: "utm", traffic_source: "facebook", traffic_medium: "paid", traffic_campaign: "diwali", device_type: "desktop" }),
  lead({ id: "lead_junk", source: "click_to_call:header", fingerprint: "fpX" }), // legacy junk, not a lead
  lead({ id: "lead_test", fingerprint: "fpT", page_url: "http://localhost:3100/contact" }), // test traffic
];
const base = { leads, views, now: NOW, areaNames: ["HSR Layout", "Indiranagar"] };

test("lead types and junk/test filtering", () => {
  const d = buildAdminData({ ...base, range: "all" });
  assert.equal(d.totals.leads, 3);
  assert.deepEqual([d.totals.formLeads, d.totals.callTaps, d.totals.whatsappTaps], [1, 1, 1]);
  assert.equal(d.hiddenTestRows, 2); // 1 test view + 1 test lead; legacy junk is dropped silently
  assert.equal(buildAdminData({ ...base, range: "all", includeTest: true }).totals.leads, 4);
});

test("unique visitors, sessions and returning", () => {
  const d = buildAdminData({ ...base, range: "all" });
  assert.equal(d.totals.visitors, 4); // fpA fpB fpC fpD (fpT hidden, fpX junk)
  assert.equal(d.totals.returningVisitors, 1); // fpA has s1 + s2
  const a = d.visitors.find((v) => v.sessions === 2);
  assert.equal(a.leads, 1);
  assert.equal(a.lastPage, "/services/ac-repair");
  assert.equal(a.lastActive, "2026-10-26T04:00:00Z"); // latest of views/leads
  assert.equal(d.visitors[0].lastActive, "2026-10-26T04:00:00Z"); // sorted by last active
});

test("conversion is visitor-level and never above 100%", () => {
  const d = buildAdminData({ ...base, range: "all" });
  assert.equal(d.totals.convertedVisitors, 3); // fpA fpB fpC
  assert.equal(d.totals.conversionPct, 75);
  for (const c of d.channels) assert.ok(c.conversionPct <= 100);
});

test("channel attribution (utm, ai, search, direct)", () => {
  const d = buildAdminData({ ...base, range: "all" });
  const byLabel = Object.fromEntries(d.channels.map((c) => [c.label, c]));
  assert.ok(byLabel["facebook (paid)"], "paid utm source labelled");
  assert.ok(byLabel["ChatGPT (AI search)"], "chatgpt utm recognised as AI search");
  assert.equal(byLabel["Google search"].leads, 1);
  assert.equal(byLabel["Google search"].conversionPct, 100);
  assert.equal(byLabel["Direct"].leads, 1); // fpA's form lead
  assert.equal(channelOf({ gclid: "abc" }).label, "Google Ads");
});

test("campaign table only lists tagged traffic", () => {
  const d = buildAdminData({ ...base, range: "all" });
  assert.equal(d.campaigns.length, 2); // facebook/paid/diwali and chatgpt.com/referral/(not set)
  const fb = d.campaigns.find((c) => c.campaign === "diwali");
  assert.deepEqual([fb.source, fb.medium, fb.visitors, fb.leads, fb.conversionPct], ["facebook", "paid", 1, 1, 100]);
});

test("IST bucketing (hour and day roll over at 18:30 UTC)", () => {
  const d = buildAdminData({ ...base, range: "all" });
  assert.equal(d.leadsByHour[19], 1); // 14:00Z = 19:30 IST
  assert.equal(d.leadsByHour[18], 1); // 12:30Z = 18:00 IST
  assert.equal(d.leadsByHour[0], 1); // 19:00Z = 00:30 IST next day
  const day25 = d.leadsByDay.find((x) => x.day === "2026-10-25");
  const day26 = d.leadsByDay.find((x) => x.day === "2026-10-26");
  assert.deepEqual([day25.form, day25.whatsapp, day25.call], [1, 1, 0]);
  assert.deepEqual([day26.form, day26.whatsapp, day26.call], [0, 0, 1]);
});

test('"today" starts at IST midnight', () => {
  const d = buildAdminData({ ...base, range: "today" });
  assert.equal(d.since, "2026-10-25T18:30:00.000Z");
  assert.equal(d.totals.leads, 1); // only the 00:30 IST call tap
  assert.equal(d.leadsByDay.length, 1);
});

test("where leads come from: area page, service, source button", () => {
  const d = buildAdminData({ ...base, range: "all" });
  assert.deepEqual(d.leadAreas, [{ label: "HSR Layout", count: 1 }]);
  assert.equal(d.leadPages.find((p) => p.path === "/areas/hsr-layout").leads, 1);
  assert.equal(d.leadSources.find((r) => r.label === "Call button").count, 1);
  assert.equal(d.leadServices.find((r) => r.label === "AC").count, 1);
});

test("devices and mobile share", () => {
  const d = buildAdminData({ ...base, range: "all" });
  assert.equal(d.totals.mobilePct, 75); // fpA fpB fpD mobile, fpC desktop
});

test("plain-language insights", () => {
  const d = buildAdminData({ ...base, range: "all" });
  assert.equal(d.insights[0], "3 leads in all time: 1 from forms, 1 call tap, 1 WhatsApp tap.");
  assert.ok(d.insights.every((x) => x.length < 140));
});

test("helpers", () => {
  assert.equal(pathOf("https://x.in/areas/hsr-layout/"), "/areas/hsr-layout");
  assert.equal(pathOf(""), "(unknown)");
  assert.equal(fmtHour(19), "7 PM–8 PM");
  assert.equal(fmtHour(11), "11 AM–12 PM");
  assert.equal(fmtHour(23), "11 PM–12 AM");
  assert.equal(leadTypeOf({ id: "wa_1", source: "x" }), "whatsapp");
  assert.equal(leadTypeOf({ id: "call_1", source: "x" }), "call");
  assert.equal(leadTypeOf({ id: "lead_1", source: "diagnostic-popup" }), "form");
});

test("empty data does not crash and shows zeros", () => {
  const d = buildAdminData({ leads: [], views: [], range: "30d", now: NOW });
  assert.equal(d.totals.visitors, 0);
  assert.equal(d.totals.conversionPct, 0);
  assert.equal(d.insights.length, 0);
  assert.equal(d.leadsByDay.length, 30);
  assert.equal(d.channels.length, 0);
});

console.log(`\n${n} tests passed`);
