"use client";

import { useState } from "react";

export function IndexNowPanel({ enabled, demo }: { enabled: boolean; demo: boolean }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  async function submit() {
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/indexnow", { method: "POST" });
      const data = (await res.json()) as { ok?: boolean; submitted?: number; skipped?: string; error?: string };
      setMessage(data.ok ? { ok: true, text: data.skipped ?? `Sent ${data.submitted?.toLocaleString("en-IN")} addresses to IndexNow.` } : { ok: false, text: data.error ?? "Could not submit." });
    } catch (e) {
      setMessage({ ok: false, text: e instanceof Error ? e.message : "Request failed" });
    } finally {
      setBusy(false);
    }
  }

  if (!enabled) {
    return (
      <p className="text-sm text-on-surface-variant">
        Off. Add <code className="rounded bg-surface-variant px-1.5 py-0.5">INDEXNOW_KEY</code> (8–128 letters, numbers or dashes) to your environment variables. The key file is then served automatically at <code className="rounded bg-surface-variant px-1.5 py-0.5">/&lt;key&gt;.txt</code>.
      </p>
    );
  }
  return (
    <div className="space-y-3">
      <button type="button" onClick={submit} disabled={busy} aria-busy={busy} className="btn-zoom min-h-11 rounded-xl bg-primary px-5 text-sm font-bold text-on-primary hover:bg-secondary disabled:opacity-50">
        {busy ? "Sending…" : "Send all pages to search engines"}
      </button>
      {demo && <p className="text-sm text-muted">Demo mode: nothing is actually sent.</p>}
      {message && <p role="status" className={`text-sm font-bold ${message.ok ? "text-success" : "text-error"}`}>{message.text}</p>}
    </div>
  );
}
