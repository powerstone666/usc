import { UAParser } from "ua-parser-js";

export type ServerTelemetry = {
  ipAddress: string;
  userAgent: string;
  city: string;
  region: string;
  country: string;
  isp: string;
  asn: string;
  latitude: string;
  longitude: string;
  browser: string;
  browserVersion: string;
  os: string;
  osVersion: string;
  deviceType: string;
  deviceModel: string;
  deviceVendor: string;
};

function getIP(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const ip = forwarded.split(",")[0].trim();
    if (ip) return ip;
  }
  const real = headers.get("x-real-ip");
  if (real) return real;
  return "0.0.0.0";
}

function parseUserAgent(ua: string, headers: Headers) {
  const parser = new UAParser(ua);
  const device = parser.getDevice();
  const os = parser.getOS();
  const browser = parser.getBrowser();

  let deviceModel = device.model || "";
  let deviceVendor = device.vendor || "";

  const chModel = headers.get("sec-ch-ua-model");
  if (chModel && chModel !== '""' && chModel !== "") {
    deviceModel = chModel.replace(/"/g, "");
  }

  const chPlatform = headers.get("sec-ch-ua-platform");
  if (chPlatform && chPlatform.replace(/"/g, "") && !os.name) {
    os.name = chPlatform.replace(/"/g, "");
  }

  return {
    browser: browser.name || "",
    browserVersion: browser.version || "",
    os: os.name || "",
    osVersion: os.version || "",
    deviceType: device.type || "desktop",
    deviceModel,
    deviceVendor,
  };
}

async function resolveIP(ip: string): Promise<{
  city: string;
  region: string;
  country: string;
  isp: string;
  asn: string;
  latitude: string;
  longitude: string;
}> {
  const empty = { city: "", region: "", country: "", isp: "", asn: "", latitude: "", longitude: "" };
  if (!ip || ip === "0.0.0.0" || ip === "127.0.0.1") return empty;

  try {
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,country,regionName,city,isp,as,query,lat,lon`, {
      signal: AbortSignal.timeout(3000),
    });
    const data = await res.json();
    if (data.status !== "success") return empty;
    return {
      city: data.city || "",
      region: data.regionName || "",
      country: data.country || "",
      isp: data.isp || "",
      asn: data.as || "",
      latitude: data.lat ? String(data.lat) : "",
      longitude: data.lon ? String(data.lon) : "",
    };
  } catch {
    return empty;
  }
}

export async function collectTelemetry(headers: Headers): Promise<ServerTelemetry> {
  const ip = getIP(headers);
  const ua = headers.get("user-agent") || "";
  const parsed = parseUserAgent(ua, headers);
  const geo = await resolveIP(ip);

  return {
    ipAddress: ip,
    userAgent: ua,
    city: geo.city,
    region: geo.region,
    country: geo.country,
    isp: geo.isp,
    asn: geo.asn,
    latitude: geo.latitude,
    longitude: geo.longitude,
    browser: parsed.browser,
    browserVersion: parsed.browserVersion,
    os: parsed.os,
    osVersion: parsed.osVersion,
    deviceType: parsed.deviceType,
    deviceModel: parsed.deviceModel,
    deviceVendor: parsed.deviceVendor,
  };
}
