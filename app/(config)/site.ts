import type { ApplianceIcon, ServiceSlug } from "@/app/(common-lib)/types";

export const site = {
  name: "Urban Service Company",
  shortName: "USC",
  tagline: "Bengaluru's appliance repair experts",
  domain: "urbanservicecompany.in",
  url: "https://urbanservicecompany.in",
  city: "Bengaluru",
  // TODO(replace-before-launch): swap placeholder phone + WhatsApp number
  phone: "+918884519375",
  phoneDisplay: "+91 8884519375",
  whatsapp: "+918884519375",
  email: "contact@urbanservicecompany.in",
  hours: "8 AM – 9 PM · all days",
  warranty: "Quality assured repair",
  damageCover: "Service you can trust",
} as const;

export type Service = {
  slug: ServiceSlug;
  name: string;
  short: string;
  tagline: string;
  blurb: string;
  icon: ApplianceIcon;
};

export const services: Service[] = [
  {
    slug: "microwave-repair",
    name: "Microwave Oven Repair",
    short: "Microwave",
    tagline: "Our flagship service. Same-day diagnosis by microwave specialists.",
    blurb:
      "Not heating, sparking, panel dead or turntable stuck? Tell us the symptom and our microwave tech diagnoses it before the visit.",
    icon: "microwave",
  },
  {
    slug: "ac-repair",
    name: "AC Repair & Service",
    short: "AC",
    tagline: "Cooling issues, gas refill, installations — split & window.",
    blurb:
      "Less cooling, water leakage, noise or power-on faults. Verified AC technicians across Bengaluru.",
    icon: "ac",
  },
  {
    slug: "washing-machine-repair",
    name: "Washing Machine Repair",
    short: "Washing Machine",
    tagline: "Front load, top load, semi-automatic — all brands.",
    blurb:
      "Not draining, not spinning, noisy drum or door jammed? We fix it at home.",
    icon: "washing-machine",
  },
  {
    slug: "refrigerator-repair",
    name: "Refrigerator Repair",
    short: "Refrigerator",
    tagline: "Single door, double door, side-by-side — all brands.",
    blurb:
      "Not cooling, frosting, leaking water or compressor noisy? Cool it down the same day.",
    icon: "refrigerator",
  },
  {
    slug: "water-filter-repair",
    name: "Water Filter & RO Repair",
    short: "Water Filter",
    tagline: "RO, UV, UF — all water purifier brands serviced.",
    blurb:
      "Not purifying, low flow, leakage or bad taste? We fix all water filter and RO purifier issues at home.",
    icon: "water-filter",
  },
  {
    slug: "chimney-repair",
    name: "Kitchen Chimney Repair",
    short: "Chimney",
    tagline: "Faber, Elica, Bosch, Hindware — all chimney brands.",
    blurb:
      "Not sucking smoke, noisy motor, or touch panel dead? We repair and service kitchen chimneys at home.",
    icon: "chimney",
  },
];

export const nav = [
  { label: "Microwave", href: "/services/microwave-repair" },
  { label: "AC", href: "/services/ac-repair" },
  { label: "Washing Machine", href: "/services/washing-machine-repair" },
  { label: "Refrigerator", href: "/services/refrigerator-repair" },
  { label: "Water Filter", href: "/services/water-filter-repair" },
  { label: "Chimney", href: "/services/chimney-repair" },
];

export type TrustBadge = {
  icon: "shield" | "clock" | "wrench" | "verified" | "build" | "check-circle" | "star" | "pin" | "microwave";
  title: string;
  text: string;
};

export const trustBadges: TrustBadge[] = [
  { icon: "shield", title: "Verified pros", text: "Background-checked technicians" },
  { icon: "clock", title: "On-time", text: "Same-day slots across Bengaluru" },
  { icon: "wrench", title: "Quality assured", text: "Every repair is quality assured" },
  { icon: "verified", title: "Trusted service", text: "Reliable repair you can count on" },
];

