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

const AI_DOMAINS = [
  "chatgpt.com", "chat.openai.com", "openai.com", "perplexity.ai",
  "claude.ai", "anthropic.com", "copilot.microsoft.com", "gemini.google.com",
  "poe.com", "you.com",
];

const MAPS_DOMAINS = [
  "maps.google.com", "maps.app.goo.gl", "google.com/maps", "maps.apple.com",
];

const SOCIAL_DOMAINS = [
  "facebook.com", "fb.com", "m.facebook.com", "l.facebook.com", "lm.facebook.com",
  "instagram.com", "l.instagram.com",
  "twitter.com", "x.com", "t.co",
  "linkedin.com", "lnkd.in",
  "youtube.com", "youtu.be",
  "pinterest.com", "reddit.com",
  "telegram.org", "t.me",
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
    let cat = "utm";
    const srcLower = utmSource.toLowerCase();
    if (srcLower.includes("chatgpt") || srcLower.includes("perplexity") || srcLower.includes("claude") || srcLower.includes("ai")) {
      cat = "ai-search";
    } else if (srcLower.includes("maps") || srcLower.includes("gmb") || srcLower.includes("local")) {
      cat = "google-maps";
    } else if (srcLower.includes("facebook") || srcLower.includes("fb") || srcLower.includes("instagram") || srcLower.includes("meta")) {
      cat = "social";
    } else if (gclid || utmMedium === "cpc" || utmMedium === "ppc") {
      cat = "ppc";
    }
    return {
      source: utmSource,
      medium: utmMedium || (gclid ? "ppc" : "campaign"),
      campaign: utmCampaign,
      term: utmTerm,
      content: utmContent,
      gclid,
      category: cat,
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
    return { source: "direct", medium: "none", campaign: "", term: "", content: "", gclid: "", category: "direct" };
  }

  let refHost = "";
  try {
    refHost = new URL(referrer).hostname.replace(/^www\./, "");
  } catch {
    refHost = referrer;
  }

  // 1. AI Search / ChatGPT / Perplexity / Claude
  if (AI_DOMAINS.some((d) => refHost.includes(d) || referrer.includes(d))) {
    let aiName = "chatgpt";
    if (refHost.includes("perplexity")) aiName = "perplexity";
    else if (refHost.includes("claude") || refHost.includes("anthropic")) aiName = "claude";
    else if (refHost.includes("copilot")) aiName = "copilot";
    else if (refHost.includes("gemini")) aiName = "gemini";
    return {
      source: aiName,
      medium: "ai-referral",
      campaign: "",
      term: "",
      content: "",
      gclid: "",
      category: "ai-search",
    };
  }

  // 2. Google Maps / Local SEO
  if (MAPS_DOMAINS.some((d) => refHost.includes(d) || referrer.includes(d))) {
    return {
      source: "google-maps",
      medium: "local-seo",
      campaign: "",
      term: "",
      content: "",
      gclid: "",
      category: "google-maps",
    };
  }

  // 3. WhatsApp Direct
  if (refHost.includes("whatsapp.com") || refHost.includes("wa.me")) {
    return {
      source: "whatsapp",
      medium: "chat",
      campaign: "",
      term: "",
      content: "",
      gclid: "",
      category: "whatsapp",
    };
  }

  // 4. Social Media (Facebook, Instagram, etc.)
  if (SOCIAL_DOMAINS.some((d) => refHost.includes(d))) {
    let socName = "facebook";
    if (refHost.includes("instagram")) socName = "instagram";
    else if (refHost.includes("t.co") || refHost.includes("twitter") || refHost.includes("x.com")) socName = "x";
    else if (refHost.includes("linkedin")) socName = "linkedin";
    else if (refHost.includes("youtube")) socName = "youtube";
    return {
      source: socName,
      medium: "social",
      campaign: "",
      term: "",
      content: "",
      gclid: "",
      category: "social",
    };
  }

  // 5. Organic Search (Google, Bing)
  if (SEARCH_DOMAINS.some((d) => refHost.includes(d))) {
    let searchName = "google";
    if (refHost.includes("bing")) searchName = "bing";
    else if (refHost.includes("duckduckgo")) searchName = "duckduckgo";
    return {
      source: searchName,
      medium: "organic",
      campaign: "",
      term: "",
      content: "",
      gclid: "",
      category: "organic-search",
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
      const sendInitial = () => {
        this.push("session_start");
        this.sendPageViewBeacon();
      };
      if (typeof window.requestIdleCallback === "function") {
        window.requestIdleCallback(sendInitial);
      } else {
        setTimeout(sendInitial, 150);
      }
    }
    if (!this.scrollInit) {
      this.scrollInit = true;
      this.initScrollTracking();
    }
  }

  onRouteChange(path: string) {
    this.push("page_view", { page_path: path });
    this.sendPageViewBeacon();
  }

  private sendPageViewBeacon() {
    if (typeof window === "undefined") return;
    if (!navigator.sendBeacon) return;
    const telemetry = this.getTelemetry();
    telemetry.page_title = document.title;
    const blob = new Blob(
      [JSON.stringify({ telemetry })],
      { type: "application/json" },
    );
    navigator.sendBeacon("/api/track", blob);
  }

  // Only taps that create a lead need the server. Every other interaction goes to GA4/GTM
  // through the dataLayer (see push) and is not stored in our database.
  private sendEventBeacon(event: string, source: string, extra?: Record<string, unknown>) {
    if (event !== "tel_click" && event !== "whatsapp_click") return;
    if (typeof window === "undefined") return;
    if (!navigator.sendBeacon) return;
    const payload: Record<string, unknown> = { event, source, telemetry: this.getTelemetry() };
    if (extra) payload.extra = extra;
    const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
    navigator.sendBeacon("/api/track-event", blob);
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
            this.sendEventBeacon("scroll_depth", "page", { depth_percent: m });
          }
        }
      },
      { passive: true },
    );
  }

  clickToCall(source: string) {
    this.push("click_to_call", { source, interaction_type: "call_button" });
    this.sendEventBeacon("click_to_call", source);
  }

  diagnosticOpen() {
    this.push("diagnostic_open", { interaction_type: "diagnostic_popup" });
    this.sendEventBeacon("diagnostic_open", "diagnostic-popup");
  }

  diagnosticCategory(service: string) {
    this.push("diagnostic_category_selected", { service, interaction_type: "diagnostic_popup" });
    this.sendEventBeacon("diagnostic_category_selected", "diagnostic-popup", { service });
  }

  diagnosticSubmit(service: string, issue: string) {
    this.push("diagnostic_submit", { service, issue, interaction_type: "diagnostic_popup" });
    this.sendEventBeacon("diagnostic_submit", "diagnostic-popup", { service, issue });
  }

  leadFormSubmit(appliance: string, source: string) {
    this.push("lead_form_submit", { appliance, source, interaction_type: "lead_form" });
    this.sendEventBeacon("lead_form_submit", source, { appliance });
  }

  generateLead(source: string, appliance: string) {
    this.push("generate_lead", { source, appliance, value: 1, currency: "INR" });
    this.sendEventBeacon("generate_lead", source, { appliance });
  }

  whatsappClick(source: string) {
    this.push("whatsapp_click", { source, interaction_type: "whatsapp_link" });
    this.sendEventBeacon("whatsapp_click", source);
  }

  telClick(source: string) {
    this.push("tel_click", { source, interaction_type: "tel_link" });
    this.sendEventBeacon("tel_click", source);
  }

  pageView(url: string, title: string) {
    this.push("page_view", { page_url: url, page_title: title });
  }

  getTelemetry(): Record<string, unknown> {
    if (typeof window === "undefined") return {};
    let timezone = "";
    try { timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || ""; } catch {}
    return {
      session_id: this.sessionId,
      time_on_page: Date.now() - this.sessionStart,
      page_url: window.location.href,
      page_path: window.location.pathname,
      page_title: document.title,
      screen_resolution: `${window.screen.width}x${window.screen.height}`,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      color_depth: window.screen.colorDepth,
      device_type: this.getDeviceType(),
      language: navigator.language,
      timezone,
      hardware_concurrency: navigator.hardwareConcurrency || 0,
      platform: navigator.platform || "",
      touch_support: "ontouchstart" in window,
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
