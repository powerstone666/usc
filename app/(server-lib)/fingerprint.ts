import { createHash } from "crypto";

export type FingerprintInput = {
  ipAddress: string;
  userAgent: string;
  screenResolution?: string;
  language?: string;
  timezone?: string;
  colorDepth?: number;
  deviceType?: string;
};

export function generateFingerprint(input: FingerprintInput): string {
  const components = [
    input.ipAddress || "",
    input.userAgent || "",
    input.screenResolution || "",
    input.language || "",
    input.timezone || "",
    String(input.colorDepth || ""),
    input.deviceType || "",
  ];
  return createHash("sha256").update(components.join("|")).digest("hex").slice(0, 32);
}
