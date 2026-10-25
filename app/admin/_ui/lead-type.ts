import type { LeadType } from "@/app/(server-lib)/admin-insights";

// Colour + wording for the three lead types (matches the Leads per day chart legend).
export const TYPE_STYLE: Record<LeadType, { label: string; text: string; dot: string }> = {
  form: { label: "Form request", text: "text-primary", dot: "bg-primary" },
  call: { label: "Call tap", text: "text-tertiary", dot: "bg-tertiary" },
  whatsapp: { label: "WhatsApp tap", text: "text-success", dot: "bg-success" },
};
