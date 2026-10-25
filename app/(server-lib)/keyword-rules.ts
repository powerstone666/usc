// Rules that decide whether a real search query may become a /keywords/ page.
// Pure functions (no I/O) so they can be tested with plain inputs: scripts/test-keyword-rules.mjs.
//
// Everything here errs on the side of NOT creating a page. A skipped query costs nothing; a wrong
// page (wrong appliance, a competitor's name, "official service centre") costs trust.
import type { ServiceSlug } from "../(common-lib)/types";

export type SkipReason =
  | "too_short"
  | "too_long"
  | "blocked_word"
  | "competitor_or_official"
  | "other_city"
  | "area_covered"
  | "brand_covered"
  | "no_intent"
  | "unrelated_words"
  | "no_service"
  | "ambiguous_service"
  | "duplicate"
  | "low_impressions";

export type Candidate = { query: string; impressions: number; clicks: number; position: number };
export type ProposedKeyword = { slug: string; title: string; service: ServiceSlug; problem: string; query: string };
export type Decision = { ok: true; keyword: ProposedKeyword } | { ok: false; reason: SkipReason };

export type RuleContext = {
  /** Normalised keys (see keyOf) of every keyword that already exists. */
  knownKeys: Set<string>;
  /** Lower-case area names that already have their own /areas/ page. */
  areaNames: string[];
  /** Problem titles per service, used to label the page's main problem. */
  problems: Record<string, { title: string }[]>;
  /** Default problem per service when none matches. */
  fallbackProblem: Record<string, string>;
  minImpressions: number;
  /** Lower-case brand names that already have their own /brands/ page. */
  brandNames: string[];
  /** Skip queries that name one of those brands (automatic sources only). */
  skipBrands: boolean;
  /** Strict mode for the key-less autocomplete source, which is noisy: needs a repair-type word and
   *  only known appliance/fault vocabulary (so place names, "report format", "jacket"… are refused). */
  requireIntent: boolean;
};

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ").trim();

// Word-boundary patterns: "carrier" must not match "car", "automatic" must not match "auto".
const SERVICE_PATTERNS: [ServiceSlug, RegExp][] = [
  ["microwave-repair", /\b(microwaves?|mw oven|convection oven|grill oven|solo oven)\b/],
  ["ac-repair", /\b(ac|air conditioners?|air conditioning|split ac|window ac|inverter ac)\b/],
  ["washing-machine-repair", /\b(washing machines?|washers?|front load|top load|semi automatic)\b/],
  ["refrigerator-repair", /\b(fridges?|refrigerators?|freezers?)\b/],
  ["water-filter-repair", /\b(ro|water purifiers?|water filters?|purifiers?|aquaguard|kent)\b/],
  ["chimney-repair", /\b(chimneys?|kitchen hood)\b/],
];

export function detectService(query: string): ServiceSlug | "ambiguous" | null {
  const q = norm(query);
  const hits = SERVICE_PATTERNS.filter(([, re]) => re.test(q)).map(([s]) => s);
  if (hits.length === 0) return null;
  return hits.length === 1 ? hits[0] : "ambiguous";
}

const BLOCKED = /\b(cars?|vehicles?|jobs?|salary|courses?|training|second hand|secondhand|used|olx|buy|sell|videos?|youtube|diy|pdf|diagram|hire|vacanc(?:y|ies)|franchise|wholesale|how to|tutorial|manual|torrent|prices?|costs?|charges|rates?|fees?|cheap|cheapest|offers?|discount)\b/;

// Competitors and anything implying we are the manufacturer's official service.
const COMPETITOR_OR_OFFICIAL = /\b(urban ?company|urban ?clap|urbanclap|justdial|just dial|sulekha|local ramu|housejoy|house joy|onsitego|onsite go|livspace|amazon|flipkart|croma|reliance digital|service cent(?:er|re)s?|authori[sz]ed|customer care|toll free|helpline|contact number|phone number)\b/;

const OTHER_CITIES = /\b(delhi|mumbai|chennai|hyderabad|pune|kolkata|gurgaon|gurugram|noida|ahmedabad|jaipur|lucknow|kochi|cochin|coimbatore|hosur|mysore|mysuru|mangalore|mangaluru)\b/;

const INTENT = /\b(repair|repairs|repairing|service|services|servicing|fix|fixing|fixed|not|problem|problems|issue|issues|leak|leaking|leakage|noise|noisy|cooling|heating|gas|refill|spark|sparking|drain|draining|spin|spinning|clean|cleaning|replace|replacement|error|dead|stuck|jammed|broken|faulty|install|installation|amc|maintenance)\b/;

// Words an automatic phrase may contain besides appliance, intent and city words (strict mode).
const VOCAB = new Set(
  `a an and or the in on off up down of to is why how what do with without from at it my but runs run running works work working
   taking take takes getting get gets coming come going enough warm shutting shut
   heat heats heating hot cold cool cools freezing frozen ice leaks water drain spin turn turning switch switching start starting stop stopping
   open opening close closing door lid drum motor compressor fan blower pump filter membrane tank indoor outdoor unit outside inside front back top
   load automatic fully semi remote display light lights button buttons panel power electric tripping trip smell smells smoke smoking burning burnt
   noise sound loud vibration vibrating shaking suction low high flow pressure refill tds taste bad plate turntable rotating rotate rotation oven
   convection grill double single inverter split window kitchen hood oil thermostat coil bulb temperature timer mode food cleaning clothes properly
   fridge refrigerator freezer microwave washing machine purifier chimney air conditioner conditioning ro uv ac`.split(/\s+/),
);

