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

export type ClientTelemetry = {
  session_id?: string;
  time_on_page?: number;
  page_url?: string;
  page_path?: string;
  page_title?: string;
  screen_resolution?: string;
  viewport?: string;
  color_depth?: number;
  device_type?: string;
  language?: string;
  timezone?: string;
  hardware_concurrency?: number;
  platform?: string;
  touch_support?: boolean;
  referrer?: string;
  traffic_source?: string;
  traffic_medium?: string;
  traffic_category?: string;
  traffic_campaign?: string;
  gclid?: string;
};

export type LeadInput = {
  appliance: ServiceSlug;
  issue?: string;
  brand?: string;
  name?: string;
  phone: string;
  source?: string;
  telemetry?: ClientTelemetry;
};
