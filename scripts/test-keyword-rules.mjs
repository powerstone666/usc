// Tests for the keyword-discovery rules, using real-looking queries (including the ones that broke
// the first version). Run: node scripts/test-keyword-rules.mjs
import assert from "node:assert/strict";
import { cleanQuery, deriveProblem, detectService, evaluateCandidate, keyOf, toSlug, toTitle } from "../app/(server-lib)/keyword-rules.ts";

let n = 0;
const test = (name, fn) => { fn(); n++; console.log("PASS", name); };

const problems = {
  "microwave-repair": [{ title: "Microwave not heating" }, { title: "Sparking inside" }, { title: "Turntable not rotating" }, { title: "Buttons not working" }],
  "ac-repair": [{ title: "AC not cooling" }, { title: "Water leakage" }, { title: "AC not turning on" }],
  "washing-machine-repair": [{ title: "Not draining" }, { title: "Not spinning" }, { title: "Noisy drum" }, { title: "Door jammed" }],
  "refrigerator-repair": [{ title: "Not cooling" }, { title: "Frost build-up" }, { title: "Water leakage" }],
};
const ctx = {
  knownKeys: new Set(["microwave not heating", "ac repair"].map(keyOf)),
  areaNames: ["indiranagar", "hsr layout", "whitefield"],
  problems,
  fallbackProblem: { "microwave-repair": "Microwave not heating", "ac-repair": "AC not cooling", "washing-machine-repair": "Not draining", "refrigerator-repair": "Not cooling", "water-filter-repair": "Not purifying" },
  minImpressions: 20,
  brandNames: ["samsung", "lg", "ifb", "whirlpool", "daikin"],
  skipBrands: true,
  requireIntent: false,
};
const ev = (query, impressions = 100) => evaluateCandidate({ query, impressions, clicks: 5, position: 8 }, ctx);

test("service detection: the queries the old code misrouted (5 of 8 were wrong)", () => {
  assert.equal(detectService("microwave repair bangalore"), "microwave-repair"); // old: water filter ("ro" inside "microwave")
  assert.equal(detectService("lg microwave service"), "microwave-repair");
  assert.equal(detectService("samsung microwave oven repair"), "microwave-repair");
  assert.equal(detectService("washing machine repair near me"), "washing-machine-repair"); // old: AC ("ac" inside "machine")
  assert.equal(detectService("whirlpool washing machine service"), "washing-machine-repair");
  assert.equal(detectService("fridge repair bangalore"), "refrigerator-repair");
  assert.equal(detectService("kitchen chimney cleaning"), "chimney-repair");
  assert.equal(detectService("ac gas refill"), "ac-repair");
  assert.equal(detectService("ro water purifier not working"), "water-filter-repair");
});

test("service detection: unknown and ambiguous queries are not guessed", () => {
  assert.equal(detectService("best restaurants in bangalore"), null);
  assert.equal(detectService("microwave and ac repair bangalore"), "ambiguous");
  assert.equal(detectService("fridge or washing machine service"), "ambiguous");
});

test("blocklist uses whole words: legitimate queries are kept", () => {
  assert.ok(ev("fully automatic washing machine repair").ok, "old: rejected by 'auto'");
  assert.ok(ev("carrier ac service bangalore").ok, "old: rejected by 'car'");
  assert.ok(ev("ac repair care").ok, "old: rejected by 'car' inside 'care'");
  assert.ok(ev("unused fridge repair").ok, "'unused' is a different word from 'used'");
  assert.equal(ev("ac repair jobs bangalore").reason, "blocked_word");
  assert.equal(ev("microwave repair diy video").reason, "blocked_word");
  assert.equal(ev("second hand fridge bangalore").reason, "blocked_word");
});

test("competitors and 'official service centre' wording are never published", () => {
  for (const q of ["urban company ac repair bangalore", "urbanclap microwave repair", "justdial washing machine repair", "local ramu fridge service", "samsung microwave service center", "lg authorised service centre washing machine", "whirlpool fridge customer care"]) {
    assert.equal(ev(q).reason, "competitor_or_official", q);
  }
});

test("other cities and neighbourhoods that already have a page are skipped", () => {
  assert.equal(ev("washing machine repair delhi").reason, "other_city");
  assert.equal(ev("microwave repair indiranagar").reason, "area_covered");
  assert.equal(ev("ac service hsr layout").reason, "area_covered");
});

