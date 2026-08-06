import type { ServiceSlug } from "@/app/(common-lib)/types";

export type Keyword = {
  slug: string;
  title: string;
  service: ServiceSlug;
  problem: string;
};

export const keywords: Keyword[] = [
  { slug: "microwave-not-heating", title: "Microwave Not Heating in Bengaluru", service: "microwave-repair", problem: "Microwave not heating" },
  { slug: "microwave-sparking", title: "Microwave Sparking in Bengaluru", service: "microwave-repair", problem: "Sparking inside" },
  { slug: "microwave-turntable-not-rotating", title: "Microwave Turntable Not Rotating in Bengaluru", service: "microwave-repair", problem: "Turntable not rotating" },
  { slug: "microwave-buttons-not-working", title: "Microwave Buttons Not Working in Bengaluru", service: "microwave-repair", problem: "Buttons not working" },
  { slug: "microwave-not-turning-on", title: "Microwave Not Turning On in Bengaluru", service: "microwave-repair", problem: "Not turning on" },
  { slug: "ac-not-cooling", title: "AC Not Cooling in Bengaluru", service: "ac-repair", problem: "AC not cooling" },
  { slug: "ac-gas-refill", title: "AC Gas Refill in Bengaluru", service: "ac-repair", problem: "Gas refill needed" },
  { slug: "ac-water-leakage", title: "AC Water Leakage in Bengaluru", service: "ac-repair", problem: "Water leakage" },
  { slug: "ac-not-turning-on", title: "AC Not Turning On in Bengaluru", service: "ac-repair", problem: "Not turning on" },
  { slug: "ac-noise-vibration", title: "AC Noise or Vibration in Bengaluru", service: "ac-repair", problem: "Noise or vibration" },
  { slug: "ac-service-near-me", title: "AC Service Near Me in Bengaluru", service: "ac-repair", problem: "AC not cooling" },
  { slug: "ac-repair-near-me", title: "AC Repair Near Me in Bengaluru", service: "ac-repair", problem: "AC not cooling" },
  { slug: "washing-machine-not-draining", title: "Washing Machine Not Draining in Bengaluru", service: "washing-machine-repair", problem: "Not draining" },
  { slug: "washing-machine-not-spinning", title: "Washing Machine Not Spinning in Bengaluru", service: "washing-machine-repair", problem: "Not spinning" },
  { slug: "washing-machine-noisy-drum", title: "Washing Machine Noisy Drum in Bengaluru", service: "washing-machine-repair", problem: "Noisy drum" },
  { slug: "washing-machine-door-jammed", title: "Washing Machine Door Jammed in Bengaluru", service: "washing-machine-repair", problem: "Door jammed" },
  { slug: "washing-machine-repair-near-me", title: "Washing Machine Repair Near Me in Bengaluru", service: "washing-machine-repair", problem: "Not draining" },
  { slug: "refrigerator-not-cooling", title: "Refrigerator Not Cooling in Bengaluru", service: "refrigerator-repair", problem: "Not cooling" },
  { slug: "fridge-water-leakage", title: "Fridge Water Leakage in Bengaluru", service: "refrigerator-repair", problem: "Water leakage" },
  { slug: "fridge-compressor-noise", title: "Fridge Compressor Noise in Bengaluru", service: "refrigerator-repair", problem: "Compressor noise" },
  { slug: "fridge-frost-buildup", title: "Fridge Frost Buildup in Bengaluru", service: "refrigerator-repair", problem: "Frost build-up" },
  { slug: "refrigerator-repair-near-me", title: "Refrigerator Repair Near Me in Bengaluru", service: "refrigerator-repair", problem: "Not cooling" },
  { slug: "fridge-repair-near-me", title: "Fridge Repair Near Me in Bengaluru", service: "refrigerator-repair", problem: "Not cooling" },
  { slug: "microwave-repair-near-me", title: "Microwave Repair Near Me in Bengaluru", service: "microwave-repair", problem: "Microwave not heating" },
  { slug: "microwave-oven-repair-service-near-me", title: "Microwave Oven Repair Service Near Me in Bengaluru", service: "microwave-repair", problem: "Microwave not heating" },
  { slug: "microwave-repair-shop-near-me", title: "Microwave Repair Shop Near Me in Bengaluru", service: "microwave-repair", problem: "Microwave not heating" },
  { slug: "microwave-oven-repair-shop-near-me", title: "Microwave Oven Repair Shop Near Me in Bengaluru", service: "microwave-repair", problem: "Microwave not heating" },
  { slug: "microwave-oven-repair-bengaluru", title: "Microwave Oven Repair in Bengaluru", service: "microwave-repair", problem: "Microwave not heating" },
  { slug: "microwave-repair-bengaluru", title: "Microwave Repair in Bengaluru", service: "microwave-repair", problem: "Microwave not heating" },
  { slug: "oven-repair-near-me", title: "Oven Repair Near Me in Bengaluru", service: "microwave-repair", problem: "Microwave not heating" },
  { slug: "lg-microwave-repair-near-me", title: "LG Microwave Repair Near Me in Bengaluru", service: "microwave-repair", problem: "Microwave not heating" },
  { slug: "samsung-microwave-repair-near-me", title: "Samsung Microwave Repair Near Me in Bengaluru", service: "microwave-repair", problem: "Microwave not heating" },
  { slug: "ifb-microwave-repair-near-me", title: "IFB Microwave Repair Near Me in Bengaluru", service: "microwave-repair", problem: "Microwave not heating" },
  { slug: "washing-machine-repair-shop-near-me", title: "Washing Machine Repair Shop Near Me in Bengaluru", service: "washing-machine-repair", problem: "Not draining" },
  { slug: "nearby-washing-machine-repair", title: "Nearby Washing Machine Repair in Bengaluru", service: "washing-machine-repair", problem: "Not draining" },
  { slug: "water-filter-repair-near-me", title: "Water Filter Repair Near Me in Bengaluru", service: "water-filter-repair", problem: "Not purifying" },
  { slug: "chimney-repair-near-me", title: "Chimney Repair Near Me in Bengaluru", service: "chimney-repair", problem: "Not sucking smoke" },

  { slug: "urban-company-washing-machine-service-bengaluru", title: "Urban Company Washing Machine Service in Bengaluru", service: "washing-machine-repair", problem: "Not draining" },
  { slug: "urban-company-washing-machine-repair-bengaluru", title: "Urban Company Washing Machine Repair in Bengaluru", service: "washing-machine-repair", problem: "Not spinning" },
  { slug: "washing-machine-service-urban-company-bengaluru", title: "Washing Machine Service Urban Company in Bengaluru", service: "washing-machine-repair", problem: "Not draining" },
  { slug: "washing-machine-repair-urban-company-bengaluru", title: "Washing Machine Repair Urban Company in Bengaluru", service: "washing-machine-repair", problem: "Not spinning" },
  { slug: "urban-company-microwave-repair-bengaluru", title: "Urban Company Microwave Repair in Bengaluru", service: "microwave-repair", problem: "Microwave not heating" },
  { slug: "urban-company-oven-repair-bengaluru", title: "Urban Company Oven Repair in Bengaluru", service: "microwave-repair", problem: "Microwave not heating" },
  { slug: "urban-company-fridge-repair-bengaluru", title: "Urban Company Fridge Repair in Bengaluru", service: "refrigerator-repair", problem: "Not cooling" },
  { slug: "urban-company-refrigerator-repair-bengaluru", title: "Urban Company Refrigerator Repair in Bengaluru", service: "refrigerator-repair", problem: "Not cooling" },
  { slug: "urban-refrigerator-repair-bengaluru", title: "Urban Refrigerator Repair in Bengaluru", service: "refrigerator-repair", problem: "Not cooling" },
  { slug: "urban-company-ac-repair-bengaluru", title: "Urban Company AC Repair in Bengaluru", service: "ac-repair", problem: "AC not cooling" },
  { slug: "urban-company-chimney-repair-bengaluru", title: "Urban Company Chimney Repair in Bengaluru", service: "chimney-repair", problem: "Not sucking smoke" },
  { slug: "urban-company-appliance-repair-bengaluru", title: "Urban Company Appliance Repair in Bengaluru", service: "microwave-repair", problem: "Microwave not heating" },
  { slug: "urban-company-vs-urban-service-company", title: "Urban Company vs Urban Service Company in Bengaluru", service: "microwave-repair", problem: "Microwave not heating" },
  { slug: "alternative-to-urban-company-bengaluru", title: "Alternative to Urban Company in Bengaluru", service: "microwave-repair", problem: "Microwave not heating" },
];
