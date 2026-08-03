import type { ServiceSlug } from "@/app/(common-lib)/types";

export type Keyword = {
  slug: string;
  title: string;
  service: ServiceSlug;
  problem: string;
};

export const keywords: Keyword[] = [
  { slug: "microwave-not-heating", title: "Microwave Not Heating in Bengaluru", service: "microwave-repair", problem: "Not heating" },
  { slug: "microwave-sparking", title: "Microwave Sparking in Bengaluru", service: "microwave-repair", problem: "Sparking inside" },
  { slug: "microwave-turntable-not-rotating", title: "Microwave Turntable Not Rotating in Bengaluru", service: "microwave-repair", problem: "Turntable not rotating" },
  { slug: "microwave-buttons-not-working", title: "Microwave Buttons Not Working in Bengaluru", service: "microwave-repair", problem: "Buttons not working" },
  { slug: "microwave-not-turning-on", title: "Microwave Not Turning On in Bengaluru", service: "microwave-repair", problem: "Not turning on" },
  { slug: "ac-not-cooling", title: "AC Not Cooling in Bengaluru", service: "ac-repair", problem: "Less or no cooling" },
  { slug: "ac-gas-refill", title: "AC Gas Refill in Bengaluru", service: "ac-repair", problem: "Gas refill needed" },
  { slug: "ac-water-leakage", title: "AC Water Leakage in Bengaluru", service: "ac-repair", problem: "Water leakage" },
  { slug: "ac-not-turning-on", title: "AC Not Turning On in Bengaluru", service: "ac-repair", problem: "Not turning on" },
  { slug: "ac-noise-vibration", title: "AC Noise or Vibration in Bengaluru", service: "ac-repair", problem: "Noise or vibration" },
  { slug: "washing-machine-not-draining", title: "Washing Machine Not Draining in Bengaluru", service: "washing-machine-repair", problem: "Not draining" },
  { slug: "washing-machine-not-spinning", title: "Washing Machine Not Spinning in Bengaluru", service: "washing-machine-repair", problem: "Not spinning" },
  { slug: "washing-machine-noisy-drum", title: "Washing Machine Noisy Drum in Bengaluru", service: "washing-machine-repair", problem: "Noisy drum" },
  { slug: "washing-machine-door-jammed", title: "Washing Machine Door Jammed in Bengaluru", service: "washing-machine-repair", problem: "Door jammed" },
  { slug: "refrigerator-not-cooling", title: "Refrigerator Not Cooling in Bengaluru", service: "refrigerator-repair", problem: "Not cooling" },
  { slug: "fridge-water-leakage", title: "Fridge Water Leakage in Bengaluru", service: "refrigerator-repair", problem: "Water leakage" },
  { slug: "fridge-compressor-noise", title: "Fridge Compressor Noise in Bengaluru", service: "refrigerator-repair", problem: "Compressor noise" },
  { slug: "fridge-frost-buildup", title: "Fridge Frost Buildup in Bengaluru", service: "refrigerator-repair", problem: "Frost build-up" },
];
