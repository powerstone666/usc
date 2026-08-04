const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export function isTelegramConfigured(): boolean {
  return Boolean(BOT_TOKEN && CHAT_ID);
}

async function send(message: string): Promise<boolean> {
  if (!isTelegramConfigured()) return false;

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message,
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
        signal: AbortSignal.timeout(5000),
      },
    );
    const data = await res.json();
    return Boolean(data.ok);
  } catch {
    return false;
  }
}

export type LeadNotification = {
  leadId: string;
  appliance: string;
  issue: string;
  name: string;
  phoneLast4: string;
  source: string;
  city: string;
  region: string;
  isp: string;
  browser: string;
  os: string;
  deviceType: string;
  screenResolution: string;
  trafficSource: string;
  trafficMedium: string;
  trafficCategory: string;
  timeOnPage: number;
  fingerprint: string;
  pageUrl: string;
};

export async function sendLeadNotification(lead: LeadNotification): Promise<boolean> {
  const lines = [
    "<b>NEW LEAD</b>",
    "",
    `<b>Appliance:</b> ${lead.appliance}`,
    lead.issue ? `<b>Issue:</b> ${lead.issue}` : "",
    lead.name ? `<b>Name:</b> ${lead.name}` : "",
    `<b>Phone:</b> ****${lead.phoneLast4}`,
    `<b>Source:</b> ${lead.source}`,
    "",
    "<b>--- Location ---</b>",
    `<b>City:</b> ${lead.city || "—"}`,
    `<b>Region:</b> ${lead.region || "—"}`,
    `<b>ISP:</b> ${lead.isp || "—"}`,
    "",
    "<b>--- Device ---</b>",
    `<b>Browser:</b> ${lead.browser || "—"}`,
    `<b>OS:</b> ${lead.os || "—"}`,
    `<b>Device:</b> ${lead.deviceType}`,
    `<b>Screen:</b> ${lead.screenResolution || "—"}`,
    "",
    "<b>--- Traffic ---</b>",
    `<b>Source:</b> ${lead.trafficSource || "—"}`,
    `<b>Medium:</b> ${lead.trafficMedium || "—"}`,
    `<b>Category:</b> ${lead.trafficCategory || "—"}`,
    "",
    "<b>--- Engagement ---</b>",
    `<b>Time on page:</b> ${lead.timeOnPage > 0 ? Math.round(lead.timeOnPage / 1000) + "s" : "—"}`,
    `<b>Fingerprint:</b> <code>${lead.fingerprint || "—"}</code>`,
    `<b>Page:</b> ${lead.pageUrl || "—"}`,
    "",
    `<b>Lead ID:</b> <code>${lead.leadId}</code>`,
  ].filter(Boolean);

  return send(lines.join("\n"));
}

export type EventNotification = {
  event: string;
  source: string;
  city: string;
  isp: string;
  browser: string;
  os: string;
  deviceType: string;
  trafficCategory: string;
  timeOnPage: number;
  fingerprint: string;
  pageUrl: string;
};

export async function sendEventNotification(evt: EventNotification): Promise<boolean> {
  const lines = [
    `<b>${evt.event.toUpperCase()}</b>`,
    "",
    `<b>Source:</b> ${evt.source}`,
    `<b>City:</b> ${evt.city || "—"}`,
    `<b>ISP:</b> ${evt.isp || "—"}`,
    `<b>Device:</b> ${evt.deviceType} / ${evt.browser || "—"} / ${evt.os || "—"}`,
    `<b>Traffic:</b> ${evt.trafficCategory || "—"}`,
    `<b>Time on page:</b> ${evt.timeOnPage > 0 ? Math.round(evt.timeOnPage / 1000) + "s" : "—"}`,
    `<b>Fingerprint:</b> <code>${evt.fingerprint || "—"}</code>`,
    `<b>Page:</b> ${evt.pageUrl || "—"}`,
  ];

  return send(lines.join("\n"));
}
