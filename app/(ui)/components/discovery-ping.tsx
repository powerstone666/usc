"use client";

import { useEffect } from "react";

// Asks the server to check for new keyword pages. The server runs discovery at most once a day,
// so this is a no-op request almost every time. Renders nothing.
export function DiscoveryPing({ onResult }: { onResult?: (added: number) => void }) {
  useEffect(() => {
    const key = "usc-discovery-ping";
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      /* storage blocked: still ping once per mount */
    }
    fetch("/api/keywords/auto", { method: "POST", keepalive: true })
      .then((r) => r.json())
      .then((j: { added?: number }) => onResult?.(j.added ?? 0))
      .catch(() => {});
  }, [onResult]);
  return null;
}