export const steps = [
  { title: "Tell us the fault", text: "Pick your appliance and symptom — or just call." },
  { title: "Free diagnosis", text: "Our tech inspects and shares a clear quote before any work." },
  { title: "Repair at home", text: "Genuine parts, fixed rates, work done at your doorstep." },
  { title: "Quality assured", text: "Every repair is quality assured." },
];

export type Review = {
  name: string;
  area: string;
  rating: number;
  text: string;
};

export const reviews: Review[] = [
  {
    name: "Ananya R.",
    area: "Indiranagar",
    rating: 5,
    text: "Microwave stopped heating overnight. Diagnosed the magnetron and fixed it the same evening.",
  },
  {
    name: "Karthik M.",
    area: "Whitefield",
    rating: 5,
    text: "AC gas refill done neatly. No mess, fair quote, technician was on time.",
  },
  {
    name: "Fathima S.",
    area: "Koramangala",
    rating: 4,
    text: "Washing machine drum noise sorted in one visit. Honest about what was actually wrong.",
  },
  {
    name: "Gaurav P.",
    area: "HSR Layout",
    rating: 5,
    text: "Fridge wasn't cooling. Came in 2 hours, fixed the compressor relay. Impressive.",
  },
  {
    name: "Rakesh S.",
    area: "Jayanagar",
    rating: 5,
    text: "Microwave door latch was broken. Fixed it in 30 minutes with a genuine spare. Very professional.",
  },
  {
    name: "Deepa N.",
    area: "Marathahalli",
    rating: 5,
    text: "AC stopped cooling during peak summer. Came the same day, refilled the gas. Fair price, no upsell.",
  },
  {
    name: "Vikram R.",
    area: "Electronic City",
    rating: 4,
    text: "Washing machine wasn't draining. Turned out to be a clogged pump. Cleaned and fixed quickly.",
  },
  {
    name: "Lakshmi K.",
    area: "Malleswaram",
    rating: 5,
    text: "Refrigerator was making a loud noise. Diagnosed a faulty fan motor and replaced it. No more noise.",
  },
  {
    name: "Arjun M.",
    area: "BTM Layout",
    rating: 5,
    text: "Microwave was sparking. The technician replaced the waveguide cover and checked the magnetron. Honest advice.",
  },
];

export type AreaRegion =
  | "Central"
  | "Eastern"
  | "North-Eastern"
  | "Northern"
  | "South-Eastern"
  | "Southern"
  | "Southern Suburbs"
  | "Western"
  | "Peripheral";

export type Area = {
  name: string;
  region: AreaRegion;
};

