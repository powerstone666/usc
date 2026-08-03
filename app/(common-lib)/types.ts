export type ServiceSlug =
  | "microwave-repair"
  | "ac-repair"
  | "washing-machine-repair"
  | "refrigerator-repair"
  | "water-filter-repair"
  | "chimney-repair";

export type ApplianceIcon =
  | "microwave"
  | "ac"
  | "washing-machine"
  | "refrigerator"
  | "water-filter"
  | "chimney";

export type LeadInput = {
  appliance: ServiceSlug;
  issue?: string;
  brand?: string;
  name?: string;
  phone: string;
  source?: string;
};
