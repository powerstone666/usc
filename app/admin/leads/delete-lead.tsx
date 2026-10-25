"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteLead({ id, demo }: { id: string; demo: boolean }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function remove() {
    if (demo) {
      setError("Delete is disabled in demo mode.");
      setConfirming(false);
      return;
    }
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/leads", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Could not delete");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not delete");
      setBusy(false);
      setConfirming(false);
    }
  }

  if (confirming) {
    return (
      <span className="ml-auto flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-on-surface-variant">Delete this lead?</span>
        <button type="button" onClick={remove} disabled={busy} aria-busy={busy} className="min-h-11 rounded-xl bg-error px-4 text-sm font-bold text-on-error disabled:opacity-60">{busy ? "Deleting…" : "Yes, delete"}</button>
        <button type="button" onClick={() => setConfirming(false)} className="min-h-11 rounded-xl px-3 text-sm font-bold text-on-surface-variant hover:bg-surface-variant">Cancel</button>
      </span>
    );
  }
  return (
    <span className="ml-auto flex flex-col items-end">
      <button type="button" onClick={() => setConfirming(true)} className="min-h-11 rounded-xl px-3 text-sm font-bold text-error hover:bg-error/10">Delete</button>
      {error && <span role="alert" className="text-sm font-medium text-error">{error}</span>}
    </span>
  );
}
