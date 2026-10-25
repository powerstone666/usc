"use client";

import { useState } from "react";

const ACTIONS = [
  { target: "page_views", title: "Clear visitor data", body: "Deletes every recorded page view. Use this to remove test traffic. Leads are kept." },
  { target: "all_leads", title: "Clear all leads", body: "Deletes every lead permanently. This cannot be undone." },
  { target: "full_reset", title: "Full reset", body: "Deletes all leads and visitor data. This cannot be undone." },
];

export function DataTools({ demo }: { demo: boolean }) {
  const [open, setOpen] = useState<string | null>(null);
  const [typed, setTyped] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  async function run(target: string) {
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/cleanup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ target }) });
      const data = await res.json();
      setMessage({ ok: Boolean(data.ok), text: data.message || data.error || "Done" });
      if (data.ok) {
        setOpen(null);
        setTyped("");
      }
    } catch (e) {
      setMessage({ ok: false, text: e instanceof Error ? e.message : "Request failed" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-3">
      {demo && <p className="rounded-xl bg-warning/15 px-4 py-3 text-sm text-on-surface">Demo mode is on, but these buttons act on your real database. Turn demo mode off before using them.</p>}
      {ACTIONS.map((a) => (
        <div key={a.target} className="rounded-xl border border-outline-variant p-4">
          <p className="text-base font-bold text-on-surface">{a.title}</p>
          <p className="mt-0.5 text-sm text-on-surface-variant">{a.body}</p>
          {open === a.target ? (
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
              <label className="flex flex-col gap-1 sm:flex-1">
                <span className="text-sm font-bold text-on-surface">Type DELETE to confirm</span>
                <input value={typed} onChange={(e) => setTyped(e.target.value)} autoComplete="off" className="min-h-11 rounded-xl border border-outline bg-background px-3 text-base outline-none focus:border-error focus:ring-2 focus:ring-error/20" />
              </label>
              <div className="flex gap-2 sm:mt-6">
                <button type="button" disabled={typed !== "DELETE" || busy} aria-busy={busy} onClick={() => run(a.target)} className="min-h-11 rounded-xl bg-error px-4 text-sm font-bold text-on-error disabled:cursor-not-allowed disabled:opacity-50">{busy ? "Deleting…" : "Delete"}</button>
                <button type="button" onClick={() => { setOpen(null); setTyped(""); }} className="min-h-11 rounded-xl px-3 text-sm font-bold text-on-surface-variant hover:bg-surface-variant">Cancel</button>
              </div>
            </div>
          ) : (
            <button type="button" onClick={() => { setOpen(a.target); setTyped(""); setMessage(null); }} className="mt-3 min-h-11 rounded-xl border border-error px-4 text-sm font-bold text-error hover:bg-error/10">{a.title}</button>
          )}
        </div>
      ))}
      {message && <p role="status" className={`text-sm font-medium ${message.ok ? "text-success" : "text-error"}`}>{message.text}</p>}
    </div>
  );
}
