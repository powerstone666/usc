"use client";

import { useMemo, useState } from "react";

const PRESETS = [
  { label: "Google Ads", source: "google", medium: "cpc" },
  { label: "Facebook / Instagram ads", source: "facebook", medium: "paid" },
  { label: "Instagram bio or post", source: "instagram", medium: "social" },
  { label: "WhatsApp share", source: "whatsapp", medium: "social" },
  { label: "Google Business Profile", source: "google", medium: "organic" },
  { label: "Flyer or QR code", source: "flyer", medium: "offline" },
];

const slug = (s: string) => s.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const field =
  "min-h-11 w-full rounded-xl border border-outline bg-background px-3 text-base text-on-surface outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20";

export function UtmBuilder() {
  const [page, setPage] = useState("https://urbanservicecompany.in/");
  const [source, setSource] = useState("google");
  const [medium, setMedium] = useState("cpc");
  const [campaign, setCampaign] = useState("");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    try {
      const u = new URL(page);
      if (slug(source)) u.searchParams.set("utm_source", slug(source));
      if (slug(medium)) u.searchParams.set("utm_medium", slug(medium));
      if (slug(campaign)) u.searchParams.set("utm_campaign", slug(campaign));
      return { url: u.toString(), error: "" };
    } catch {
      return { url: "", error: "Enter a full page address starting with https://" };
    }
  }, [page, source, medium, campaign]);

  async function copy() {
    if (!result.url) return;
    try {
      await navigator.clipboard.writeText(result.url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Presets">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => { setSource(p.source); setMedium(p.medium); }}
            aria-pressed={source === p.source && medium === p.medium}
            className={`min-h-11 rounded-xl border px-3 text-sm font-bold transition-colors ${source === p.source && medium === p.medium ? "border-primary bg-primary-container text-on-primary-container" : "border-outline-variant bg-surface text-on-surface-variant hover:border-primary"}`}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 sm:col-span-2">
          <span className="text-sm font-bold text-on-surface">Page to link to</span>
          <input value={page} onChange={(e) => setPage(e.target.value)} inputMode="url" className={field} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-bold text-on-surface">Source <span className="font-normal text-muted">(who sends the visitor)</span></span>
          <input value={source} onChange={(e) => setSource(e.target.value)} className={field} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-bold text-on-surface">Medium <span className="font-normal text-muted">(cpc, paid, social…)</span></span>
          <input value={medium} onChange={(e) => setMedium(e.target.value)} className={field} />
        </label>
        <label className="flex flex-col gap-1 sm:col-span-2">
          <span className="text-sm font-bold text-on-surface">Campaign name <span className="font-normal text-muted">(e.g. microwave-search, diwali-offer)</span></span>
          <input value={campaign} onChange={(e) => setCampaign(e.target.value)} className={field} />
        </label>
      </div>
      {result.error ? (
        <p role="alert" className="text-sm font-medium text-error">{result.error}</p>
      ) : (
        <div className="rounded-xl bg-surface-variant p-3">
          <p className="break-all font-mono text-sm text-on-surface">{result.url}</p>
          <button type="button" onClick={copy} className="btn-tonal mt-3">{copied ? "Copied" : "Copy link"}</button>
        </div>
      )}
    </div>
  );
}
