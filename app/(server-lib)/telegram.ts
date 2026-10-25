const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

function isTelegramConfigured(): boolean {
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

const applianceNames: Record<string, string> = {
  "microwave-repair": "Microwave Oven Repair",
  "ac-repair": "AC Repair & Service",
  "washing-machine-repair": "Washing Machine Repair",
  "refrigerator-repair": "Refrigerator Repair",
  "water-filter-repair": "Water Purifier / RO Repair",
  "chimney-repair": "Kitchen Chimney Repair",
  general: "General Appliance Repair",
};

export type LeadNotification = {
  leadId?: string;
  appliance: string;
  issue?: string;
  name?: string;
  phone: string;
  city?: string;
  region?: string;
  country?: string;
  ipAddress?: string;
  isp?: string;
  deviceType?: string;
  browser?: string;
  os?: string;
};

export async function sendLeadNotification(lead: LeadNotification): Promise<boolean> {
  const applianceDisplay =
    applianceNames[lead.appliance] || lead.appliance || "Appliance Repair";

  const locationParts = [lead.city, lead.region, lead.country].filter(Boolean);
  const locationStr = locationParts.length > 0 ? locationParts.join(", ") : "—";

  const deviceParts = [lead.deviceType, lead.os, lead.browser].filter(Boolean);
  const deviceStr = deviceParts.length > 0 ? deviceParts.join(" · ") : "—";

  const lines = [
    "🔔 <b>NEW SERVICE REQUEST</b>",
    "",
    `📞 <b>Phone:</b> <a href="tel:+91${lead.phone}">+91 ${lead.phone}</a>`,
    `👤 <b>Name:</b> ${lead.name || "Not provided"}`,
    `🔧 <b>Appliance:</b> ${applianceDisplay}`,
    lead.issue ? `⚠️ <b>User Query:</b> ${lead.issue}` : "",
    "",
    "<b>── User Info ──</b>",
    `📍 <b>Location:</b> ${locationStr}`,
    `🌐 <b>IP Address:</b> <code>${lead.ipAddress || "—"}</code>`,
    `🏢 <b>ISP:</b> ${lead.isp || "—"}`,
    `📱 <b>Device:</b> ${deviceStr}`,
  ].filter(Boolean);

  return send(lines.join("\n"));
}