const CITY_WORDS = new Set(["bangalore", "bengaluru", "bengalooru", "in", "near", "me", "at", "the", "for", "of", "and", "best", "top"]);

export function cleanQuery(query: string): string {
  return norm(query.replace(/within \d+(\.\d+)?\s*(km|kms|miles?)/gi, ""))
    .split(" ")
    .filter((w) => !CITY_WORDS.has(w))
    .join(" ")
    .trim();
}

/** Order-independent identity of a query, used to detect near-duplicates ("not heating microwave"). */
const GENERIC = new Set(["repair", "repairs", "repairing", "service", "services", "servicing", "fix", "problem", "problems", "issue", "issues", "shop", "centre", "center", "home", "up", "but", "runs", "run", "on", "off", "is", "it", "my", "why", "how", "what", "do", "to", "a", "an"]);

export function keyOf(text: string): string {
  const words = cleanQuery(text).split(" ").filter(Boolean);
  const core = words.filter((w) => !GENERIC.has(w));
  return [...new Set(core.length > 0 ? core : words)].sort().join(" ");
}

const ACRONYMS: Record<string, string> = { ac: "AC", ro: "RO", uv: "UV", lg: "LG", ifb: "IFB", pcb: "PCB", led: "LED", mw: "MW", tv: "TV" };
const SMALL = new Set(["and", "or", "in", "of", "the", "for", "to"]);

export function toTitle(cleaned: string): string {
  const words = cleaned.split(" ").map((w, i) => ACRONYMS[w] ?? (i > 0 && SMALL.has(w) ? w : w.charAt(0).toUpperCase() + w.slice(1)));
  return `${words.join(" ")} in Bengaluru`;
}

export const toSlug = (cleaned: string): string => `${cleaned.replace(/\s+/g, "-")}-bangalore`;

const PROBLEM_STOP = new Set(["microwave", "washing", "machine", "fridge", "refrigerator", "repair", "service", "not", "water", "filter", "chimney", "and", "the", "ac", "ro", "gas"]);
const stem = (w: string) => w.slice(0, 5);

export function deriveProblem(cleaned: string, problems: { title: string }[], fallback: string): string {
  const q = new Set(cleaned.split(" ").filter((w) => w.length > 2).map(stem));
  let best = { title: fallback, score: 0 };
  for (const p of problems) {
    const tokens = norm(p.title).split(" ").filter((w) => w.length > 2 && !PROBLEM_STOP.has(w));
    const score = tokens.filter((t) => q.has(stem(t))).length;
    if (score > best.score) best = { title: p.title, score };
  }
  return best.title;
}

export function evaluateCandidate(c: Candidate, ctx: RuleContext): Decision {
  const q = norm(c.query);
  const cleaned = cleanQuery(c.query);
  const words = cleaned.split(" ").filter(Boolean);
  if (words.length < 2) return { ok: false, reason: "too_short" };
  if (words.length > 7) return { ok: false, reason: "too_long" };
  if (COMPETITOR_OR_OFFICIAL.test(q)) return { ok: false, reason: "competitor_or_official" };
  if (BLOCKED.test(q)) return { ok: false, reason: "blocked_word" };
  if (OTHER_CITIES.test(q)) return { ok: false, reason: "other_city" };
  if (ctx.areaNames.some((a) => a && new RegExp(`\\b${a.replace(/[^a-z0-9 ]/g, "").replace(/ /g, " ")}\\b`).test(q))) return { ok: false, reason: "area_covered" };
  const hasWord = (list: string[]) => list.some((w) => w && new RegExp(`\\b${w.replace(/[^a-z0-9 ]/g, "")}\\b`).test(q));
  if (ctx.skipBrands && hasWord(ctx.brandNames)) return { ok: false, reason: "brand_covered" };
  const service = detectService(c.query);
  if (service === null) return { ok: false, reason: "no_service" };
  if (service === "ambiguous") return { ok: false, reason: "ambiguous_service" };
  if (ctx.requireIntent && !INTENT.test(q)) return { ok: false, reason: "no_intent" };
  if (ctx.requireIntent && words.some((w) => !VOCAB.has(w) && !INTENT.test(w))) return { ok: false, reason: "unrelated_words" };
  if (ctx.knownKeys.has(keyOf(c.query))) return { ok: false, reason: "duplicate" };
  if (c.impressions < ctx.minImpressions) return { ok: false, reason: "low_impressions" };
  return {
    ok: true,
    keyword: {
      slug: toSlug(cleaned),
      title: toTitle(cleaned),
      service,
      problem: deriveProblem(cleaned, ctx.problems[service] ?? [], ctx.fallbackProblem[service] ?? "Appliance repair"),
      query: c.query,
    },
  };
}

export const SKIP_LABELS: Record<SkipReason, string> = {
  too_short: "too short",
  too_long: "too long",
  blocked_word: "unrelated intent (jobs, DIY, videos…)",
  competitor_or_official: "competitor or “official service centre” wording",
  other_city: "another city",
  area_covered: "already covered by an area page",
  brand_covered: "brand already has its own page",
  no_intent: "no repair intent (price, brand-only…)",
  unrelated_words: "unrelated words (places, accessories…)",
  no_service: "no appliance recognised",
  ambiguous_service: "mentions several appliances",
  duplicate: "already exists",
  low_impressions: "too few impressions",
};
