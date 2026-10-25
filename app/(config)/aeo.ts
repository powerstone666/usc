// Answer-engine / generative-engine copy in one place so every page states the same facts.
// Everything here is derived from site config; nothing is invented. Update site.contentUpdated
// when any of it changes.
import { areas, site, type Service } from "@/app/(config)/site";
import type { Keyword } from "@/app/(config)/keywords";
import { serviceProblems, type Faq } from "@/app/(config)/content";

const hours = site.hours.replace(" · ", ", ");
const coverage = `${areas.length}+ neighbourhoods`;
const allAppliances = "microwaves, ACs, washing machines, refrigerators, water filters and kitchen chimneys";

export const homeAnswer = `${site.name} repairs ${allAppliances} across ${site.city}. Verified technicians offer same-day slots, a free diagnosis, transparent quotes and genuine parts, with ${site.warranty.toLowerCase()}. We serve ${coverage}, ${hours}.`;

export const aboutAnswer = `${site.name} is a ${site.city} appliance repair service for ${allAppliances}. We offer same-day slots, a free diagnosis before any quote, genuine parts and ${site.warranty.toLowerCase()} across ${coverage}.`;

export const coverageAnswer = `${site.name} serves ${areas.length} neighbourhoods across ${site.city}, from Indiranagar and Koramangala to Whitefield and Hebbal. Same-day slots are available in most areas, diagnosis is free, and bookings are taken ${hours}.`;

function joinList(items: string[]): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

export function serviceAnswer(s: Service): string {
  const faults = serviceProblems[s.slug].slice(0, 4).map((p) => p.title.toLowerCase());
  return `${s.name} in ${site.city}: ${site.name} sends a verified technician to your home for same-day diagnosis and repair. Common faults we fix include ${joinList(faults)}. Diagnosis is free, you get a quote before any work, and every repair is quality assured. Bookings are taken ${hours}.`;
}

export function areaAnswer(area: string): string {
  return `${site.name} repairs ${allAppliances} in ${area}, ${site.city}. Verified technicians offer same-day slots, a free diagnosis, genuine parts and ${site.warranty.toLowerCase()}, ${hours}.`;
}

export function brandAnswer(brand: string): string {
  return `${site.name} repairs ${brand} appliances across ${site.city}. A verified technician diagnoses the fault for free, quotes before any work and fits quality-tested spare parts, with same-day slots in ${coverage}. Bookings are taken ${hours}.`;
}

export function keywordAnswer(kw: Keyword): string {
  return `${kw.title}: a ${site.name} technician diagnoses the fault at your home for free, explains the cause and quotes before any work begins. Same-day slots are available across ${coverage}, ${hours}.`;
}

export function brandFaqs(brand: string): Faq[] {
  return [
    {
      q: `Do you repair ${brand} appliances in ${site.city}?`,
      a: `Yes. ${site.name} repairs ${brand} appliances at your home across ${site.city}. Tell us the appliance and the fault when you book, and a verified technician diagnoses it for free before any quote.`,
    },
    {
      q: `How quickly can I book a ${brand} repair?`,
      a: `Same-day slots are available in most of our ${areas.length} neighbourhoods. Call ${hours} or use the booking form, and we confirm your slot with a call back.`,
    },
    {
      q: `Is the diagnosis free for ${brand} appliances?`,
      a: `Yes. Diagnosis is free. You receive a clear quote before any work starts, and nothing is repaired until you approve it.`,
    },
    {
      q: `What spare parts do you use for ${brand}?`,
      a: `We fit quality-tested spare parts and every repair is quality assured. The technician explains which part failed and what it costs before replacing it.`,
    },
    {
      q: `Which ${brand} appliances can you service?`,
      a: `We service ${allAppliances}. Tell us the appliance type when you book and we confirm that we handle your ${brand} model before sending a technician.`,
    },
  ];
}

// Blog FAQ paragraphs are written as "Question? Answer." — split them into real Q&A pairs.
export function parseFaqParagraph(text: string): { q: string; a: string } | null {
  const i = text.indexOf("? ");
  if (i < 10 || i > 200) return null;
  return { q: text.slice(0, i + 1).trim(), a: text.slice(i + 2).trim() };
}

export function areaFaqs(area: string, region: string, nearby: string[]): Faq[] {
  return [
    {
      q: `Do you offer same-day appliance repair in ${area}?`,
      a: `Yes. ${area} is in our ${region} zone and same-day slots are available in most of our ${areas.length} neighbourhoods across ${site.city}. Call ${hours} or use the booking form and we confirm your slot with a call back.`,
    },
    {
      q: `Which appliances do you repair in ${area}?`,
      a: `We repair ${allAppliances} at your home in ${area}. Tell us the appliance and the fault when you book, and a verified technician diagnoses it before any quote.`,
    },
    {
      q: `Is the diagnosis free in ${area}?`,
      a: `Yes. Diagnosis is free. You receive a clear quote before any work starts, and nothing is repaired until you approve it. Every repair is quality assured.`,
    },
    {
      q: `Which areas near ${area} do you also cover?`,
      a: nearby.length > 0 ? `Near ${area} we also serve ${nearby.slice(0, 6).join(", ")}. The full list of ${areas.length} neighbourhoods is on our coverage page.` : `The full list of ${areas.length} neighbourhoods is on our coverage page.`,
    },
    {
      q: `How do I book a repair in ${area}?`,
      a: `Call ${site.name} on ${site.phoneDisplay} between ${hours}, or share your number in the booking form and a technician calls you back to confirm the fault and the slot.`,
    },
  ];
}
