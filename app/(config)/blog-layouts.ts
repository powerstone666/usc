import type { BlogPost } from "@/app/(config)/blog";

export type BlogLayout = {
  id: number;
  name: string;
  heroStyle: string;
  imagePosition: "top" | "side" | "full" | "split" | "banner" | "rounded" | "overlap" | "tilted" | "circle" | "grid";
  contentStyle: string;
  ctaPosition: "bottom" | "side" | "inline" | "top" | "split" | "center" | "floating" | "strip" | "card" | "sticky";
  showStats: boolean;
  stats: { label: string; value: string }[];
  quoteStyle: "none" | "top" | "middle" | "bottom" | "sidebar";
  quote: string;
  showAuthor: boolean;
  tableOfContents: boolean;
  showRelated: boolean;
};

export const blogLayouts: BlogLayout[] = [
  {
    id: 1,
    name: "Hero + TOC",
    heroStyle: "bg-primary text-on-primary",
    imagePosition: "full",
    contentStyle: "max-w-3xl",
    ctaPosition: "bottom",
    showStats: true,
    stats: [{ label: "Same-day slots", value: "84+" }, { label: "Brands", value: "30+" }, { label: "Quality", value: "Assured" }],
    quoteStyle: "none",
    quote: "",
    showAuthor: true,
    tableOfContents: true,
    showRelated: true,
  },
  {
    id: 2,
    name: "Side image + inline CTA",
    heroStyle: "bg-surface-variant text-on-surface",
    imagePosition: "side",
    contentStyle: "max-w-2xl",
    ctaPosition: "inline",
    showStats: false,
    stats: [],
    quoteStyle: "none",
    quote: "",
    showAuthor: true,
    tableOfContents: false,
    showRelated: true,
  },
  {
    id: 3,
    name: "Split hero + stats strip",
    heroStyle: "bg-primary text-on-primary split",
    imagePosition: "split",
    contentStyle: "max-w-4xl",
    ctaPosition: "top",
    showStats: true,
    stats: [{ label: "Free diagnosis", value: "Yes" }, { label: "Neighbourhoods", value: "84+" }, { label: "Brands", value: "30+" }],
    quoteStyle: "top",
    quote: "Quality assured repair you can count on.",
    showAuthor: false,
    tableOfContents: true,
    showRelated: true,
  },
  {
    id: 4,
    name: "Rounded image + sidebar CTA",
    heroStyle: "bg-surface-variant text-on-surface",
    imagePosition: "rounded",
    contentStyle: "max-w-3xl",
    ctaPosition: "side",
    showStats: true,
    stats: [{ label: "Response time", value: "15 min" }, { label: "Areas", value: "84+" }],
    quoteStyle: "sidebar",
    quote: "Transparent pricing. You approve before any work begins.",
    showAuthor: true,
    tableOfContents: true,
    showRelated: false,
  },
  {
    id: 5,
    name: "Overlap image + floating CTA",
    heroStyle: "bg-primary text-on-primary",
    imagePosition: "overlap",
    contentStyle: "max-w-3xl",
    ctaPosition: "floating",
    showStats: false,
    stats: [],
    quoteStyle: "middle",
    quote: "Same-day repair across all of Bengaluru.",
    showAuthor: true,
    tableOfContents: false,
    showRelated: true,
  },
  {
    id: 6,
    name: "Banner image + center CTA",
    heroStyle: "bg-surface-variant text-on-surface",
    imagePosition: "banner",
    contentStyle: "max-w-2xl",
    ctaPosition: "center",
    showStats: true,
    stats: [{ label: "Technicians", value: "4.5+ rated" }, { label: "Spare parts", value: "Genuine" }],
    quoteStyle: "none",
    quote: "",
    showAuthor: false,
    tableOfContents: false,
    showRelated: true,
  },
  {
    id: 7,
    name: "Tilted image + strip CTA",
    heroStyle: "bg-primary text-on-primary",
    imagePosition: "tilted",
    contentStyle: "max-w-3xl",
    ctaPosition: "strip",
    showStats: true,
    stats: [{ label: "Warranty", value: "Quality assured" }, { label: "Slots", value: "Same-day" }],
    quoteStyle: "bottom",
    quote: "Genuine spare parts. Fixed rates. Doorstep service.",
    showAuthor: true,
    tableOfContents: true,
    showRelated: true,
  },
  {
    id: 8,
    name: "Circle image + card CTA",
    heroStyle: "bg-surface-variant text-on-surface",
    imagePosition: "circle",
    contentStyle: "max-w-2xl",
    ctaPosition: "card",
    showStats: false,
    stats: [],
    quoteStyle: "none",
    quote: "",
    showAuthor: true,
    tableOfContents: false,
    showRelated: false,
  },
  {
    id: 9,
    name: "Grid image + sticky CTA",
    heroStyle: "bg-primary text-on-primary",
    imagePosition: "grid",
    contentStyle: "max-w-4xl",
    ctaPosition: "sticky",
    showStats: true,
    stats: [{ label: "Hours", value: "8 AM – 9 PM" }, { label: "Areas", value: "84+" }, { label: "Call", value: "15 min" }],
    quoteStyle: "none",
    quote: "",
    showAuthor: false,
    tableOfContents: true,
    showRelated: true,
  },
  {
    id: 10,
    name: "Top image + bottom CTA",
    heroStyle: "bg-surface-variant text-on-surface",
    imagePosition: "top",
    contentStyle: "max-w-3xl",
    ctaPosition: "bottom",
    showStats: true,
    stats: [{ label: "Diagnosis", value: "Free" }, { label: "Brands", value: "30+" }, { label: "Quality", value: "Assured" }],
    quoteStyle: "none",
    quote: "",
    showAuthor: true,
    tableOfContents: true,
    showRelated: true,
  },
];

export function getBlogLayout(slug: string): BlogLayout {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = ((hash << 5) - hash) + slug.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % blogLayouts.length;
  return blogLayouts[index];
}