test("length, duplicates (any word order) and impressions threshold", () => {
  assert.equal(ev("microwave").reason, "too_short");
  assert.equal(ev("microwave oven repair service centre near me best price list shop").reason, "too_long");
  assert.equal(ev("not heating microwave bangalore").reason, "duplicate"); // same words as the existing keyword
  assert.equal(ev("ac repair").reason, "duplicate");
  assert.equal(ev("washing machine door jammed", 5).reason, "low_impressions");
  assert.ok(ev("washing machine door jammed", 20).ok);
});

test("problem labels come from the page's own problem list", () => {
  assert.equal(ev("washing machine drum noise").keyword.problem, "Noisy drum");
  assert.equal(ev("ac water leakage problem").keyword.problem, "Water leakage");
  assert.equal(ev("fridge frost buildup").keyword.problem, "Frost build-up");
  assert.equal(ev("microwave sparking issue").keyword.problem, "Sparking inside");
  assert.equal(ev("washing machine repair service").keyword.problem, "Not draining"); // falls back to the service default
  assert.equal(deriveProblem("microwave service", problems["microwave-repair"], "Microwave not heating"), "Microwave not heating");
});

test("titles keep acronyms and slugs are stable", () => {
  assert.equal(toTitle("ac gas refill"), "AC Gas Refill in Bengaluru");
  assert.equal(toTitle("ro service"), "RO Service in Bengaluru");
  assert.equal(toTitle("lg microwave repair"), "LG Microwave Repair in Bengaluru");
  assert.equal(toSlug("ac gas refill"), "ac-gas-refill-bangalore");
  assert.equal(cleanQuery("AC Gas Refill near me in Bangalore within 5 km"), "ac gas refill");
});

test("an accepted query produces a complete, correctly-classified keyword", () => {
  const d = ev("fully automatic washing machine repair near me");
  assert.ok(d.ok);
  assert.deepEqual([d.keyword.service, d.keyword.slug, d.keyword.title], ["washing-machine-repair", "fully-automatic-washing-machine-repair-bangalore", "Fully Automatic Washing Machine Repair in Bengaluru"]);
});

test("brands that already have a page are skipped for automatic sources, allowed when added by hand", () => {
  assert.equal(ev("samsung microwave not heating").reason, "brand_covered");
  assert.equal(ev("whirlpool washing machine repair").reason, "brand_covered");
  const manual = evaluateCandidate({ query: "samsung microwave not heating", impressions: 0, clicks: 0, position: 0 }, { ...ctx, skipBrands: false, minImpressions: 0 });
  assert.ok(manual.ok, "an owner adding it by hand is allowed");
});

test("the key-less autocomplete source must show repair intent", () => {
  const sug = { ...ctx, requireIntent: true, minImpressions: 0 };
  const run = (query) => evaluateCandidate({ query, impressions: 0, clicks: 0, position: 0 }, sug);
  assert.equal(run("microwave oven price in bangalore").reason, "blocked_word");
  assert.equal(run("microwave oven models").reason, "no_intent");
  assert.ok(run("microwave sparking inside bangalore").ok);
  assert.ok(run("fully automatic washing machine repair").ok);
  assert.ok(run("ac gas refill bangalore").ok, "gas + refill are repair-type words");
});

test("price-seeking phrases are not published (the site shows no rates)", () => {
  assert.equal(ev("ac gas refilling cost").reason, "blocked_word");
  assert.equal(ev("microwave repair charges").reason, "blocked_word");
  assert.equal(ev("washing machine repair price").reason, "blocked_word");
});

test("strict mode refuses place names and accessories but keeps real faults", () => {
  const sug = { ...ctx, requireIntent: true, minImpressions: 0 };
  const run = (query) => evaluateCandidate({ query, impressions: 0, clicks: 0, position: 0 }, sug);
  for (const q of ["microwave repair birmingham", "split ac service jacket", "split ac service hsn code", "ac not working in train", "inverter ac repairing book"]) assert.equal(run(q).reason, "unrelated_words", q);
  for (const q of ["microwave door not closing properly", "washing machine not taking water", "ac water leaking from indoor unit", "microwave turntable not rotating"]) assert.ok(run(q).ok, q);
});

test("near-identical phrases count as one page (filler words ignored)", () => {
  assert.equal(keyOf("microwave not heating problem"), keyOf("microwave not heating"));
  assert.equal(keyOf("microwave repair near me"), keyOf("microwave service"));
  assert.notEqual(keyOf("microwave not heating"), keyOf("microwave not working"));
});

console.log(`\n${n} tests passed`);