export const bangaloreAreas: Area[] = [
  { name: "Indiranagar", region: "Central" },
  { name: "Malleswaram", region: "Central" },
  { name: "Sadashivanagar", region: "Central" },
  { name: "Shivajinagar", region: "Central" },
  { name: "Vasanth Nagar", region: "Central" },
  { name: "Ulsoor", region: "Central" },
  { name: "Domlur", region: "Central" },
  { name: "Seshadripuram", region: "Central" },
  { name: "R. T. Nagar", region: "Central" },
  { name: "Rajajinagar", region: "Central" },
  { name: "Richmond Town", region: "Central" },
  { name: "Fraser Town", region: "Central" },
  { name: "Cox Town", region: "Central" },
  { name: "Austin Town", region: "Central" },
  { name: "Murphy Town", region: "Central" },
  { name: "Chickpet", region: "Central" },
  { name: "MG Road", region: "Central" },
  { name: "Brigade Road", region: "Central" },
  { name: "Commercial Street", region: "Central" },

  { name: "Bellandur", region: "Eastern" },
  { name: "CV Raman Nagar", region: "Eastern" },
  { name: "Hoodi", region: "Eastern" },
  { name: "Krishnarajapuram", region: "Eastern" },
  { name: "Mahadevapura", region: "Eastern" },
  { name: "Marathahalli", region: "Eastern" },
  { name: "Varthur", region: "Eastern" },
  { name: "Whitefield", region: "Eastern" },

  { name: "Banaswadi", region: "North-Eastern" },
  { name: "HBR Layout", region: "North-Eastern" },
  { name: "Horamavu", region: "North-Eastern" },
  { name: "Kalyan Nagar", region: "North-Eastern" },
  { name: "Kammanahalli", region: "North-Eastern" },
  { name: "Lingarajapuram", region: "North-Eastern" },
  { name: "Ramamurthy Nagar", region: "North-Eastern" },

  { name: "Hebbal", region: "Northern" },
  { name: "Jalahalli", region: "Northern" },
  { name: "Mathikere", region: "Northern" },
  { name: "Peenya", region: "Northern" },
  { name: "Vidyaranyapura", region: "Northern" },
  { name: "Yelahanka", region: "Northern" },
  { name: "Yeshwanthpur", region: "Northern" },
  { name: "Sahakar Nagar", region: "Northern" },
  { name: "Sanjay Nagar", region: "Northern" },
  { name: "Hennur", region: "Northern" },
  { name: "Nagavara", region: "Northern" },

  { name: "Bommanahalli", region: "South-Eastern" },
  { name: "Bommasandra", region: "South-Eastern" },
  { name: "BTM Layout", region: "South-Eastern" },
  { name: "Electronic City", region: "South-Eastern" },
  { name: "HSR Layout", region: "South-Eastern" },
  { name: "Koramangala", region: "South-Eastern" },
  { name: "Madiwala", region: "South-Eastern" },
  { name: "Sarjapur Road", region: "South-Eastern" },

  { name: "Banashankari", region: "Southern" },
  { name: "Basavanagudi", region: "Southern" },
  { name: "Girinagar", region: "Southern" },
  { name: "J. P. Nagar", region: "Southern" },
  { name: "Jayanagar", region: "Southern" },
  { name: "Kumaraswamy Layout", region: "Southern" },
  { name: "Padmanabhanagar", region: "Southern" },
  { name: "Uttarahalli", region: "Southern" },

  { name: "Anjanapura", region: "Southern Suburbs" },
  { name: "Arekere", region: "Southern Suburbs" },
  { name: "Begur", region: "Southern Suburbs" },
  { name: "Gottigere", region: "Southern Suburbs" },
  { name: "Hulimavu", region: "Southern Suburbs" },
  { name: "Kothnur", region: "Southern Suburbs" },

  { name: "Basaveshwaranagar", region: "Western" },
  { name: "Kamakshipalya", region: "Western" },
  { name: "Kengeri", region: "Western" },
  { name: "Mahalakshmi Layout", region: "Western" },
  { name: "Nagarbhavi", region: "Western" },
  { name: "Nandini Layout", region: "Western" },
  { name: "Nayandahalli", region: "Western" },
  { name: "Rajarajeshwari Nagar", region: "Western" },
  { name: "Vijayanagar", region: "Western" },

  { name: "Attibele", region: "Peripheral" },
  { name: "Anekal", region: "Peripheral" },
  { name: "Chandapura", region: "Peripheral" },
  { name: "Thavarekere", region: "Peripheral" },
  { name: "Chikkabanavara", region: "Peripheral" },
  { name: "Hesaraghatta", region: "Peripheral" },
  { name: "Jigani", region: "Peripheral" },
  { name: "Nelamangala", region: "Peripheral" },
  { name: "Sarjapura", region: "Peripheral" },
];

export const areas = bangaloreAreas.map((a) => a.name);

export const areaRegions: AreaRegion[] = [
  "Central",
  "Eastern",
  "North-Eastern",
  "Northern",
  "South-Eastern",
  "Southern",
  "Southern Suburbs",
  "Western",
  "Peripheral",
];

export function getService(slug: ServiceSlug): Service {
  const service = services.find((s) => s.slug === slug);
  if (!service) throw new Error(`Unknown service: ${slug}`);
  return service;
}
