// AEO/GEO scorecard. Crawls the sitemap of a running site and scores every indexable page
// against an explicit rubric (answer-first content, Q&A, entity + article schema, freshness,
// AI-crawler access, llms.txt). It measures what is machine-checkable; it cannot promise citations.
// Usage: node scripts/check-aeo-geo.mjs [baseUrl]   (default http://localhost:3000)
// "Owner input" items are reported separately and never faked (real profiles, real reviews).

const BASE = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const AI_BOTS = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "PerplexityBot", "ClaudeBot", "Google-Extended", "Applebot-Extended", "CCBot"];

const get = async (path) => {
  const res = await fetch(path.startsWith("http") ? path : BASE + path, { redirect: "follow" });
  return { status: res.status, text: await res.text() };
};
const decode = (s) => s.replace(/&amp;/g, "&").replace(/&#x27;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const words = (s) => (s.match(/[A-Za-z0-9₹][\w'’₹.-]*/g) ?? []).length;

function parse(html) {
  const ld = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  const blocks = [];
  let invalid = 0;
  for (const raw of ld) {
    try {
      const j = JSON.parse(raw);
      for (const n of Array.isArray(j) ? j : j["@graph"] ?? [j]) blocks.push(n);
    } catch {
      invalid++;
    }
  }
  const noScript = html.replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<style[\s\S]*?<\/style>/g, " ");
  const text = decode(noScript.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
  const main = (noScript.match(/<main[\s\S]*?<\/main>/) ?? [noScript])[0];
  const mainText = decode(main.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
  const heads = [...main.matchAll(/<h([1-6])[\s>]/g)].map((m) => +m[1]);
  const answer = main.match(/<[^>]*data-answer-block[^>]*>([\s\S]*?)<\/(?:p|div|section)>/);
  return {
    html, blocks, invalid, text, mainText, heads,
    title: decode((html.match(/<title[^>]*>([\s\S]*?)<\/title>/) ?? [])[1] ?? ""),
    desc: decode((html.match(/<meta name="description" content="([^"]*)"/) ?? [])[1] ?? ""),
    canonical: (html.match(/<link rel="canonical" href="([^"]*)"/) ?? [])[1] ?? "",
    noindex: /<meta name="robots" content="[^"]*noindex/.test(html),
    imgsMissingAlt: [...html.matchAll(/<img\b[^>]*>/g)].filter((m) => !/\salt=/.test(m[0])).length,
    answerWords: answer ? words(decode(answer[1].replace(/<[^>]+>/g, " "))) : 0,
    hasAnswer: Boolean(answer),
    questions: [...main.matchAll(/<(?:summary|h3|button)[^>]*>([\s\S]*?)<\/(?:summary|h3|button)>/g)].map((m) => decode(m[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim())).filter((t) => t.endsWith("?")),
  };
}
const types = (p) => p.blocks.flatMap((b) => [b["@type"]].flat()).filter(Boolean);
const find = (p, t) => p.blocks.find((b) => [b["@type"]].flat().includes(t));
const hasAny = (p, list) => list.some((t) => types(p).includes(t));

function kind(path) {
  if (path === "/") return "home";
  if (path === "/blog") return "blogindex";
  if (path.startsWith("/blog/")) return "post";
  const first = path.split("/")[1];
  if (["services", "areas", "brands", "keywords", "near-me"].includes(first)) return first === "services" ? "service" : "local";
  if (["about", "contact", "coverage", "reviews"].includes(first)) return first;
  return "utility";
}

// [id, appliesTo(kind) , test(page, path) -> true | string(reason)]
const ENTITY = {
  home: ["Organization", "LocalBusiness", "HomeAndConstructionBusiness"], service: ["Service", "LocalBusiness"], local: ["Service", "LocalBusiness", "HomeAndConstructionBusiness"],
  post: ["BlogPosting", "Article"], about: ["AboutPage", "Organization", "LocalBusiness"], contact: ["ContactPage", "LocalBusiness", "Organization"],
  coverage: ["WebPage", "CollectionPage", "LocalBusiness", "Service"], reviews: ["LocalBusiness", "Organization", "WebPage"], blogindex: ["Blog", "CollectionPage", "WebPage"],
};
const content = ["home", "service", "local", "post", "about", "coverage", "contact", "reviews", "blogindex"];
const faqKinds = ["home", "service", "local", "post"];
const PAGE_CHECKS = [
  ["title", content.concat("utility"), (p) => (p.title.length >= 25 && p.title.length <= 75) || `title length ${p.title.length}`],
  ["description", content.concat("utility"), (p) => (p.desc.length >= 80 && p.desc.length <= 175) || `description length ${p.desc.length}`],
  ["canonical", content.concat("utility"), (p, path) => p.canonical.replace(BASE, "").replace(/^https?:\/\/[^/]+/, "").replace(/\/$/, "") === path.replace(/\/$/, "") || `canonical=${p.canonical}`],
  ["single-h1", content.concat("utility"), (p) => p.heads.filter((h) => h === 1).length === 1 || `${p.heads.filter((h) => h === 1).length} h1`],
  ["heading-order", content, (p) => (p.heads.filter((h) => h === 2).length >= 2 && p.heads.every((h, i) => i === 0 || h <= p.heads[i - 1] + 1)) || "fewer than 2 h2 or skipped level"],
  ["jsonld-valid", content, (p) => (p.invalid === 0 && p.blocks.length > 0) || `${p.invalid} invalid / ${p.blocks.length} blocks`],
  ["entity-schema", content, (p, path) => hasAny(p, ENTITY[kind(path)]) || `needs one of ${ENTITY[kind(path)].join("/")}`],
  ["breadcrumb", content.filter((k) => k !== "home"), (p) => hasAny(p, ["BreadcrumbList"]) || "no BreadcrumbList"],
  ["article-fields", ["post"], (p) => {
    const a = find(p, "BlogPosting") ?? find(p, "Article");
    const miss = ["headline", "datePublished", "dateModified", "image", "publisher", "author"].filter((f) => !a?.[f]);
    return miss.length === 0 || `missing ${miss.join(",")}`;
  }],
  ["answer-first", content.filter((k) => !["contact", "reviews", "blogindex"].includes(k)), (p) => (p.hasAnswer && p.answerWords >= 20 && p.answerWords <= 80) || (p.hasAnswer ? `answer block ${p.answerWords} words` : "no [data-answer-block]")],
  ["speakable", content.filter((k) => !["contact", "reviews", "blogindex"].includes(k)), (p) => p.blocks.some((b) => b.speakable) || "no speakable markup"],
  ["faq-visible", faqKinds, (p) => p.questions.length >= 4 || `${p.questions.length} visible Q&As`],
  ["faq-schema", faqKinds, (p) => {
    const f = find(p, "FAQPage");
    if (!f) return "no FAQPage";
    const names = (f.mainEntity ?? []).map((q) => q.name);
    const lost = names.filter((n) => !p.mainText.includes(n.slice(0, 40)));
    return (names.length >= 4 && lost.length === 0) || `${names.length} schema Qs, ${lost.length} not visible`;
  }],
  ["freshness", content.filter((k) => !["contact", "blogindex"].includes(k)), (p) => (/(Last updated|Updated)\s*:?\s*\d{1,2}\s\w{3,9}\s\d{4}|(Last updated|Updated)\s*:?\s*\w{3,9}\s\d{4}/.test(p.mainText) && p.blocks.some((b) => b.dateModified)) || "needs visible 'Last updated' + dateModified"],
  ["depth", ["home", "service", "local", "post", "about", "coverage"], (p, path) => { const min = kind(path) === "post" ? 1200 : kind(path) === "local" ? 350 : 450; return p.mainText.split(" ").length >= min || `${words(p.mainText)} words < ${min}`; }],
  ["server-rendered", content, (p) => words(p.mainText) >= 120 || `${words(p.mainText)} words in raw HTML`],
  ["image-alt", content, (p) => p.imgsMissingAlt === 0 || `${p.imgsMissingAlt} img without alt`],
  ["nap", content, (p) => (p.text.includes("9019349170") || /9019349170/.test(p.html)) && /Urban Service Company/.test(p.text) || "business name/phone not visible"],
];

async function main() {
  const results = [];
  const owner = [];
  const note = (id, ok, detail, scope = "site") => results.push({ id, ok: ok === true, detail: ok === true ? "" : ok, scope, urls: [] });

  // ---- site-level
  const robots = await get("/robots.txt");
  const rTxt = robots.text;
  const blocked = /^\s*disallow:\s*\/\s*$/im.test(rTxt);
  note("robots-ai-crawlers", robots.status === 200 && !blocked && AI_BOTS.every((b) => new RegExp(`user-agent:\\s*${b}\\b`, "i").test(rTxt)) || `missing explicit allow for: ${AI_BOTS.filter((b) => !new RegExp(`user-agent:\\s*${b}\\b`, "i").test(rTxt)).join(", ")}${blocked ? " (and a blanket Disallow: /)" : ""}`);
  note("robots-sitemap", /sitemap:\s*https?:\/\//i.test(rTxt) || "robots.txt has no Sitemap line");

  const llms = await get("/llms.txt");
  const llmsLinks = [...new Set([...llms.text.matchAll(/\]\((https?:\/\/[^)\s]+)\)/g)].map((m) => m[1].replace(/^https?:\/\/[^/]+/, "")))];
  const dead = [];
  for (const l of llmsLinks) { const r = await get(l); if (r.status !== 200) dead.push(`${l} (${r.status})`); }
  note("llms-txt", (llms.status === 200 && /^# /.test(llms.text) && /^> /m.test(llms.text) && llmsLinks.length >= 10 && dead.length === 0) || `status ${llms.status}, ${llmsLinks.length} links, dead: ${dead.join(", ") || "none"}`);
  const full = await get("/llms-full.txt");
  note("llms-full-txt", (full.status === 200 && full.text.length > 3000) || `status ${full.status}, ${full.text.length} bytes`);

  // ---- sitemap crawl
  const idx = await get("/sitemap.xml");
  const kids = [...idx.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(/^https?:\/\/[^/]+/, ""));
  let urls = [];
  let lastmods = 0;
  for (const k of kids) {
    const r = await get(k);
    urls.push(...[...r.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(/^https?:\/\/[^/]+/, "")));
    lastmods += (r.text.match(/<lastmod>/g) ?? []).length;
  }
  urls = [...new Set(urls)];
  note("sitemap", (idx.status === 200 && kids.length > 0 && urls.length > 0 && lastmods >= urls.length) || `${kids.length} sitemaps, ${urls.length} urls, ${lastmods} lastmod`);

  // ---- per page
  const perKind = {};
  const failures = {};
  let pagesChecked = 0;
  const hoodNumbers = new Map();
  const ratingPages = [];
  const urlMismatch = [];
  const queue = urls.slice();
  const homeP = parse((await get("/")).text);
  const worker = async () => {
    while (queue.length) {
      const path = queue.pop();
      const r = await get(path);
      if (r.status !== 200) { (failures["status"] ??= []).push(`${path} -> ${r.status}`); continue; }
      const p = parse(r.text);
      if (p.noindex) continue;
      pagesChecked++;
      const k = kind(path);
      for (const m of p.mainText.matchAll(/(\d+)\+?\s+(?:Bengaluru\s+)?neighbourhoods/gi)) if (+m[1] >= 50) (hoodNumbers.get(m[1]) ?? hoodNumbers.set(m[1], []).get(m[1])).push(path);
      if (JSON.stringify(p.blocks).includes('"aggregateRating"') && path !== "/reviews") ratingPages.push(path);
      const wp = p.blocks.find((b) => [b["@type"]].flat().some((t) => /Page$/.test(String(t))) && b.url);
      if (wp && wp.url.replace(/^https?:\/\/[^/]+/, "").replace(/\/$/, "") !== path.replace(/\/$/, "")) urlMismatch.push(`${path} -> ${wp.url}`);
      for (const [id, applies, test] of PAGE_CHECKS) {
        if (!applies.includes(k)) continue;
        const out = test(p, path);
        const bucket = (perKind[k] ??= { pass: 0, total: 0 });
        bucket.total++;
        if (out === true) bucket.pass++;
        else (failures[`${id} [${k}]`] ??= []).push(`${path}: ${out}`);
      }
    }
  };
  await Promise.all(Array.from({ length: 8 }, worker));

  note("facts-consistent", hoodNumbers.size <= 1 || `neighbourhood count differs across pages: ${[...hoodNumbers].map(([n, u]) => `${n} (${u.length} pages, e.g. ${u[0]})`).join("; ")}`);
  note("review-markup-honest", ratingPages.length === 0 || `aggregateRating on pages that do not show the reviews: ${ratingPages.slice(0, 3).join(", ")}${ratingPages.length > 3 ? ` +${ratingPages.length - 3} more` : ""}`);
  note("schema-url-matches-canonical", urlMismatch.length === 0 || `${urlMismatch.length} mismatches, e.g. ${urlMismatch[0]}`);

  // ---- entity (home) site-level checks
  const org = homeP.blocks.find((b) => ["Organization", "LocalBusiness", "HomeAndConstructionBusiness"].some((t) => [b["@type"]].flat().includes(t)) && b.name);
  const need = ["name", "url", "logo", "telephone", "address", "areaServed"];
  const orgMiss = org ? need.filter((f) => !org[f]) : need;
  if (org && !(org.openingHours || org.openingHoursSpecification)) orgMiss.push("openingHours");
  note("entity-organization", orgMiss.length === 0 || `home entity missing: ${orgMiss.join(", ")}`);
  note("entity-website", hasAny(homeP, ["WebSite"]) || "no WebSite schema on home");
  const sameAs = org?.sameAs ?? [];
  if (!Array.isArray(sameAs) || sameAs.length === 0) owner.push("sameAs: add the real Google Business Profile / social / directory URLs (AI engines use these to confirm the entity; they cannot be invented).");
  const rating = JSON.stringify(homeP.blocks).includes("AggregateRating") || (await Promise.all(["/reviews", "/services/microwave-repair"].map(async (u) => (await get(u)).text.includes("AggregateRating")))).some(Boolean);
  if (rating) owner.push("AggregateRating/Review markup is present: keep it only if those reviews are genuine and verifiable (Google and AI engines penalise fabricated review markup).");

  // ---- report
  let pass = results.filter((r) => r.ok).length;
  let total = results.length;
  for (const b of Object.values(perKind)) { pass += b.pass; total += b.total; }
  console.log(`\nAEO/GEO scorecard  ${BASE}  (${pagesChecked} indexable pages, ${total} checks)\n`);
  for (const r of results) console.log(`${r.ok ? "PASS" : "FAIL"}  site  ${r.id}${r.ok ? "" : "  — " + r.detail}`);
  console.log("");
  for (const [k, b] of Object.entries(perKind)) console.log(`${b.pass === b.total ? "PASS" : "FAIL"}  ${k.padEnd(10)} ${b.pass}/${b.total}`);
  const keys = Object.keys(failures);
  if (keys.length) {
    console.log("\nFailing checks (first 3 examples each):");
    for (const k of keys) console.log(`  ${k}  x${failures[k].length}\n     ${failures[k].slice(0, 3).join("\n     ")}`);
  }
  if (owner.length) console.log("\nNeeds owner input / judgement (not scored, never faked):\n  - " + owner.join("\n  - "));
  const perfect = total > 0 && pass === total;
  const pct = perfect ? "100.0" : (Math.floor((pass / total) * 1000) / 10).toFixed(1);
  console.log(`\nSCORE: ${pass}/${total} = ${pct}%${perfect ? "  ✔ every check passes" : `  (${total - pass} failing)`}`);
  process.exit(perfect ? 0 : 1);
}
main().catch((e) => { console.error(e); process.exit(2); });
