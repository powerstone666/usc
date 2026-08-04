declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

function generateSessionId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

type TrafficSource = {
  source: string;
  medium: string;
  campaign: string;
  term: string;
  content: string;
  gclid: string;
  category: string;
};

const SOCIAL_DOMAINS = [
  "facebook.com", "fb.com", "instagram.com", "twitter.com", "x.com",
  "linkedin.com", "youtube.com", "pinterest.com", "reddit.com",
  "t.co", "wa.me", "whatsapp.com", "telegram.org",
];

const SEARCH_DOMAINS = [
  "google.com", "google.co.in", "bing.com", "yahoo.com", "duckduckgo.com",
  "baidu.com", "yandex.com", "ecosia.org",
];

function detectTrafficSource(): TrafficSource {
  if (typeof window === "undefined") {
    return { source: "", medium: "", campaign: "", term: "", content: "", gclid: "", category: "" };
  }

  const params = new URLSearchParams(window.location.search);
  const utmSource = params.get("utm_source") || "";
  const utmMedium = params.get("utm_medium") || "";
  const utmCampaign = params.get("utm_campaign") || "";
  const utmTerm = params.get("utm_term") || "";
  const utmContent = params.get("utm_content") || "";
  const gclid = params.get("gclid") || "";
  const referrer = document.referrer || "";

  if (utmSource || utmMedium || gclid) {
    return {
      source: utmSource,
      medium: utmMedium,
      campaign: utmCampaign,
      term: utmTerm,
      content: utmContent,
      gclid,
      category: "utm",
    };
  }

  if (gclid) {
    return {
      source: "google",
      medium: "ppc",
      campaign: "",
      term: "",
      content: "",
      gclid,
      category: "ppc",
    };
  }

  if (!referrer) {
    return { source: "", medium: "", campaign: "", term: "", content: "", gclid: "", category: "direct" };
  }

  let refHost = "";
  try {
    refHost = new URL(referrer).hostname.replace(/^www\./, "");
  } catch {
    refHost = referrer;
  }

  if (SEARCH_DOMAINS.some((d) => refHost.includes(d))) {
    return {
      source: refHost,
      medium: "organic",
      campaign: "",
      term: "",
      content: "",
      gclid: "",
      category: "organic-search",
    };
  }

  if (refHost.includes("whatsapp.com") || refHost.includes("wa.me")) {
    return {
      source: "whatsapp",
      medium: "social",
      campaign: "",
      term: "",
      content: "",
      gclid: "",
      category: "whatsapp",
    };
  }

  if (SOCIAL_DOMAINS.some((d) => refHost.includes(d))) {
    return {
      source: refHost,
      medium: "social",
      campaign: "",
      term: "",
      content: "",
      gclid: "",
      category: "social",
    };
  }

  if (referrer.includes("g.doubleclick.net") || referrer.includes("googleads")) {
    return {
      source: "google",
      medium: "ppc",
      campaign: "",
      term: "",
      content: "",
      gclid: "",
      category: "ppc",
    };
  }

  return {
    source: refHost,
    medium: "referral",
    campaign: "",
    term: "",
    content: "",
    gclid: "",
    category: "referral",
  };
}

class Analytics {
  private sessionStart: number;
  private sessionId: string;
  private scrollInit = false;
  private sessionStartPushed = false;
  private trafficSource: TrafficSource;

  constructor() {
    this.sessionStart = typeof window !== "undefined" ? Date.now() : 0;
    this.sessionId = generateSessionId();
    this.trafficSource = detectTrafficSource();
    if (typeof window !== "undefined" && this.trafficSource.category !== "direct") {
      try {
        sessionStorage.setItem("usc_traffic", JSON.stringify(this.trafficSource));
      } catch {}
    }
    if (typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem("usc_traffic");
        if (stored) this.trafficSource = JSON.parse(stored);
      } catch {}
    }
  }

  private getDeviceType(): string {
    if (typeof window === "undefined") return "unknown";
    const ua = navigator.userAgent;
    if (/tablet|ipad/i.test(ua)) return "tablet";
    if (/mobile|android|iphone/i.test(ua)) return "mobile";
    return "desktop";
  }

  private getBaseContext(): Record<string, unknown> {
    if (typeof window === "undefined") return {};
    return {
      session_id: this.sessionId,
      time_on_page: Date.now() - this.sessionStart,
      page_url: window.location.href,
      page_title: document.title,
      page_path: window.location.pathname,
      screen_resolution: `${window.screen.width}x${window.screen.height}`,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      color_depth: window.screen.colorDepth,
      device_type: this.getDeviceType(),
      language: navigator.language,
      referrer: document.referrer,
      traffic_source: this.trafficSource.source,
      traffic_medium: this.trafficSource.medium,
      traffic_category: this.trafficSource.category,
      traffic_campaign: this.trafficSource.campaign,
      gclid: this.trafficSource.gclid,
    };
  }

  private push(event: string, params?: Record<string, unknown>) {
    if (typeof window === "undefined") return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...this.getBaseContext(), ...params });
  }

  init() {
    if (typeof window === "undefined") return;
    if (!this.sessionStartPushed) {
      this.sessionStartPushed = true;
      this.push("session_start");
    }
    if (!this.scrollInit) {
      this.scrollInit = true;
      this.initScrollTracking();
    }
  }

  private initScrollTracking() {
    const milestones = [25, 50, 75, 100];
    const reached = new Set<number>();

    window.addEventListener(
      "scroll",
      () => {
        const scrollPct =
          ((window.scrollY + window.innerHeight) /
            document.documentElement.scrollHeight) *
          100;
        for (const m of milestones) {
          if (scrollPct >= m && !reached.has(m)) {
            reached.add(m);
            this.push("scroll_depth", { depth_percent: m });
          }
        }
      },
      { passive: true },
    );
  }

  clickToCall(source: string) {
    this.push("click_to_call", { source, interaction_type: "call_button" });
  }

  diagnosticOpen() {
    this.push("diagnostic_open", { interaction_type: "diagnostic_popup" });
  }

  diagnosticCategory(service: string) {
    this.push("diagnostic_category_selected", { service, interaction_type: "diagnostic_popup" });
  }

  diagnosticSubmit(service: string, issue: string) {
    this.push("diagnostic_submit", { service, issue, interaction_type: "diagnostic_popup" });
  }

  leadFormSubmit(appliance: string, source: string) {
    this.push("lead_form_submit", { appliance, source, interaction_type: "lead_form" });
  }

  generateLead(source: string, appliance: string) {
    this.push("generate_lead", { source, appliance, value: 1, currency: "INR" });
  }

  whatsappClick(source: string) {
    this.push("whatsapp_click", { source, interaction_type: "whatsapp_link" });
  }

  pageView(url: string, title: string) {
    this.push("page_view", { page_url: url, page_title: title });
  }

  getTelemetry(): Record<string, unknown> {
    if (typeof window === "undefined") return {};
    return {
      session_id: this.sessionId,
      time_on_page: Date.now() - this.sessionStart,
      page_url: window.location.href,
      page_path: window.location.pathname,
      screen_resolution: `${window.screen.width}x${window.screen.height}`,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      device_type: this.getDeviceType(),
      language: navigator.language,
      referrer: document.referrer,
      traffic_source: this.trafficSource.source,
      traffic_medium: this.trafficSource.medium,
      traffic_category: this.trafficSource.category,
      traffic_campaign: this.trafficSource.campaign,
      gclid: this.trafficSource.gclid,
    };
  }
}

export const analytics = new Analytics();
